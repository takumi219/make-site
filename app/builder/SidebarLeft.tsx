"use client";
import React, { useState } from 'react';
import { renderComponentHTML, createDefaultProps } from './utils';
import { HEADER_VARIANTS, MV_DESCRIPTIONS, H3_DESCRIPTIONS, PARTS_GRID_DESCRIPTIONS, PARTS_SLIDER_DESCRIPTIONS, PARTS_TAB_DESCRIPTIONS } from './componentMeta';
// カテゴリ定義
const CATEGORIES = [
    { id: 'header',   label: '📁 ヘッダー',         icon: '📁' },
    { id: 'title',    label: '📰 タイトル/見出し',   icon: '📰' },
    { id: 'h3-section', label: '📑 セクション見出し（h3）', icon: '📑' },
    { id: 'hero',     label: '⭐ ヒーローセクション', icon: '⭐' },
    { id: 'text',     label: '📝 テキスト本文',      icon: '📝' },
    { id: 'features', label: '⚡ 特徴・カード列',     icon: '⚡' },
    { id: 'image',    label: '🖼️ 画像・メディア',     icon: '🖼️' },
    { id: 'button',   label: '🔘 ボタン・CTA',       icon: '🔘' },
    { id: 'divider',  label: '✂️ 区切り線・スペーサー', icon: '✂️' },
    { id: 'parts-grid', label: '🔲 パーツグリッド', icon: '🔲' },
    { id: 'parts-slider', label: '🎠 パーツスライダー', icon: '🎠' },
    { id: 'parts-tab', label: '🗂️ パーツタブ', icon: '🗂️' },
    { id: 'footer',   label: '🔖 フッター',          icon: '🔖' },
];

// 各バリアントのHTMLプレビュー生成
function getPreviewHTML(type: any, variant: any = null) {
    try {
        let props;
        if (type === 'header') {
            props = { ...createDefaultProps('header'), variant };
        } else if (type === 'mv-hero') {
            props = { ...createDefaultProps('mv-hero'), variant, title: 'タイトル', subtitle: 'サブタイトル', paragraph: 'テキスト', btnText: 'CTAボタン', btnText2: 'CTA2', btnUrl: '#', btnUrl2: '#' };
        } else if (type === 'h3-section') {
            props = { ...createDefaultProps('h3-section'), variant, title: 'タイトルタイトルタイトル' };
        } else if (type === 'parts-grid') {
            props = { ...createDefaultProps('parts-grid'), variant };
        } else if (type === 'parts-slider') {
            props = { ...createDefaultProps('parts-slider'), variant };
        } else if (type === 'parts-tab') {
            props = { ...createDefaultProps('parts-tab'), variant };
            const children = [
                { id: 'mock-panel-1', type: 'parts-tab-panel', props: { label: 'タブ1' }, children: [{ id: 'mock-text-1', type: 'text', props: { heading: 'コンテンツ1', paragraph: 'コンテンツ1の説明テキストです。' } }] },
                { id: 'mock-panel-2', type: 'parts-tab-panel', props: { label: 'タブ2' }, children: [{ id: 'mock-text-2', type: 'text', props: { heading: 'コンテンツ2', paragraph: 'コンテンツ2の説明テキストです。' } }] },
                { id: 'mock-panel-3', type: 'parts-tab-panel', props: { label: 'タブ3' }, children: [{ id: 'mock-text-3', type: 'text', props: { heading: 'コンテンツ3', paragraph: 'コンテンツ3の説明テキストです。' } }] },
            ];
            return renderComponentHTML({ type, props, id: '__preview__', children });
        } else {
            props = createDefaultProps(type);
        }
        return renderComponentHTML({ type, props, id: '__preview__' });
    } catch {
        return `<div style="padding:20px;color:#666;">プレビュー</div>`;
    }
}

// カードコンポーネント
function CompLibCard({ name, componentType, variant = null as string | null, onAdd, previewHtml }) {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('componentType', componentType);
        if (variant) e.dataTransfer.setData('componentVariant', variant);
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div
            className="comp-lib-card"
            draggable
            onDragStart={handleDragStart}
            onClick={onAdd}
        >
            <div className="comp-lib-preview">
                <div
                    className="comp-lib-preview-inner"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
            </div>
            <div className="comp-lib-card-footer">
                <span className="comp-lib-card-name">{name}</span>
                <button className="comp-lib-card-add" onClick={e => { e.stopPropagation(); onAdd(); }}>+ 追加</button>
            </div>
        </div>
    );
}

export default function SidebarLeft({ onAdd, onClose }) {
    const [activeCategory, setActiveCategory] = useState('header');

    const renderContent = () => {
        switch (activeCategory) {
            case 'header':
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">📁 ヘッダー</span>
                            <span className="comp-lib-category-badge">{HEADER_VARIANTS.length} バリアント</span>
                        </div>
                        <div className="comp-lib-variants">
                            {HEADER_VARIANTS.map(({ variant, name }) => (
                                <CompLibCard
                                    key={variant}
                                    componentType="header"
                                    variant={variant}
                                    name={name}
                                    onAdd={() => onAdd('header', { variant })}
                                    previewHtml={getPreviewHTML('header', variant)}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'title': {
                const mvVariants = Array.from({ length: 110 }, (_, i) => i + 1).map(n => `pt${n}`).filter(v => v in MV_DESCRIPTIONS);
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">📰 タイトル/見出し（メインビジュアル）</span>
                            <span className="comp-lib-category-badge">{mvVariants.length} バリアント</span>
                        </div>
                        <div className="comp-lib-variants">
                            {mvVariants.map(variant => (
                                <CompLibCard
                                    key={variant}
                                    componentType="mv-hero"
                                    variant={variant}
                                    name={`${variant}: ${MV_DESCRIPTIONS[variant] || variant}`}
                                    onAdd={() => onAdd('mv-hero', { variant })}
                                    previewHtml={getPreviewHTML('mv-hero', variant)}
                                />
                            ))}
                        </div>
                    </div>
                );
            }
            case 'h3-section': {
                const h3Variants = Object.keys(H3_DESCRIPTIONS);
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">📑 セクション見出し（h3 / h3/page.tsx）</span>
                            <span className="comp-lib-category-badge">{h3Variants.length} バリアント</span>
                        </div>
                        <div className="comp-lib-variants">
                            {h3Variants.map(variant => (
                                <CompLibCard
                                    key={variant}
                                    componentType="h3-section"
                                    variant={variant}
                                    name={`${variant}: ${H3_DESCRIPTIONS[variant]}`}
                                    onAdd={() => onAdd('h3-section', { variant })}
                                    previewHtml={getPreviewHTML('h3-section', variant)}
                                />
                            ))}
                        </div>
                    </div>
                );
            }
            case 'parts-grid': {
                const variants = Object.keys(PARTS_GRID_DESCRIPTIONS);
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">🔲 パーツグリッド</span>
                            <span className="comp-lib-category-badge">{variants.length} バリアント</span>
                        </div>
                        <div className="comp-lib-variants">
                            {variants.map(variant => (
                                <CompLibCard
                                    key={variant}
                                    componentType="parts-grid"
                                    variant={variant}
                                    name={`${variant}: ${PARTS_GRID_DESCRIPTIONS[variant]}`}
                                    onAdd={() => onAdd('parts-grid', { variant })}
                                    previewHtml={getPreviewHTML('parts-grid', variant)}
                                />
                            ))}
                        </div>
                    </div>
                );
            }
            case 'parts-slider': {
                const variants = Object.keys(PARTS_SLIDER_DESCRIPTIONS);
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">🎠 パーツスライダー</span>
                            <span className="comp-lib-category-badge">{variants.length} バリアント</span>
                        </div>
                        <div className="comp-lib-variants">
                            {variants.map(variant => (
                                <CompLibCard
                                    key={variant}
                                    componentType="parts-slider"
                                    variant={variant}
                                    name={`${variant}: ${PARTS_SLIDER_DESCRIPTIONS[variant]}`}
                                    onAdd={() => onAdd('parts-slider', { variant })}
                                    previewHtml={getPreviewHTML('parts-slider', variant)}
                                />
                            ))}
                        </div>
                    </div>
                );
            }
            case 'parts-tab': {
                const variants = Object.keys(PARTS_TAB_DESCRIPTIONS);
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">🗂️ パーツタブ</span>
                            <span className="comp-lib-category-badge">{variants.length} バリアント</span>
                        </div>
                        <div className="comp-lib-variants">
                            {variants.map(variant => (
                                <CompLibCard
                                    key={variant}
                                    componentType="parts-tab"
                                    variant={variant}
                                    name={`${variant}: ${PARTS_TAB_DESCRIPTIONS[variant]}`}
                                    onAdd={() => onAdd('parts-tab', { variant })}
                                    previewHtml={getPreviewHTML('parts-tab', variant)}
                                />
                            ))}
                        </div>
                    </div>
                );
            }
            case 'hero':
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">⭐ ヒーローセクション</span>
                        </div>
                        <div className="comp-lib-variants">
                            <CompLibCard componentType="hero" name="ヒーロー（テキスト+CTA）" onAdd={() => onAdd('hero')} previewHtml={getPreviewHTML('hero')} />
                        </div>
                    </div>
                );
            case 'text':
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">📝 テキスト本文</span>
                        </div>
                        <div className="comp-lib-variants">
                            <CompLibCard componentType="text" name="テキスト＆見出し" onAdd={() => onAdd('text')} previewHtml={getPreviewHTML('text')} />
                        </div>
                    </div>
                );
            case 'features':
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">⚡ 特徴・カード列</span>
                        </div>
                        <div className="comp-lib-variants">
                            <CompLibCard componentType="features" name="3列カード" onAdd={() => onAdd('features')} previewHtml={getPreviewHTML('features')} />
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">🖼️ 画像・メディア</span>
                        </div>
                        <div className="comp-lib-variants">
                            <CompLibCard componentType="image" name="画像ブロック" onAdd={() => onAdd('image')} previewHtml={getPreviewHTML('image')} />
                        </div>
                    </div>
                );
            case 'button':
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">🔘 ボタン・CTA</span>
                        </div>
                        <div className="comp-lib-variants">
                            <CompLibCard componentType="button" name="CTAボタン" onAdd={() => onAdd('button')} previewHtml={getPreviewHTML('button')} />
                        </div>
                    </div>
                );
            case 'divider':
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">✂️ 区切り線・スペーサー</span>
                        </div>
                        <div className="comp-lib-variants">
                            <CompLibCard componentType="divider" name="区切り線" onAdd={() => onAdd('divider')} previewHtml={getPreviewHTML('divider')} />
                        </div>
                    </div>
                );
            case 'footer':
                return (
                    <div className="comp-lib-category">
                        <div className="comp-lib-category-header">
                            <span className="comp-lib-category-title">🔖 フッター</span>
                        </div>
                        <div className="comp-lib-variants">
                            <CompLibCard componentType="footer" name="フッター" onAdd={() => onAdd('footer')} previewHtml={getPreviewHTML('footer')} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay comp-lib-modal" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">📦 コンポーネント一覧</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="comp-lib-modal-body">
                    <nav className="comp-lib-nav">
                        {CATEGORIES.map(c => (
                            <div
                                key={c.id}
                                className={`comp-lib-nav-item ${activeCategory === c.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(c.id)}
                            >
                                {c.label}
                            </div>
                        ))}
                    </nav>
                    <div className="comp-lib-main">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
