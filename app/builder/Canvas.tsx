"use client";
import React, { useState, useEffect } from 'react';
import { renderComponentHTML, getH3SectionHeadingHTML } from './utils';
import { isContainerType } from './treeUtils';
import "../css/style.css";
import "../globals.css";

type DropTarget = { parentId: string | null; index: number } | null;

function CompToolbar({ comp, viewMode, onMove, onClone, onDelete }) {
    if (viewMode !== 'edit') return null;
    return (
        <div className="comp-toolbar" style={{ display: 'flex' }}>
            <span style={{ fontSize: '11px', marginRight: '4px', fontWeight: 'bold' }}>{comp.type.toUpperCase()}</span>
            <button className="toolbar-btn" onClick={(e) => { e.stopPropagation(); onMove(comp.id, -1); }}>▲</button>
            <button className="toolbar-btn" onClick={(e) => { e.stopPropagation(); onMove(comp.id, 1); }}>▼</button>
            <button className="toolbar-btn" onClick={(e) => { e.stopPropagation(); onClone(comp.id); }}>📋 複製</button>
            <button className="toolbar-btn delete" onClick={(e) => { e.stopPropagation(); onDelete(comp.id); }}>🗑️ 削除</button>
        </div>
    );
}

function DropZone({ show }) {
    if (!show) return null;
    return <div className="drop-placeholder"></div>;
}

function ChildrenDropArea({
    parentId,
    components,
    selectedId,
    viewMode,
    device,
    dragOverTarget,
    style,
    onSelect,
    onMove,
    onClone,
    onDelete,
    onDragStartCanvasItem,
    onDragEndCanvasItem,
    onChildDragOver,
    onChildDrop,
}) {
    const isTarget = dragOverTarget?.parentId === parentId;
    const childCount = components.length;
    const isAddZoneTarget = isTarget && dragOverTarget.index === childCount;

    return (
        <div className="section-children">
            <div
                className="section-children-list"
                style={style}
                onDragOver={(e) => onChildDragOver(e, parentId, childCount)}
                onDrop={(e) => onChildDrop(e, parentId, Math.min(dragOverTarget?.parentId === parentId ? dragOverTarget.index : childCount, childCount))}
            >
                {components.map((child, idx) => (
                    <React.Fragment key={child.id}>
                        <DropZone show={isTarget && dragOverTarget.index === idx} />
                        <CanvasNode
                            comp={child}
                            parentId={parentId}
                            index={idx}
                            selectedId={selectedId}
                            viewMode={viewMode}
                            device={device}
                            dragOverTarget={dragOverTarget}
                            onSelect={onSelect}
                            onMove={onMove}
                            onClone={onClone}
                            onDelete={onDelete}
                            onDragStartCanvasItem={onDragStartCanvasItem}
                            onDragEndCanvasItem={onDragEndCanvasItem}
                            onChildDragOver={onChildDragOver}
                            onChildDrop={onChildDrop}
                        />
                    </React.Fragment>
                ))}
            </div>
            {viewMode === 'edit' && (
                <div
                    className={`section-children-add-zone ${isAddZoneTarget ? 'drag-over' : ''} ${childCount === 0 ? 'section-children-add-zone-empty' : ''}`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onChildDragOver(e, parentId, childCount);
                    }}
                    onDrop={(e) => onChildDrop(e, parentId, childCount)}
                >
                    {isAddZoneTarget && <div className="drop-placeholder section-children-drop-indicator" />}
                    <div className="section-children-hint">
                        子コンポーネントをここにドロップ、またはセクション選択中にコンポーネント一覧から追加
                    </div>
                </div>
            )}
        </div>
    );
}

function CanvasNode({
    comp,
    parentId,
    index,
    selectedId,
    viewMode,
    device,
    dragOverTarget,
    onSelect,
    onMove,
    onClone,
    onDelete,
    onDragStartCanvasItem,
    onDragEndCanvasItem,
    onChildDragOver,
    onChildDrop,
}) {
    const isSelected = comp.id === selectedId;
    const isContainer = isContainerType(comp.type);

    if (comp.type === 'parts-slider') {
        const variant = comp.props.variant || 'slider-pt1';
        const perPage = comp.props.perPage || 3;
        const itemsCount = comp.props.itemsCount || 6;
        const dotColor = comp.props.dotColor || '#ccc';
        const activeDotColor = comp.props.activeDotColor || '#333';

        const centerAlign = variant.includes('center') || variant === 'slider-pt2' || variant === 'slider-pt4';
        const showDetail = variant.includes('detail') || variant === 'slider-pt3' || variant === 'slider-pt4';

        const containerRef = React.useRef<HTMLDivElement>(null);
        const wrapperRef   = React.useRef<HTMLDivElement>(null);

        // device propでレスポンシブ判定（mobile/tablet → 1アイテム表示）
        const activePerPage = (device === 'mobile' || device === 'tablet') ? 1 : perPage;

        // アイテム配列を作成
        const sliderItems = Array.from({ length: itemsCount }, (_, i) => ({
            id: i + 1,
            ttl: `タイトル${i + 1}`,
            text: '本文が入ります'
        }));

        const [currentIndex, setCurrentIndex] = useState(perPage); // 初期値=perPage
        const [isTransitioning, setIsTransitioning] = useState(true);
        const [isDragging, setIsDragging] = useState(false);
        const startXRef     = React.useRef(0);
        const dragOffsetRef = React.useRef(0);
        const [dragOffset, setDragOffset] = useState(0); // 描画用

        // activePerPage / itemsCount が実際に変わったときだけインデックスをリセット
        const prevActivePerPageRef = React.useRef(activePerPage);
        const prevItemsCountRef    = React.useRef(itemsCount);
        useEffect(() => {
            if (prevActivePerPageRef.current !== activePerPage || prevItemsCountRef.current !== itemsCount) {
                prevActivePerPageRef.current = activePerPage;
                prevItemsCountRef.current    = itemsCount;
                setIsTransitioning(false);
                setCurrentIndex(activePerPage);
            }
        }, [activePerPage, itemsCount]);

        // 無限ループ：境界を超えたら透明にジャンプ
        useEffect(() => {
            if (currentIndex >= itemsCount + activePerPage) {
                const t = setTimeout(() => {
                    setIsTransitioning(false);
                    setCurrentIndex(activePerPage);
                }, 320);
                return () => clearTimeout(t);
            }
            if (currentIndex < activePerPage) {
                const t = setTimeout(() => {
                    setIsTransitioning(false);
                    setCurrentIndex(itemsCount + activePerPage - 1);
                }, 320);
                return () => clearTimeout(t);
            }
        }, [currentIndex, itemsCount, activePerPage]);

        const clonesBefore = sliderItems.slice(-activePerPage);
        const clonesAfter  = sliderItems.slice(0, activePerPage);
        const combinedItems = [...clonesBefore, ...sliderItems, ...clonesAfter];
        const activeDotIndex = ((currentIndex - activePerPage) % itemsCount + itemsCount) % itemsCount;

        const handleScroll = (direction: 'next' | 'prev') => {
            setIsTransitioning(true);
            setCurrentIndex(prev => prev + (direction === 'next' ? 1 : -1));
        };

        const goToSlide = (index: number) => {
            setIsTransitioning(true);
            setCurrentIndex(index + activePerPage);
        };

        const handleDragStart = (e: any) => {
            setIsDragging(true);
            setIsTransitioning(false);
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            startXRef.current    = clientX;
            dragOffsetRef.current = 0;
        };

        const handleDragMove = (e: any) => {
            if (!isDragging) return;
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const offset = clientX - startXRef.current;
            dragOffsetRef.current = offset;
            setDragOffset(offset);
        };

        const handleDragEnd = () => {
            if (!isDragging) return;
            setIsDragging(false);
            setIsTransitioning(true);
            const wrapperWidth = wrapperRef.current?.offsetWidth || 1;
            const threshold = (wrapperWidth / activePerPage) * 0.15;
            const offset = dragOffsetRef.current;
            if (offset < -threshold) {
                setCurrentIndex(prev => prev + 1);
            } else if (offset > threshold) {
                setCurrentIndex(prev => prev - 1);
            }
            dragOffsetRef.current = 0;
            setDragOffset(0);
        };

        const itemWidthPercent = 100 / activePerPage;
        const wrapperWidth = wrapperRef.current?.offsetWidth || 1;
        const dragPercent  = (dragOffset / wrapperWidth) * 100;
        const transformX   = -currentIndex * itemWidthPercent + dragPercent;

        return (
            <div
                className={`comp-wrapper comp-wrapper-container ${isSelected ? 'selected' : ''}`}
                onClick={viewMode === 'edit' ? (e) => { e.stopPropagation(); onSelect(comp.id); } : undefined}
            >
                <div
                    className={`parts-slider ${variant} slider-3`}
                    ref={containerRef}
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '1000px',
                        margin: '0 auto',
                        padding: '0 50px',
                        boxSizing: 'border-box',
                        ['--dot-color' as string]: dotColor,
                        ['--dot-active-color' as string]: activeDotColor,
                    } as React.CSSProperties}
                >
                    <div
                        className="slider-wrapper"
                        ref={wrapperRef}
                        style={{ overflow: 'hidden', width: '100%', padding: '20px 0', userSelect: 'none' }}
                    >
                        <div
                            className="slider"
                            style={{
                                display: 'flex',
                                width: '100%',
                                transform: `translateX(${transformX}%)`,
                                transition: isTransitioning ? 'transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none',
                                cursor: isDragging ? 'grabbing' : 'grab',
                                willChange: 'transform',
                            }}
                            onMouseDown={handleDragStart}
                            onMouseMove={handleDragMove}
                            onMouseUp={handleDragEnd}
                            onMouseLeave={handleDragEnd}
                            onTouchStart={handleDragStart}
                            onTouchMove={handleDragMove}
                            onTouchEnd={handleDragEnd}
                        >
                            {combinedItems.map((item, index) => (
                                <div
                                    className={`parts-slider-item ${centerAlign ? 'slider-item-center' : ''}`}
                                    key={index}
                                    style={{ flex: `0 0 ${itemWidthPercent}%`, maxWidth: `${itemWidthPercent}%`, boxSizing: 'border-box', padding: '0 10px' }}
                                >
                                    <img src="/dummy_210.svg" alt="" className="slider-img" style={{ width: '100%', height: 'auto', borderRadius: '4px', pointerEvents: 'none' }} draggable={false} />
                                    <h4 className="slider-ttl" style={{ margin: '8px 0 4px' }}>{item.ttl}</h4>
                                    <div className="slider-text" style={{ fontSize: '0.9rem', color: '#666' }}>{item.text}</div>
                                    {showDetail && <button className="slider-detail">詳細を見る</button>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="slider-button">
                        <button className="prev" onClick={(e) => { e.stopPropagation(); handleScroll('prev'); }}>＜</button>
                        <button className="next" onClick={(e) => { e.stopPropagation(); handleScroll('next'); }}>＞</button>
                    </div>
                    <div className="slider-dots">
                        {sliderItems.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${activeDotIndex === index ? 'is-active' : ''}`}
                                style={{
                                    backgroundColor: activeDotIndex === index ? activeDotColor : dotColor,
                                }}
                                onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                            />
                        ))}
                    </div>
                </div>
                {isSelected && (
                    <CompToolbar comp={comp} viewMode={viewMode} onMove={onMove} onClone={onClone} onDelete={onDelete} />
                )}
            </div>
        );
    }

    if (comp.type === 'parts-tab') {
        const [activeTab, setActiveTab] = useState(0);
        const variant = comp.props.variant || 'pt1';
        const num = parseInt(variant.replace('pt', '')) || 1;
        const isColumn = num >= 10;
        const panels = comp.children || [];

        return (
            <div
                className={`comp-wrapper comp-wrapper-container ${isSelected ? 'selected' : ''}`}
                draggable={viewMode === 'edit'}
                onClick={(e) => { e.stopPropagation(); onSelect(comp.id); }}
                onDragStart={(e) => onDragStartCanvasItem(e, comp.id)}
                onDragEnd={onDragEndCanvasItem}
            >
                <div className={`tab-wrapper js-parts-tab-box ${variant} ${isColumn ? 'tab-column' : ''}`} style={{width:'90%', margin:'0 auto'}}>
                    <ul className="tab-wrap" style={{display:'flex', listStyle:'none', padding:0, margin:0}}>
                        {panels.map((panel: any, idx: number) => (
                            <li key={panel.id} className={`tab-item ${activeTab === idx ? 'active is-active' : ''}`} style={{cursor:'pointer'}}>
                                <button className="tab-button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveTab(idx); onSelect(comp.id); }} style={{background:'none', border:'none', padding:'8px 16px', cursor:'pointer'}}>
                                    {panel.props?.label || `Tab${idx+1}`}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="parts-tab-content js-parts-tab-content" style={{marginTop:'20px', padding:'20px', border:'1px solid #ccc', background:'#fff'}}>
                        {panels.map((panel: any, idx: number) => (
                            <div key={panel.id} className={`parts-tab-panel js-parts-tab-panel ${activeTab === idx ? 'active is-active' : ''}`} style={{display: activeTab === idx ? 'block' : 'none'}}>
                                <CanvasNode
                                    comp={panel}
                                    parentId={comp.id}
                                    index={idx}
                                    selectedId={selectedId}
                                    viewMode={viewMode}
                                    device={device}
                                    dragOverTarget={dragOverTarget}
                                    onSelect={onSelect}
                                    onMove={onMove}
                                    onClone={onClone}
                                    onDelete={onDelete}
                                    onDragStartCanvasItem={onDragStartCanvasItem}
                                    onDragEndCanvasItem={onDragEndCanvasItem}
                                    onChildDragOver={onChildDragOver}
                                    onChildDrop={onChildDrop}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {isSelected && (
                    <CompToolbar comp={comp} viewMode={viewMode} onMove={onMove} onClone={onClone} onDelete={onDelete} />
                )}
            </div>
        );
    }

    if (comp.type === 'parts-tab-panel') {
        return (
            <div
                className={`comp-wrapper comp-wrapper-container parts-tab-panel-wrapper ${isSelected ? 'selected' : ''}`}
                onClick={viewMode === 'edit' ? (e) => { e.stopPropagation(); onSelect(comp.id); } : undefined}
            >
                {viewMode === 'edit' ? (
                    <ChildrenDropArea
                        parentId={comp.id}
                        components={comp.children || []}
                        selectedId={selectedId}
                        viewMode={viewMode}
                        device={device}
                        dragOverTarget={dragOverTarget}
                        style={{}}
                        onSelect={onSelect}
                        onMove={onMove}
                        onClone={onClone}
                        onDelete={onDelete}
                        onDragStartCanvasItem={onDragStartCanvasItem}
                        onDragEndCanvasItem={onDragEndCanvasItem}
                        onChildDragOver={onChildDragOver}
                        onChildDrop={onChildDrop}
                    />
                ) : (
                    // プレビュー時もReactコンポーネントとして描画（スライダー等のインタラクティブ機能を保持）
                    <div>
                        {(comp.children || []).map((child: any, idx: number) => (
                            <CanvasNode
                                key={child.id}
                                comp={child}
                                parentId={comp.id}
                                index={idx}
                                selectedId={null}
                                viewMode="preview"
                                device={device}
                                dragOverTarget={null}
                                onSelect={() => {}}
                                onMove={() => {}}
                                onClone={() => {}}
                                onDelete={() => {}}
                                onDragStartCanvasItem={() => {}}
                                onDragEndCanvasItem={() => {}}
                                onChildDragOver={() => {}}
                                onChildDrop={() => {}}
                            />
                        ))}
                    </div>
                )}
                {isSelected && (
                    <div className="comp-toolbar" style={{ display: 'flex', top: '-24px' }}>
                        <span style={{ fontSize: '11px', marginRight: '4px', fontWeight: 'bold' }}>TAB PANEL</span>
                    </div>
                )}
            </div>
        );
    }

    if (comp.type === 'h3-section') {
        const columns = comp.props.columns || 1;
        const columnRatio = comp.props.columnRatio || '1:1';
        let gridTemplateColumns = '1fr';
        if (columns === 2) {
            const [l, r] = columnRatio.split(':').map(Number);
            gridTemplateColumns = `${l}fr ${r}fr`;
        } else if (columns > 1) {
            gridTemplateColumns = `repeat(${columns}, 1fr)`;
        }
        const gridStyle = columns > 1 ? { display: 'grid', gridTemplateColumns, gap: '20px' } : {};

        return (
            <div
                className={`comp-wrapper comp-wrapper-container ${isSelected ? 'selected' : ''}`}
                draggable={viewMode === 'edit'}
                onClick={viewMode === 'edit' ? (e) => { e.stopPropagation(); onSelect(comp.id); } : undefined}
                onDragStart={(e) => onDragStartCanvasItem(e, comp.id)}
                onDragEnd={onDragEndCanvasItem}
            >
                <section className="section">
                    <div dangerouslySetInnerHTML={{ __html: getH3SectionHeadingHTML(comp.props) }} />
                    {viewMode === 'edit' ? (
                        <ChildrenDropArea
                            parentId={comp.id}
                            components={comp.children || []}
                            selectedId={selectedId}
                            viewMode={viewMode}
                            device={device}
                            dragOverTarget={dragOverTarget}
                            style={gridStyle}
                            onSelect={onSelect}
                            onMove={onMove}
                            onClone={onClone}
                            onDelete={onDelete}
                            onDragStartCanvasItem={onDragStartCanvasItem}
                            onDragEndCanvasItem={onDragEndCanvasItem}
                            onChildDragOver={onChildDragOver}
                            onChildDrop={onChildDrop}
                        />
                    ) : (
                        // プレビュー時もReactコンポーネントとして描画（スライダー等のインタラクティブ機能を保持）
                        <div className="section-children" style={gridStyle}>
                            {(comp.children || []).map((child: any, idx: number) => (
                                <CanvasNode
                                    key={child.id}
                                    comp={child}
                                    parentId={comp.id}
                                    index={idx}
                                    selectedId={null}
                                    viewMode="preview"
                                    device={device}
                                    dragOverTarget={null}
                                    onSelect={() => {}}
                                    onMove={() => {}}
                                    onClone={() => {}}
                                    onDelete={() => {}}
                                    onDragStartCanvasItem={() => {}}
                                    onDragEndCanvasItem={() => {}}
                                    onChildDragOver={() => {}}
                                    onChildDrop={() => {}}
                                />
                            ))}
                        </div>
                    )}
                </section>
                {isSelected && (
                    <CompToolbar comp={comp} viewMode={viewMode} onMove={onMove} onClone={onClone} onDelete={onDelete} />
                )}
            </div>
        );
    }

    return (
        <div
            className={`comp-wrapper ${isSelected ? 'selected' : ''}`}
            draggable={viewMode === 'edit'}
            onClick={(e) => { e.stopPropagation(); onSelect(comp.id); }}
            onDragStart={(e) => onDragStartCanvasItem(e, comp.id)}
            onDragEnd={onDragEndCanvasItem}
        >
            <div dangerouslySetInnerHTML={{ __html: renderComponentHTML(comp) || '' }} />
            {isSelected && (
                <CompToolbar comp={comp} viewMode={viewMode} onMove={onMove} onClone={onClone} onDelete={onDelete} />
            )}
        </div>
    );
}

export default function Canvas({ components, selectedId, viewMode, device, onSelect, onMove, onClone, onDelete, onDrop }) {
    const [dragOverTarget, setDragOverTarget] = useState<DropTarget>(null);

    const resolveDropIndex = (e, container, selector) => {
        const children = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
        let targetIndex = children.length;
        for (let i = 0; i < children.length; i++) {
            const childRect = children[i].getBoundingClientRect();
            const childMidY = childRect.top + childRect.height / 2;
            if (e.clientY < childMidY) {
                targetIndex = i;
                break;
            }
        }
        return targetIndex;
    };

    const handleRootDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = e.dataTransfer.types.includes('canvasid') ? 'move' : 'copy';
        const index = resolveDropIndex(e, e.currentTarget, ':scope > .comp-wrapper-root-item > .comp-wrapper, :scope > .comp-wrapper-root-item > .comp-wrapper-container');
        setDragOverTarget({ parentId: null, index });
    };

    const handleChildDragOver = (e, parentId, childCount) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = e.dataTransfer.types.includes('canvasid') ? 'move' : 'copy';
        const index = resolveDropIndex(e, e.currentTarget, ':scope > .comp-wrapper, :scope > .comp-wrapper-container');
        setDragOverTarget({ parentId, index: Math.min(index, childCount) });
    };

    const handleDropAt = (e, parentId, index) => {
        e.preventDefault();
        e.stopPropagation();

        const componentType = e.dataTransfer.getData('componentType');
        const componentVariant = e.dataTransfer.getData('componentVariant');
        const canvasId = e.dataTransfer.getData('canvasId');
        const extraProps = componentVariant ? { variant: componentVariant } : {};

        if (componentType) {
            onDrop({ parentId, index }, { type: 'new', componentType, extraProps });
        } else if (canvasId) {
            onDrop({ parentId, index }, { type: 'move', id: canvasId });
        }
        setDragOverTarget(null);
    };

    const handleRootDrop = (e) => {
        const index = dragOverTarget?.parentId === null ? dragOverTarget.index : components.length;
        handleDropAt(e, null, index);
    };

    const handleDragStartCanvasItem = (e, id) => {
        if (viewMode !== 'edit') return;
        e.stopPropagation();
        e.dataTransfer.setData('canvasId', id);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            const target = e.currentTarget;
            if (target) target.style.opacity = '0.4';
        }, 0);
    };

    const handleDragEndCanvasItem = (e) => {
        e.currentTarget.style.opacity = '1';
        setDragOverTarget(null);
    };

    return (
        <main className={`workspace device-${device}`} id="workspace">
            <div className="canvas-container" id="canvas-container" style={{ containerType: 'inline-size' }}>
                {components.length === 0 && (
                    <div className="canvas-empty-hint" id="empty-hint">
                        <h3>ここからビルドを開始</h3>
                        <p>コンポーネント一覧から追加するか、ここにドラッグ＆ドロップしてください。</p>
                    </div>
                )}
                <div
                    className="canvas-content"
                    id="canvas-content"
                    onDragOver={handleRootDragOver}
                    onDragLeave={() => setDragOverTarget(null)}
                    onDrop={handleRootDrop}
                    style={{ position: 'relative' }}
                >
                    {components.map((comp, idx) => (
                        <div key={comp.id} className="comp-wrapper-root-item">
                            <DropZone show={dragOverTarget?.parentId === null && dragOverTarget.index === idx} />
                            <CanvasNode
                                comp={comp}
                                parentId={null}
                                index={idx}
                                selectedId={selectedId}
                                viewMode={viewMode}
                                device={device}
                                dragOverTarget={dragOverTarget}
                                onSelect={onSelect}
                                onMove={onMove}
                                onClone={onClone}
                                onDelete={onDelete}
                                onDragStartCanvasItem={handleDragStartCanvasItem}
                                onDragEndCanvasItem={handleDragEndCanvasItem}
                                onChildDragOver={handleChildDragOver}
                                onChildDrop={handleDropAt}
                            />
                        </div>
                    ))}
                    <DropZone show={dragOverTarget?.parentId === null && dragOverTarget?.index === components.length} />
                </div>
            </div>
        </main>
    );
}
