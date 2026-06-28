"use client";
import React, { useState, useEffect } from 'react';
import { MV_DESCRIPTIONS, H3_DESCRIPTIONS, PARTS_GRID_DESCRIPTIONS, PARTS_SLIDER_DESCRIPTIONS, PARTS_TAB_DESCRIPTIONS } from './componentMeta';

const EditorInput = ({ value, onChange, type = "text", ...rest }) => {
    const [localVal, setLocalVal] = useState(value || '');
    useEffect(() => { setLocalVal(value || ''); }, [value]);
    return <input type={type} value={localVal} onChange={e => setLocalVal(e.target.value)} onBlur={() => onChange(localVal)} {...rest} />;
};

const EditorTextarea = ({ value, onChange, ...rest }) => {
    const [localVal, setLocalVal] = useState(value || '');
    useEffect(() => { setLocalVal(value || ''); }, [value]);
    return <textarea value={localVal} onChange={e => setLocalVal(e.target.value)} onBlur={() => onChange(localVal)} {...rest} />;
};

export default function SidebarRight({ selectedComponent, updateComponentProperty }) {
    if (!selectedComponent) {
        return (
            <aside className="sidebar sidebar-right" id="sidebar-right">
                <div className="sidebar-tab-header">
                    <div className="sidebar-tab active">プロパティ</div>
                </div>
                <div className="sidebar-content">
                    <div className="no-selection-msg">
                        キャンバス上でコンポーネントを選択すると、ここに編集プロパティが表示されます。
                    </div>
                </div>
            </aside>
        );
    }

    const { type, props: p } = selectedComponent;

    const handleFilePick = (propKey, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt: any) => {
                updateComponentProperty(propKey, evt.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderEditorFields = () => {
        switch (type) {
            case 'header': {
                const showCta2 = ['pt4', 'pt5', 'pt6', 'pt8', 'pt11', 'pt12', 'pt13', 'pt14', 'pt15', 'pt16'].includes(p.variant);
                return (
                    <>
                        <div className="editor-group">
                            <label>バリアント</label>
                            <select className="editor-select" value={p.variant || 'pt1'} onChange={e => updateComponentProperty('variant', e.target.value)}>
                                <option value="pt1">pt1: ロゴ左・ナビ中央・ボタン1つ</option>
                                <option value="pt2">pt2: ロゴ＆ナビ左・ボタン1つ</option>
                                <option value="pt3">pt3: ナビ中央＆ボタン右・ロゴ左</option>
                                <option value="pt4">pt4: ロゴ左・ナビ中央・ボタン2つ</option>
                                <option value="pt5">pt5: ロゴ＆ナビ左・ボタン2つ</option>
                                <option value="pt6">pt6: ナビ中央＆ボタン2つ右・ロゴ左</option>
                                <option value="pt7">pt7: (ブロック) ナビフル・ボタン1つ</option>
                                <option value="pt8">pt8: (ブロック) ナビフル・ボタン2つ</option>
                                <option value="pt9">pt9: (ラウンド) フローティング</option>
                                <option value="pt10">pt10: メガメニュー・ロゴ左・ボタン1つ</option>
                                <option value="pt11">pt11: メガメニュー・ボタン2つ</option>
                                <option value="pt12">pt12: メガメニュー＆ロゴ左・ボタン1つ</option>
                                <option value="pt13">pt13: メガメニュー＆ボタン右・ロゴ左</option>
                                <option value="pt14">pt14: メガメニュー・ロゴ左・ボタン2つ</option>
                                <option value="pt15">pt15: メガメニュー＆ロゴ左・ボタン2つ</option>
                                <option value="pt16">pt16: メガメニュー＆ボタン2つ右・ロゴ左</option>
                            </select>
                        </div>
                        <div className="editor-group">
                            <label>ロゴタイプ</label>
                            <select className="editor-select" value={p.logoType || 'text'} onChange={e => updateComponentProperty('logoType', e.target.value)}>
                                <option value="text">テキスト</option>
                                <option value="image">画像</option>
                            </select>
                        </div>
                        {p.logoType === 'image' ? (
                            <div className="editor-group">
                                <label>ロゴ画像ファイル</label>
                                <div className="file-picker-row">
                                    <input type="file" accept="image/*" id="logo-upload" style={{ display: 'none' }} onChange={e => handleFilePick('logoImage', e)} />
                                    <label htmlFor="logo-upload" className="btn-file-pick" style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}>ファイルを選択</label>
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{p.logoImage ? '画像セット済' : '未選択'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="editor-group">
                                <label>ロゴテキスト</label>
                                <EditorInput className="editor-input" type="text" value={p.logoText || 'LOGO'} onChange={val => updateComponentProperty('logoText', val)} />
                            </div>
                        )}
                        {p.variant === 'pt9' && (
                            <div className="editor-group">
                                <label>ヘッダー背景色 (pt9)</label>
                                <div className="editor-color-row">
                                    <input type="color" className="editor-color-picker" value={p.headerBgColor || '#0000ff'} onChange={e => updateComponentProperty('headerBgColor', e.target.value)} />
                                    <EditorInput type="text" className="editor-input" value={p.headerBgColor || '#0000ff'} onChange={val => updateComponentProperty('headerBgColor', val)} />
                                </div>
                            </div>
                        )}
                        <div className="editor-group">
                            <label>ナビゲーション（改行区切り、-で子要素。ラベル|URL）</label>
                            <EditorTextarea className="editor-textarea" rows={5} value={p.navItemsText || ''} onChange={val => updateComponentProperty('navItemsText', val)} />
                        </div>
                        <div className="editor-group">
                            <label>CTA1 テキスト</label>
                            <EditorInput className="editor-input" type="text" value={p.cta1Text || ''} onChange={val => updateComponentProperty('cta1Text', val)} />
                        </div>
                        <div className="editor-group">
                            <label>CTA1 URL</label>
                            <EditorInput className="editor-input" type="text" value={p.cta1Url || ''} onChange={val => updateComponentProperty('cta1Url', val)} />
                        </div>
                        {['pt7', 'pt8'].includes(p.variant) && (
                            <div className="editor-group">
                                <label>CTA1 アイコン画像</label>
                                <div className="file-picker-row">
                                    <input type="file" accept="image/*" id="cta1Icon-upload" style={{ display: 'none' }} onChange={e => handleFilePick('cta1Icon', e)} />
                                    <label htmlFor="cta1Icon-upload" className="btn-file-pick" style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}>ファイルを選択</label>
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{p.cta1Icon ? '画像セット済' : '未選択'}</span>
                                </div>
                            </div>
                        )}
                        <div className="editor-group">
                            <label>CTA1 背景色</label>
                            <div className="editor-color-row">
                                <input type="color" className="editor-color-picker" value={p.cta1BgColor || '#ff0000'} onChange={e => updateComponentProperty('cta1BgColor', e.target.value)} />
                                <EditorInput type="text" className="editor-input" value={p.cta1BgColor || '#ff0000'} onChange={val => updateComponentProperty('cta1BgColor', val)} />
                            </div>
                        </div>
                        <div className="editor-group">
                            <label>CTA1 文字色</label>
                            <div className="editor-color-row">
                                <input type="color" className="editor-color-picker" value={p.cta1Color || '#ffffff'} onChange={e => updateComponentProperty('cta1Color', e.target.value)} />
                                <EditorInput type="text" className="editor-input" value={p.cta1Color || '#ffffff'} onChange={val => updateComponentProperty('cta1Color', val)} />
                            </div>
                        </div>
                        
                        {showCta2 && (
                            <>
                                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
                                <div className="editor-group">
                                    <label>CTA2 テキスト</label>
                                    <EditorInput className="editor-input" type="text" value={p.cta2Text || ''} onChange={val => updateComponentProperty('cta2Text', val)} />
                                </div>
                                <div className="editor-group">
                                    <label>CTA2 URL</label>
                                    <EditorInput className="editor-input" type="text" value={p.cta2Url || ''} onChange={val => updateComponentProperty('cta2Url', val)} />
                                </div>
                                {p.variant === 'pt8' && (
                                    <div className="editor-group">
                                        <label>CTA2 アイコン画像</label>
                                        <div className="file-picker-row">
                                            <input type="file" accept="image/*" id="cta2Icon-upload" style={{ display: 'none' }} onChange={e => handleFilePick('cta2Icon', e)} />
                                            <label htmlFor="cta2Icon-upload" className="btn-file-pick" style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}>ファイルを選択</label>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{p.cta2Icon ? '画像セット済' : '未選択'}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="editor-group">
                                    <label>CTA2 背景色</label>
                                    <div className="editor-color-row">
                                        <input type="color" className="editor-color-picker" value={p.cta2BgColor || '#0000ff'} onChange={e => updateComponentProperty('cta2BgColor', e.target.value)} />
                                        <EditorInput type="text" className="editor-input" value={p.cta2BgColor || '#0000ff'} onChange={val => updateComponentProperty('cta2BgColor', val)} />
                                    </div>
                                </div>
                                <div className="editor-group">
                                    <label>CTA2 文字色</label>
                                    <div className="editor-color-row">
                                        <input type="color" className="editor-color-picker" value={p.cta2Color || '#ffffff'} onChange={e => updateComponentProperty('cta2Color', e.target.value)} />
                                        <EditorInput type="text" className="editor-input" value={p.cta2Color || '#ffffff'} onChange={val => updateComponentProperty('cta2Color', val)} />
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                );
            }
            case 'hero':
                return (
                    <>
                        <div className="editor-group">
                            <label>メインタイトル</label>
                            <EditorInput className="editor-input" type="text" value={p.title || ''} onChange={val => updateComponentProperty('title', val)} />
                        </div>
                        <div className="editor-group">
                            <label>サブタイトル</label>
                            <EditorTextarea className="editor-textarea" rows={3} value={p.subtitle || ''} onChange={val => updateComponentProperty('subtitle', val)} />
                        </div>
                        <div className="editor-group">
                            <label>背景タイプ</label>
                            <select className="editor-select" value={p.bgType || 'color'} onChange={e => updateComponentProperty('bgType', e.target.value)}>
                                <option value="color">単色カラー</option>
                                <option value="gradient">グラデーション</option>
                                <option value="image">画像</option>
                            </select>
                        </div>
                        {p.bgType === 'color' && (
                            <div className="editor-group">
                                <label>背景色</label>
                                <div className="editor-color-row">
                                    <input type="color" className="editor-color-picker" value={p.bgColor || '#f8fafc'} onChange={e => updateComponentProperty('bgColor', e.target.value)} />
                                    <EditorInput type="text" className="editor-input" value={p.bgColor || '#f8fafc'} onChange={val => updateComponentProperty('bgColor', val)} />
                                </div>
                            </div>
                        )}
                        {p.bgType === 'gradient' && (
                            <div className="editor-group">
                                <label>CSSグラデーション</label>
                                <EditorInput className="editor-input" type="text" value={p.bgGradient || ''} onChange={val => updateComponentProperty('bgGradient', val)} />
                            </div>
                        )}
                        {p.bgType === 'image' && (
                            <div className="editor-group">
                                <label>背景画像ファイル</label>
                                <div className="file-picker-row">
                                    <input type="file" accept="image/*" id="bg-upload" style={{ display: 'none' }} onChange={e => handleFilePick('bgImage', e)} />
                                    <label htmlFor="bg-upload" className="btn-file-pick" style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}>ファイルを選択</label>
                                </div>
                            </div>
                        )}
                        <div className="editor-group">
                            <label>ボタンテキスト</label>
                            <EditorInput className="editor-input" type="text" value={p.buttonText || ''} onChange={val => updateComponentProperty('buttonText', val)} />
                        </div>
                        <div className="editor-group">
                            <label>ボタンURL</label>
                            <EditorInput className="editor-input" type="text" value={p.buttonUrl || ''} onChange={val => updateComponentProperty('buttonUrl', val)} />
                        </div>
                        <div className="editor-group">
                            <label>配置</label>
                            <select className="editor-select" value={p.align || 'center'} onChange={e => updateComponentProperty('align', e.target.value)}>
                                <option value="left">左寄せ</option>
                                <option value="center">中央</option>
                                <option value="right">右寄せ</option>
                            </select>
                        </div>
                    </>
                );
            case 'mv-hero': {
                const descMv = MV_DESCRIPTIONS[p.variant] || '';
                const hasSubtitleMv = descMv.includes('サブ');
                const hasParagraphMv = descMv.includes('テキスト');
                const hasCtaMv = descMv.includes('CTA');
                const hasCta2Mv = descMv.includes('CTA2');
                const hasImageMv = descMv.includes('画像');

                return (
                    <>
                        <div className="editor-group">
                            <label>バリアント (pt1〜110)</label>
                            <select className="editor-select editor-select-detailed" value={p.variant || 'pt1'} onChange={e => updateComponentProperty('variant', e.target.value)}>
                                {Array.from({ length: 110 }, (_, i) => i + 1).map(n => {
                                    const key = `pt${n}`;
                                    return (
                                        <option key={key} value={key}>
                                            {key}: {MV_DESCRIPTIONS[key] || key}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="editor-group">
                            <label>メインタイトル</label>
                            <EditorInput className="editor-input" type="text" value={p.title ?? ''} onChange={val => updateComponentProperty('title', val)} />
                        </div>
                        {hasSubtitleMv && (
                            <div className="editor-group">
                                <label>サブタイトル</label>
                                <EditorInput className="editor-input" type="text" value={p.subtitle ?? ''} onChange={val => updateComponentProperty('subtitle', val)} />
                            </div>
                        )}
                        {hasParagraphMv && (
                            <div className="editor-group">
                                <label>テキスト（段落）</label>
                                <EditorTextarea className="editor-textarea" rows={3} value={p.paragraph ?? ''} onChange={val => updateComponentProperty('paragraph', val)} />
                            </div>
                        )}
                        {hasCtaMv && (
                            <>
                                <div className="editor-group">
                                    <label>CTAボタン1テキスト</label>
                                    <EditorInput className="editor-input" type="text" value={p.btnText ?? ''} onChange={val => updateComponentProperty('btnText', val)} />
                                </div>
                                <div className="editor-group">
                                    <label>CTAボタン1 URL</label>
                                    <EditorInput className="editor-input" type="text" value={p.btnUrl ?? '#'} onChange={val => updateComponentProperty('btnUrl', val)} />
                                </div>
                            </>
                        )}
                        {hasCta2Mv && (
                            <>
                                <div className="editor-group">
                                    <label>CTAボタン2テキスト</label>
                                    <EditorInput className="editor-input" type="text" value={p.btnText2 ?? ''} onChange={val => updateComponentProperty('btnText2', val)} />
                                </div>
                                <div className="editor-group">
                                    <label>CTAボタン2 URL</label>
                                    <EditorInput className="editor-input" type="text" value={p.btnUrl2 ?? '#'} onChange={val => updateComponentProperty('btnUrl2', val)} />
                                </div>
                            </>
                        )}
                        {hasImageMv && (
                            <div className="editor-group">
                                <label>サイド画像</label>
                                <div className="file-picker-row">
                                    <input type="file" accept="image/*" id="hero-img-upload" style={{ display: 'none' }} onChange={e => handleFilePick('heroImage', e)} />
                                    <label htmlFor="hero-img-upload" className="btn-file-pick" style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}>ファイルを選択</label>
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{p.heroImage && p.heroImage !== '/dummy_210.svg' ? '画像セット済' : 'デフォルト'}</span>
                                </div>
                                {p.heroImage && p.heroImage !== '/dummy_210.svg' && (
                                    <img src={p.heroImage} alt="プレビュー" style={{ marginTop: '8px', maxWidth: '100%', maxHeight: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                                )}
                            </div>
                        )}
                    </>
                );
            }
            case 'h3-section': {
                const descH3 = H3_DESCRIPTIONS[p.variant] || '';
                const hasSubtitleH3 = descH3.includes('サブ') || descH3.includes('ラベル');
                const hasParagraphH3 = descH3.includes('リード文') || descH3.includes('テキスト');
                const is2Col = p.columns === 2;

                return (
                    <>
                        <div className="editor-group">
                            <label>バリアント</label>
                            <select className="editor-select editor-select-detailed" value={p.variant || 'pt1'} onChange={e => updateComponentProperty('variant', e.target.value)}>
                                {Object.entries(H3_DESCRIPTIONS).map(([key, label]) => (
                                    <option key={key} value={key}>{key}: {label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="editor-group">
                            <label>見出しテキスト（h3）</label>
                            <EditorInput className="editor-input" type="text" value={p.title ?? ''} onChange={val => updateComponentProperty('title', val)} />
                        </div>
                        {hasSubtitleH3 && (
                            <div className="editor-group">
                                <label>サブタイトル / ラベル</label>
                                <EditorInput className="editor-input" type="text" value={p.subtitle ?? ''} onChange={val => updateComponentProperty('subtitle', val)} />
                            </div>
                        )}
                        {hasParagraphH3 && (
                            <div className="editor-group">
                                <label>リード文</label>
                                <EditorInput className="editor-input" type="text" value={p.paragraph ?? ''} onChange={val => updateComponentProperty('paragraph', val)} />
                            </div>
                        )}
                        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
                        <div className="editor-group">
                            <label>子要素カラム数</label>
                            <select className="editor-select" value={p.columns || 1} onChange={e => updateComponentProperty('columns', Number(e.target.value))}>
                                <option value={1}>1カラム</option>
                                <option value={2}>2カラム</option>
                                <option value={3}>3カラム</option>
                                <option value={4}>4カラム</option>
                            </select>
                        </div>
                        {is2Col && (
                            <div className="editor-group">
                                <label>2カラム比率</label>
                                <select className="editor-select" value={p.columnRatio || '1:1'} onChange={e => updateComponentProperty('columnRatio', e.target.value)}>
                                    <option value="1:1">1:1</option>
                                    <option value="1:2">1:2</option>
                                    <option value="2:1">2:1</option>
                                    <option value="1:3">1:3</option>
                                    <option value="3:1">3:1</option>
                                </select>
                            </div>
                        )}
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0' }}>
                            セクション内の子コンポーネントは、見出し下のドロップエリアにドラッグするか、セクション選択中にコンポーネント一覧から追加してください。
                        </p>
                    </>
                );
            }
            case 'parts-grid': {
                return (
                    <>
                        <div className="editor-group">
                            <label>バリアント</label>
                            <select className="editor-select editor-select-detailed" value={p.variant || 'pt1'} onChange={e => updateComponentProperty('variant', e.target.value)}>
                                {Object.entries(PARTS_GRID_DESCRIPTIONS).map(([key, label]) => (
                                    <option key={key} value={key}>{key}: {label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="editor-group">
                            <label>アイテム数</label>
                            <EditorInput className="editor-input" type="number" min="1" max="12" value={p.childrenCount || 6} onChange={val => updateComponentProperty('childrenCount', Number(val))} />
                        </div>
                    </>
                );
            }
            case 'parts-slider': {
                return (
                    <>
                        <div className="editor-group">
                            <label>バリアント</label>
                            <select className="editor-select editor-select-detailed" value={p.variant || 'slider-pt1'} onChange={e => updateComponentProperty('variant', e.target.value)}>
                                {Object.entries(PARTS_SLIDER_DESCRIPTIONS).map(([key, label]) => (
                                    <option key={key} value={key}>{key}: {label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="editor-group">
                            <label>表示アイテム数 (perPage)</label>
                            <EditorInput className="editor-input" type="number" min="1" max="10" value={p.perPage || 3} onChange={val => updateComponentProperty('perPage', Number(val))} />
                        </div>
                        <div className="editor-group">
                            <label>総アイテム数 (itemsCount)</label>
                            <EditorInput className="editor-input" type="number" min="1" max="20" value={p.itemsCount || 6} onChange={val => updateComponentProperty('itemsCount', Number(val))} />
                        </div>
                        <div className="editor-group">
                            <label>ドットの色 (通常)</label>
                            <div className="editor-color-row">
                                <input type="color" className="editor-color-picker" value={p.dotColor || '#cccccc'} onChange={e => updateComponentProperty('dotColor', e.target.value)} />
                                <EditorInput type="text" className="editor-input" value={p.dotColor || '#cccccc'} onChange={val => updateComponentProperty('dotColor', val)} />
                            </div>
                        </div>
                        <div className="editor-group">
                            <label>ドットの色 (アクティブ)</label>
                            <div className="editor-color-row">
                                <input type="color" className="editor-color-picker" value={p.activeDotColor || '#333333'} onChange={e => updateComponentProperty('activeDotColor', e.target.value)} />
                                <EditorInput type="text" className="editor-input" value={p.activeDotColor || '#333333'} onChange={val => updateComponentProperty('activeDotColor', val)} />
                            </div>
                        </div>
                    </>
                );
            }
            case 'parts-tab': {
                return (
                    <>
                        <div className="editor-group">
                            <label>バリアント</label>
                            <select className="editor-select editor-select-detailed" value={p.variant || 'pt1'} onChange={e => updateComponentProperty('variant', e.target.value)}>
                                {Object.entries(PARTS_TAB_DESCRIPTIONS).map(([key, label]) => (
                                    <option key={key} value={key}>{key}: {label}</option>
                                ))}
                            </select>
                        </div>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0' }}>
                            タブの増減は、タブ内容部分をクリックして表示されるパネルのメニューから「複製」または「削除」を行ってください。タブ名もパネル選択時に変更できます。
                        </p>
                    </>
                );
            }
            case 'parts-tab-panel': {
                return (
                    <>
                        <div className="editor-group">
                            <label>タブ名（ラベル）</label>
                            <EditorInput className="editor-input" type="text" value={p.label || 'タブ'} onChange={val => updateComponentProperty('label', val)} />
                        </div>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0' }}>
                            このパネルに子コンポーネントをドロップして内容を作成してください。
                        </p>
                    </>
                );
            }
            case 'image':
                return (
                    <>
                        <div className="editor-group">
                            <label>画像ファイル</label>
                            <div className="file-picker-row">
                                <input type="file" accept="image/*" id="image-comp-upload" style={{ display: 'none' }} onChange={e => handleFilePick('imageUrl', e)} />
                                <label htmlFor="image-comp-upload" className="btn-file-pick" style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}>ファイルを選択</label>
                            </div>
                            {p.imageUrl && p.imageUrl.startsWith('data:') && (
                                <img src={p.imageUrl} alt="プレビュー" style={{ marginTop: '8px', maxWidth: '100%', maxHeight: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                            )}
                        </div>
                        <div className="editor-group">
                            <label>代替テキスト (alt)</label>
                            <EditorInput className="editor-input" type="text" value={p.altText || ''} onChange={val => updateComponentProperty('altText', val)} />
                        </div>
                        <div className="editor-group">
                            <label>キャプション</label>
                            <EditorInput className="editor-input" type="text" value={p.caption || ''} onChange={val => updateComponentProperty('caption', val)} />
                        </div>
                        <div className="editor-group">
                            <label>角丸 (px)</label>
                            <div className="editor-range-row">
                                <input type="range" min="0" max="100" value={p.borderRadius !== undefined ? p.borderRadius : 12} onChange={e => updateComponentProperty('borderRadius', Number(e.target.value))} />
                                <span className="editor-range-value">{p.borderRadius !== undefined ? p.borderRadius : 12}</span>
                            </div>
                        </div>
                        <div className="editor-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" id="img-shadow" checked={!!p.shadow} onChange={e => updateComponentProperty('shadow', e.target.checked)} />
                            <label htmlFor="img-shadow" style={{ margin: 0, cursor: 'pointer' }}>影をつける</label>
                        </div>
                    </>
                );
            case 'text':
            case 'features':
            case 'button':
            case 'divider':
            case 'footer':
                return <div style={{ color: '#9ca3af', fontSize: '13px' }}>※このコンポーネントのプロパティはデモのため省略表示しています。</div>;
            default:
                return <div>このコンポーネントには編集可能なプロパティがありません。</div>;
        }
    };

    return (
        <aside className="sidebar sidebar-right" id="sidebar-right">
            <div className="sidebar-tab-header">
                <div className="sidebar-tab active">プロパティ</div>
            </div>
            <div className="sidebar-content">
                <div className="editor-section">
                    <h3>{type.toUpperCase()} 編集</h3>
                    <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '4px 0 16px 0' }} />
                    {renderEditorFields()}
                </div>
            </div>
        </aside>
    );
}
