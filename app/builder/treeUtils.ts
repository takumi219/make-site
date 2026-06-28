import { CONTAINER_TYPES } from './componentMeta';
import { createDefaultProps } from './utils';

export function generateId() {
    return 'comp_' + Math.random().toString(36).substr(2, 9);
}

export function isContainerType(type: string) {
    return CONTAINER_TYPES.includes(type);
}

export function createComponent(type: string, extraProps: Record<string, any> = {}) {
    const comp: any = {
        id: generateId(),
        type,
        props: { ...createDefaultProps(type), ...extraProps },
    };
    if (isContainerType(type)) {
        comp.children = [];
    }
    if (type === 'parts-tab') {
        comp.children = [
            createComponent('parts-tab-panel', { label: 'タブ1' }),
            createComponent('parts-tab-panel', { label: 'タブ2' }),
            createComponent('parts-tab-panel', { label: 'タブ3' }),
        ];
    }
    return comp;
}

export function normalizeComponents(components: any[]): any[] {
    return (components || []).map((comp) => {
        const next = { ...comp, props: { ...createDefaultProps(comp.type), ...(comp.props || {}) } };
        if (isContainerType(comp.type)) {
            next.children = normalizeComponents(comp.children || []);
        }
        return next;
    });
}

export function findComponent(components: any[], id: string, parent: any = null): any {
    for (let i = 0; i < components.length; i++) {
        const comp = components[i];
        if (comp.id === id) {
            return { node: comp, parent, index: i };
        }
        if (comp.children?.length) {
            const found = findComponent(comp.children, id, comp);
            if (found) return found;
        }
    }
    return null;
}

export function mapComponents(components: any[], fn: (comp: any, parent: any | null) => any, parent: any = null): any[] {
    return components.map((comp) => {
        const mapped = fn(comp, parent);
        if (mapped.children?.length) {
            mapped.children = mapComponents(mapped.children, fn, mapped);
        }
        return mapped;
    });
}

export function updateComponentInTree(components: any[], id: string, updater: (comp: any) => any): any[] {
    return components.map((comp) => {
        if (comp.id === id) {
            return updater({ ...comp, props: { ...comp.props } });
        }
        if (comp.children?.length) {
            return {
                ...comp,
                children: updateComponentInTree(comp.children, id, updater),
            };
        }
        return comp;
    });
}

export function updateComponentProps(components: any[], id: string, key: string, value: any): any[] {
    return updateComponentInTree(components, id, (comp) => ({
        ...comp,
        props: { ...comp.props, [key]: value },
    }));
}

function collectDescendantIds(comp: any): string[] {
    const ids = [comp.id];
    for (const child of comp.children || []) {
        ids.push(...collectDescendantIds(child));
    }
    return ids;
}

export function deleteFromTree(components: any[], id: string): any[] {
    return components
        .filter((comp) => comp.id !== id)
        .map((comp) => {
            if (!comp.children?.length) return comp;
            return { ...comp, children: deleteFromTree(comp.children, id) };
        });
}

export function insertIntoTree(components: any[], parentId: string | null, index: number, newComp: any): any[] {
    if (parentId === null) {
        const next = [...components];
        next.splice(index, 0, newComp);
        return next;
    }

    return components.map((comp) => {
        if (comp.id === parentId) {
            const children = [...(comp.children || [])];
            children.splice(index, 0, newComp);
            return { ...comp, children };
        }
        if (comp.children?.length) {
            return { ...comp, children: insertIntoTree(comp.children, parentId, index, newComp) };
        }
        return comp;
    });
}

export function removeFromTree(components: any[], id: string): { tree: any[]; removed: any | null } {
    let removed: any = null;

    const walk = (list: any[]): any[] => {
        const next: any[] = [];
        for (const comp of list) {
            if (comp.id === id) {
                removed = comp;
                continue;
            }
            if (comp.children?.length) {
                const result = removeFromTree(comp.children, id);
                if (result.removed) {
                    removed = result.removed;
                    next.push({ ...comp, children: result.tree });
                    continue;
                }
            }
            next.push(comp);
        }
        return next;
    };

    return { tree: walk(components), removed };
}

export function moveInTree(components: any[], id: string, targetParentId: string | null, targetIndex: number): any[] {
    const found = findComponent(components, id);
    if (!found) return components;

    if (targetParentId) {
        const blockedIds = collectDescendantIds(found.node);
        if (blockedIds.includes(targetParentId)) return components;
    }

    const sourceParentId = found.parent ? found.parent.id : null;
    let adjustedIndex = targetIndex;
    if (sourceParentId === targetParentId && found.index < targetIndex) {
        adjustedIndex = targetIndex - 1;
    }

    const { tree, removed } = removeFromTree(components, id);
    if (!removed) return components;
    return insertIntoTree(tree, targetParentId, adjustedIndex, removed);
}

export function cloneInTree(components: any[], id: string): any[] {
    const found = findComponent(components, id);
    if (!found) return components;

    const deepClone = (comp: any): any => {
        const clone: any = {
            id: generateId(),
            type: comp.type,
            props: JSON.parse(JSON.stringify(comp.props || {})),
        };
        if (comp.children?.length) {
            clone.children = comp.children.map(deepClone);
        }
        return clone;
    };

    const clone = deepClone(found.node);
    const insertIndex = found.index + 1;
    const parentId = found.parent ? found.parent.id : null;
    return insertIntoTree(components, parentId, insertIndex, clone);
}

export function moveSiblingInTree(components: any[], id: string, direction: number): any[] {
    const found = findComponent(components, id);
    if (!found) return components;
    const parentId = found.parent ? found.parent.id : null;
    const siblings = found.parent ? found.parent.children : components;
    const targetIndex = found.index + direction;
    if (targetIndex < 0 || targetIndex >= siblings.length) return components;
    return moveInTree(components, id, parentId, targetIndex);
}

export function flattenComponents(components: any[]): any[] {
    const result: any[] = [];
    for (const comp of components) {
        result.push(comp);
        if (comp.children?.length) {
            result.push(...flattenComponents(comp.children));
        }
    }
    return result;
}

export function getInsertParentId(components: any[], selectedId: string | null): string | null {
    if (!selectedId) return null;
    const found = findComponent(components, selectedId);
    if (!found) return null;
    if (isContainerType(found.node.type)) return found.node.id;
    if (found.parent && isContainerType(found.parent.type)) return found.parent.id;
    return null;
}
