"use client";
import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import '../css/builder.css';
import '../css/style.css';
import '../css/responsive.css';
import '../css/parts.css';
import '../globals.css';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import Canvas from './Canvas';
import {
    normalizeComponents,
    findComponent,
    createComponent,
    updateComponentProps,
    deleteFromTree,
    cloneInTree,
    moveSiblingInTree,
    insertIntoTree,
    moveInTree,
    getInsertParentId,
    flattenComponents,
} from './treeUtils';

function BuilderPage() {
    const [components, setComponents] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState('edit');
    const [device, setDevice] = useState('desktop');
    const [isClient, setIsClient] = useState(false);
    const [showComponents, setShowComponents] = useState(false);

    useEffect(() => {
        setIsClient(true);
        document.body.classList.add('mode-edit');

        try {
            const saved = localStorage.getItem('aura_builder_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && Array.isArray(parsed.components)) {
                    setComponents(normalizeComponents(parsed.components));
                    if (parsed.selectedId) setSelectedId(parsed.selectedId);
                }
            }
        } catch (e) {
            console.error('Error loading state', e);
        }

        return () => {
            document.body.classList.remove('mode-edit');
        };
    }, []);

    useEffect(() => {
        if (!isClient) return;
        const stateToSave = { components, selectedId };
        localStorage.setItem('aura_builder_state', JSON.stringify(stateToSave));

        setTimeout(() => {
            const toggleElements = document.querySelectorAll('[data-hdr-toggle]');
            toggleElements.forEach((el: any) => {
                el.onclick = function (this: any, e: Event) {
                    e.preventDefault();
                    e.stopPropagation();
                    const header = this.closest('.c-header');
                    if (header) header.classList.toggle('active');
                };
            });

            // Tab initialization
            const tabBoxes = document.querySelectorAll('.js-parts-tab-box');
            tabBoxes.forEach((box: any) => {
                const tabs = box.querySelectorAll('.js-parts-tab-item');
                const panels = box.querySelectorAll('.js-parts-tab-panel');
                tabs.forEach((tab: any, index: number) => {
                    tab.onclick = function(e: Event) {
                        e.preventDefault();
                        e.stopPropagation();
                        tabs.forEach((t: any) => t.classList.remove('active', 'is-active'));
                        panels.forEach((p: any) => {
                            p.classList.remove('active', 'is-active');
                            p.style.display = 'none';
                        });
                        tab.classList.add('active', 'is-active');
                        if (panels[index]) {
                            panels[index].classList.add('active', 'is-active');
                            panels[index].style.display = 'block';
                        }
                    };
                });
            });

            // Slider basic mock initialization
            const sliders = document.querySelectorAll('.js-parts-slider');
            sliders.forEach((slider: any) => {
                const prev = slider.querySelector('.prev');
                const next = slider.querySelector('.next');
                const track = slider.querySelector('.slider');
                if (prev && next && track) {
                    if (slider.dataset.currentIndex === undefined) {
                        slider.dataset.currentIndex = "0";
                    }
                    prev.onclick = (e: Event) => {
                        e.preventDefault(); e.stopPropagation();
                        const item = track.firstElementChild;
                        if(item) {
                            let idx = parseInt(slider.dataset.currentIndex || "0");
                            if (idx > 0) idx--;
                            slider.dataset.currentIndex = idx.toString();
                            track.style.transform = `translateX(-${idx * item.clientWidth}px)`;
                        }
                    };
                    next.onclick = (e: Event) => {
                        e.preventDefault(); e.stopPropagation();
                        const item = track.firstElementChild;
                        const totalItems = track.children.length;
                        if(item) {
                            let idx = parseInt(slider.dataset.currentIndex || "0");
                            if (idx < totalItems - 1) idx++;
                            slider.dataset.currentIndex = idx.toString();
                            track.style.transform = `translateX(-${idx * item.clientWidth}px)`;
                        }
                    };
                }
            });
        }, 100);
    }, [components, selectedId, isClient]);

    const selectedComponent = useMemo(() => {
        if (!selectedId) return null;
        return findComponent(components, selectedId)?.node || null;
    }, [components, selectedId]);

    const handleSelect = (id: string) => {
        if (viewMode === 'edit') setSelectedId(id);
    };

    const handleUpdateProperty = (key: string, value: any) => {
        if (!selectedId) return;
        setComponents((prev) => updateComponentProps(prev, selectedId, key, value));
    };

    const handleDelete = (id: string) => {
        setComponents((prev) => {
            const next = deleteFromTree(prev, id);
            if (selectedId === id) {
                const flat = flattenComponents(next);
                setSelectedId(flat.length > 0 ? flat[0].id : null);
            }
            return next;
        });
    };

    const handleClone = (id: string) => {
        setComponents((prev) => {
            const next = cloneInTree(prev, id);
            const found = findComponent(next, id);
            if (found) {
                const siblings = found.parent ? found.parent.children : next;
                const clone = siblings[found.index + 1];
                if (clone) setSelectedId(clone.id);
            }
            return next;
        });
    };

    const handleMove = (id: string, direction: number) => {
        setComponents((prev) => moveSiblingInTree(prev, id, direction));
    };

    const handleDrop = (target: { parentId: string | null; index: number }, action: any) => {
        if (action.type === 'new') {
            const newComponent = createComponent(action.componentType, action.extraProps || {});
            setComponents((prev) => insertIntoTree(prev, target.parentId, target.index, newComponent));
            setSelectedId(newComponent.id);
        } else if (action.type === 'move') {
            setComponents((prev) => moveInTree(prev, action.id, target.parentId, target.index));
            setSelectedId(action.id);
        }
    };

    const handleAddComponent = (type: string, extraProps: Record<string, any> = {}) => {
        const parentId = getInsertParentId(components, selectedId);
        const siblings = parentId
            ? (findComponent(components, parentId)?.node.children || [])
            : components;
        const newComponent = createComponent(type, extraProps);
        setComponents((prev) => insertIntoTree(prev, parentId, siblings.length, newComponent));
        setSelectedId(newComponent.id);
        setShowComponents(false);
    };

    const clearCanvas = () => {
        if (window.confirm('キャンバス上のすべてのコンポーネントをクリアしてもよろしいですか？')) {
            setComponents([]);
            setSelectedId(null);
        }
    };

    const toggleMode = () => {
        const newMode = viewMode === 'edit' ? 'preview' : 'edit';
        setViewMode(newMode);
        if (newMode === 'preview') {
            setSelectedId(null);
            document.body.classList.remove('mode-edit');
        } else {
            document.body.classList.add('mode-edit');
        }
    };

    if (!isClient) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header>
                <div className="logo-area">
                    <div className="logo-icon">A</div>
                    <div className="logo-text">Aura Builder React</div>
                </div>

                <div className="viewport-controls">
                    <button className={`viewport-btn ${device === 'desktop' ? 'active' : ''}`} onClick={() => setDevice('desktop')}>デスクトップ</button>
                    <button className={`viewport-btn ${device === 'tablet' ? 'active' : ''}`} onClick={() => setDevice('tablet')}>タブレット</button>
                    <button className={`viewport-btn ${device === 'mobile' ? 'active' : ''}`} onClick={() => setDevice('mobile')}>スマホ</button>
                </div>

                <div className="actions-area">
                    {viewMode === 'edit' && (
                        <button className="btn btn-outline" onClick={() => setShowComponents(!showComponents)}>
                            📦 コンポーネント一覧
                        </button>
                    )}
                    <button className="btn btn-outline" onClick={toggleMode}>
                        <span>{viewMode === 'edit' ? '👁️ プレビュー' : '✏️ 編集'}</span>
                    </button>
                    <button className="btn btn-outline" onClick={clearCanvas}>🗑️ クリア</button>
                    <button className="btn btn-primary" onClick={() => alert('コード出力機能は未実装です')}>🚀 出力</button>
                </div>
            </header>

            <div className="main-container">
                <Canvas
                    components={components}
                    selectedId={selectedId}
                    viewMode={viewMode}
                    device={device}
                    onSelect={handleSelect}
                    onMove={handleMove}
                    onClone={handleClone}
                    onDelete={handleDelete}
                    onDrop={handleDrop}
                />

                {viewMode === 'edit' && (
                    <SidebarRight
                        selectedComponent={selectedComponent}
                        updateComponentProperty={handleUpdateProperty}
                    />
                )}
            </div>

            {viewMode === 'edit' && showComponents && (
                <SidebarLeft onAdd={handleAddComponent} onClose={() => setShowComponents(false)} />
            )}
        </div>
    );
}

export default dynamic(() => Promise.resolve(BuilderPage), { ssr: false });
