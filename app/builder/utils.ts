import { buildH3HeadingHTML } from './h3Variants';

        // Helper to parse nav item text into structured array
        export function parseNavItems(text) {
            const lines = (text || '').split('\n').filter(l => l.trim() !== '');
            let items: any[] = [];
            for (const line of lines) {
                const isSub = line.startsWith('-') || line.startsWith('ー');
                const cleanLine = line.replace(/^[-ー]\s*/, '').trim();
                const parts = cleanLine.split('|');
                const label = parts[0].trim();
                const url = parts.length > 1 ? parts[1].trim() : '#';
                
                if (isSub) {
                    if (items.length > 0) {
                        if (!items[items.length - 1].subItems) items[items.length - 1].subItems = [];
                        items[items.length - 1].subItems.push({ label, url });
                    }
                } else {
                    items.push({ label, url, subItems: [] });
                }
            }
            return items;
        }

        // ヘッダーHTML生成ヘルパー
        function buildHeaderNav(p, hasMega) {
            const items = parseNavItems(p.navItemsText || 'アイテム\nアイテム\nアイテム');
            if (items.length === 0) return '';

            let html = '<ul class="header__nav__list">';
            for (const item of items) {
                if (hasMega && item.subItems && item.subItems.length > 0) {
                    html += `<li class="header__nav__item">
                        <a href="${escapeHtml(item.url)}" style="display:flex;align-items:center;gap:4px;">${escapeHtml(item.label)}
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
                        <ul class="mega-menu">`;
                    for (const sub of item.subItems) {
                        html += `<li class="mega-menu-item"><a href="${escapeHtml(sub.url)}">${escapeHtml(sub.label)}</a></li>`;
                    }
                    html += `</ul></li>`;
                } else {
                    html += `<li class="header__nav__item"><a href="${escapeHtml(item.url)}">${escapeHtml(item.label)}</a></li>`;
                }
            }
            html += '</ul>';
            return html;
        }

        function buildLogoBlock(p) {
            if (p.logoType === 'image' && p.logoImage) {
                return `<div class="header__logo">
                    <a href="#"><img src="${escapeHtml(p.logoImage)}" alt="${escapeHtml(p.logoText || 'Logo')}" style="max-height: 40px; object-fit: contain;"></a>
                </div>`;
            } else {
                return `<div class="header__logo">
                    <a href="#"><h2 style="font-size:14px;color:#333;white-space:nowrap;">${escapeHtml(p.logoText || 'LOGO')}</h2></a>
                </div>`;
            }
        }

        export function createDefaultProps(type) {
            switch(type) {
                case 'header':
                    return {
                        variant: 'pt1',
                        logoType: 'text',
                        logoText: 'LOGO',
                        logoImage: '',
                        navItemsText: 'ホーム|/\nサービス|/services\n会社概要|/about\n- 企業理念|/mission\n- 採用情報|/careers',
                        cta1Text: '資料請求',
                        cta1Url: '#',
                        cta1Icon: '/dummy2.svg',
                        cta1Color: '#ffffff',
                        cta1BgColor: '#ff0000',
                        cta2Text: 'お問い合わせ',
                        cta2Url: '#',
                        cta2Icon: '/dummy2.svg',
                        cta2Color: '#ffffff',
                        cta2BgColor: '#0000ff',
                        headerBgColor: 'blue'
                    };
                case 'hero':
                    return {
                        title: "新しいセクションタイトル",
                        subtitle: "サブテキストをここに入力します。デザインに合わせて調整可能です。",
                        bgType: "color",
                        bgColor: "#f8fafc",
                        bgGradient: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                        bgImage: "",
                        buttonText: "詳しく見る",
                        buttonUrl: "#",
                        align: "center",
                        textColor: "#0f172a"
                    };
                case 'text':
                    return {
                        heading: "セクションの見出しタイトル",
                        headingLevel: "h2",
                        paragraph: "ここにはメインの段落テキストが入ります。読みやすく、十分なコントラストを持つフォントとマージンを設定しています。複数の文章をつなげて詳細な説明を記入することができます。",
                        align: "left",
                        textColor: "#334155"
                    };
                case 'image':
                    return {
                        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
                        altText: "プレースホルダー画像",
                        caption: "ビジュアルを支えるモダンなアートワーク",
                        borderRadius: 12,
                        shadow: true
                    };
                case 'features':
                    return {
                        title1: "機能・特徴 1",
                        desc1: "直感的で非常にシンプルな操作体系を実現。コードを書くことなく美しいレイアウトを生み出せます。",
                        icon1: "💡",
                        title2: "機能・特徴 2",
                        desc2: "完全に自給自足の静的HTML/CSSファイルをエクスポート。デプロイ場所を選びません。",
                        icon2: "⚡",
                        title3: "機能・特徴 3",
                        desc3: "レスポンシブプレビュー機能により、全デバイスで美しくレスポンシブなビューを実現します。",
                        icon3: "🎨"
                    };
                case 'button':
                    return {
                        btnText: "お問い合わせはこちら",
                        btnUrl: "#",
                        btnStyle: "filled",
                        btnColor: "#6366f1",
                        btnSize: "md",
                        align: "center"
                    };
                case 'divider':
                    return {
                        height: 40,
                        borderStyle: "solid",
                        borderColor: "#e2e8f0"
                    };
                case 'footer':
                    return {
                        copyright: "© 2026 Aura Builder. All rights reserved.",
                        bgColor: "#0f172a",
                        textColor: "#94a3b8"
                    };
                case 'mv-hero':
                    return {
                        variant: 'pt1',
                        title: 'タイトルタイトル',
                        subtitle: 'サブタイトルタイトル',
                        paragraph: 'テキストテキストテキストテキストテキストテキスト',
                        btnText: 'CTAボタン',
                        btnText2: 'CTAボタン2',
                        btnUrl: '#',
                        btnUrl2: '#',
                        align: 'center',
                        heroImage: '/dummy_210.svg'
                    };
                case 'h3-section':
                    return {
                        variant: 'pt1',
                        title: 'タイトルタイトルタイトル',
                        subtitle: 'サブタイトルテキスト',
                        paragraph: 'テキストテキストテキストテキスト',
                        btnText: 'CTAボタン',
                        btnText2: 'CTAボタン2',
                        btnUrl: '#',
                        btnUrl2: '#',
                        heroImage: '/dummy_210.svg'
                    };
                case 'parts-grid':
                    return { variant: 'pt1', childrenCount: 6 };
                case 'parts-slider':
                    return { variant: 'slider-pt1', perPage: 3, itemsCount: 6, dotColor: '#cccccc', activeDotColor: '#333333' };
                case 'parts-tab':
                    return { variant: 'pt1', tabCount: 3 };
                case 'parts-tab-panel':
                    return { label: 'タブ' };
                default:
                    return {};
            }
        }


        export function renderComponentHTML(comp) {
            const p = comp.props;
            switch(comp.type) {
                case 'header': {
                    const v = p.variant || 'pt1';
                    const logo = buildLogoBlock(p);
                    
                    const btnStyle = (color, bg) => `style="color: ${color || '#fff'}; background-color: ${bg || 'red'};"`;
                    const btn1Text = p.cta1Text || p.ctaText || 'CTA1';
                    const btn2Text = p.cta2Text || 'CTA2';
                    const c1 = p.cta1Color || '#ffffff';
                    const bg1 = p.cta1BgColor || '#ff0000';
                    const c2 = p.cta2Color || '#ffffff';
                    const bg2 = p.cta2BgColor || '#0000ff';

                    const navSimple = buildHeaderNav(p, false);
                    const navMega  = buildHeaderNav(p, true);
                    const humburger = `<div class="humburger" data-hdr-toggle><span class="line"></span></div>`;
                    const btn1Url = p.cta1Url || '#';
                    const btn2Url = p.cta2Url || '#';
                    const icon1 = p.cta1Icon || '/dummy2.svg';
                    const icon2 = p.cta2Icon || '/dummy2.svg';
                    
                    const btn1 = `<div class="header__btn"><a href="${escapeHtml(btn1Url)}" ${btnStyle(c1, bg1)}>${btn1Text}</a></div>`;
                    const btn2 = `<div class="hdr-parts hdr-btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(btn1Url)}" ${btnStyle(c1, bg1)}>${btn1Text}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(btn2Url)}" ${btnStyle(c2, bg2)}>${btn2Text}</a></div></div>`;
                    
                    const innerBtn1_pt7 = `<a class="header__btn" href="${escapeHtml(btn1Url)}" ${btnStyle(c1, bg1)}><img src="${escapeHtml(icon1)}" alt="icon" width="40" height="40"><span>${btn1Text}</span></a>`;
                    const innerBtn2_pt8 = `<div class="hdr-parts hdr-btn2"><a class="header__btn" href="${escapeHtml(btn1Url)}" ${btnStyle(c1, bg1)}><img src="${escapeHtml(icon1)}" alt="icon" width="40" height="40"><span>${btn1Text}</span></a><a class="header__btn" href="${escapeHtml(btn2Url)}" ${btnStyle(c2, bg2)}><img src="${escapeHtml(icon2)}" alt="icon" width="40" height="40"><span>${btn2Text}</span></a></div>`;

                    let inner = '';
                    switch(v) {
                        case 'pt1': inner = `${logo}<nav class="header__nav center">${navSimple}</nav>${btn1}${humburger}`; break;
                        case 'pt2': inner = `<div class="hdr-parts">${logo}<nav class="header__nav center">${navSimple}</nav></div>${btn1}${humburger}`; break;
                        case 'pt3': inner = `${logo}<div class="hdr-parts"><nav class="header__nav center">${navSimple}</nav>${btn1}</div>${humburger}`; break;
                        case 'pt4': inner = `${logo}<nav class="header__nav center">${navSimple}</nav>${btn2}${humburger}`; break;
                        case 'pt5': inner = `<div class="hdr-parts">${logo}<nav class="header__nav center">${navSimple}</nav></div>${btn2}${humburger}`; break;
                        case 'pt6': inner = `${logo}<div class="hdr-parts"><nav class="header__nav center">${navSimple}</nav>${btn2}</div>${humburger}`; break;
                        case 'pt7': inner = `${logo}<nav class="header__nav">${navSimple}</nav>${innerBtn1_pt7}${humburger}`; break;
                        case 'pt8': inner = `${logo}<nav class="header__nav">${navSimple}</nav>${innerBtn2_pt8}${humburger}`; break;
                        case 'pt9': inner = `${logo}<nav class="header__nav">${navSimple}</nav>${btn1}${humburger}`; break;
                        case 'pt10': inner = `${logo}<nav class="header__nav">${navMega}</nav>${btn1}${humburger}`; break;
                        case 'pt11': inner = `${logo}<nav class="header__nav">${navMega}</nav>${btn1}${humburger}`; break;
                        case 'pt12': inner = `<div class="hdr-parts">${logo}<nav class="header__nav">${navMega}</nav></div>${btn1}${humburger}`; break;
                        case 'pt13': inner = `${logo}<div class="hdr-parts"><nav class="header__nav">${navMega}</nav>${btn1}</div>${humburger}`; break;
                        case 'pt14': inner = `${logo}<nav class="header__nav">${navMega}</nav>${btn2}${humburger}`; break;
                        case 'pt15': inner = `<div class="hdr-parts">${logo}<nav class="header__nav">${navMega}</nav></div>${btn2}${humburger}`; break;
                        case 'pt16': inner = `${logo}<div class="hdr-parts"><nav class="header__nav">${navMega}</nav>${btn2}</div>${humburger}`; break;
                        default:     inner = `${logo}<nav class="header__nav center">${navSimple}</nav>${btn1}${humburger}`;
                    }
                    let pt9Style = '';
                    if (v === 'pt9') {
                        pt9Style = ` style="background-color: ${p.headerBgColor || 'blue'};"`;
                    }
                    return `<header class="c-header header hdr hdr-${v}"${pt9Style}>${inner}</header>`;
                }
                case 'hero': {
                    let backgroundStyle = '';
                    if (p.bgType === 'color') backgroundStyle = `background-color: ${p.bgColor};`;
                    else if (p.bgType === 'gradient') backgroundStyle = `background-image: ${p.bgGradient};`;
                    else if (p.bgType === 'image') backgroundStyle = `background-image: url('${p.bgImage}');`;

                    const alignClass = p.align || 'center';
                    const textColor = p.textColor || '#000000';

                    return `
                        <section class="c-hero" style="${backgroundStyle} color: ${textColor}; text-align: ${alignClass};">
                            <div class="c-hero-content">
                                <h2>${p.title}</h2>
                                <p>${p.subtitle}</p>
                                ${p.buttonText ? `<a href="${p.buttonUrl}" class="c-hero-btn" style="background-color: ${textColor === '#ffffff' ? '#ffffff' : '#1e1b4b'}; color: ${textColor === '#ffffff' ? '#1e1b4b' : '#ffffff'};">${p.buttonText}</a>` : ''}
                            </div>
                        </section>
                    `;
                }
                case 'text': {
                    const headingTag = p.headingLevel || 'h2';
                    const alignment = p.align || 'left';
                    const color = p.textColor || '#334155';
                    return `
                        <section class="c-text" style="text-align: ${alignment};">
                            <div class="c-text-content">
                                <${headingTag} style="color: ${color};">${p.heading}</${headingTag}>
                                <p style="color: #475569;">${p.paragraph.replace(/\n/g, '<br>')}</p>
                            </div>
                        </section>
                    `;
                }
                case 'image': {
                    const br = p.borderRadius !== undefined ? p.borderRadius : 12;
                    const shadowStyle = p.shadow ? 'box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);' : '';
                    return `
                        <div class="c-image">
                            <div class="c-image-wrapper">
                                <img src="${p.imageUrl}" alt="${p.altText}" style="border-radius: ${br}px; ${shadowStyle}">
                                ${p.caption ? `<div class="c-image-caption">${p.caption}</div>` : ''}
                            </div>
                        </div>
                    `;
                }
                case 'features': {
                    return `
                        <section class="c-features">
                            <div class="c-features-grid">
                                <div class="c-feature-card">
                                    <div class="c-feature-icon">${p.icon1}</div>
                                    <h3>${p.title1}</h3>
                                    <p>${p.desc1}</p>
                                </div>
                                <div class="c-feature-card">
                                    <div class="c-feature-icon">${p.icon2}</div>
                                    <h3>${p.title2}</h3>
                                    <p>${p.desc2}</p>
                                </div>
                                <div class="c-feature-card">
                                    <div class="c-feature-icon">${p.icon3}</div>
                                    <h3>${p.title3}</h3>
                                    <p>${p.desc3}</p>
                                </div>
                            </div>
                        </section>
                    `;
                }
                case 'button': {
                    const alignment = p.align || 'center';
                    let btnStyleCode = '';
                    if (p.btnStyle === 'filled') {
                        btnStyleCode = `background-color: ${p.btnColor}; color: #ffffff; border: 1px solid ${p.btnColor};`;
                    } else if (p.btnStyle === 'outline') {
                        btnStyleCode = `background-color: transparent; color: ${p.btnColor}; border: 1.5px solid ${p.btnColor};`;
                    } else if (p.btnStyle === 'ghost') {
                        btnStyleCode = `background-color: transparent; color: ${p.btnColor}; border: 1.5px solid transparent;`;
                    }

                    let btnPadding = '8px 20px; font-size: 14px;';
                    if (p.btnSize === 'sm') btnPadding = '6px 14px; font-size: 12px;';
                    if (p.btnSize === 'lg') btnPadding = '12px 28px; font-size: 16px;';

                    return `
                        <div class="c-cta" style="text-align: ${alignment};">
                            <a href="${p.btnUrl}" class="c-cta-btn style-${p.btnStyle}" style="${btnStyleCode} ${btnPadding} border-radius: 6px;">
                                ${p.btnText}
                            </a>
                        </div>
                    `;
                }
                case 'divider': {
                    const borderStyle = p.borderStyle || 'solid';
                    const height = p.height || 40;
                    return `
                        <div class="c-divider" style="height: ${height}px;">
                            ${borderStyle !== 'none' ? `<hr class="c-divider-line" style="border: none; border-top: 1px ${borderStyle} ${p.borderColor};">` : ''}
                        </div>
                    `;
                }
                case 'footer': {
                    return `
                        <footer class="c-footer" style="background-color: ${p.bgColor}; color: ${p.textColor};">
                            <p>${p.copyright}</p>
                        </footer>
                    `;
                }
                case 'mv-hero': {
                    return getMvHeroHTML(p);
                }
                case 'h3-section': {
                    const childrenHtml = (comp.children || []).map((child) => renderComponentHTML(child)).join('');
                    return getH3SectionHTML(p, childrenHtml);
                }
                case 'parts-grid': return getPartsGridHTML(p);
                case 'parts-slider': return getPartsSliderHTML(p);
                case 'parts-tab': return getPartsTabHTML(p, comp.children || []);
                case 'parts-tab-panel': return (comp.children || []).map((child: any) => renderComponentHTML(child)).join('');
            }
        }

export function escapeHtml(str: any) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\'/g, '&#39;');
}

export function getPartsGridHTML(p) {
    const v = p.variant || 'pt1';
    let pattern = 1;
    let hasDetail = false;
    let isFlex = false;
    let isCenter = false;
    let isCta = false;
    let count = p.childrenCount || 6;

    if (v === 'pt1') { pattern = 1; }
    else if (v === 'pt2') { pattern = 2; }
    else if (v === 'pt3') { pattern = 3; }
    else if (v === 'pt4') { pattern = 1; hasDetail = true; }
    else if (v === 'pt5') { pattern = 2; hasDetail = true; }
    else if (v === 'pt6') { pattern = 3; hasDetail = true; }
    else if (v === 'pt7') { pattern = 1; isFlex = true; }
    else if (v === 'pt8') { pattern = 1; isFlex = true; isCenter = true; }
    else if (v === 'pt9') { pattern = 2; isFlex = true; }
    else if (v === 'pt10') { pattern = 2; isFlex = true; isCenter = true; }
    else if (v === 'pt11') { pattern = 3; isFlex = true; }
    else if (v === 'pt12') { pattern = 3; isFlex = true; isCenter = true; }
    else if (v === 'pt13') { pattern = 1; isFlex = true; isCta = true; }
    else if (v === 'pt14') { pattern = 1; isFlex = true; isCenter = true; isCta = true; }
    else if (v === 'pt15') { pattern = 2; isFlex = true; isCta = true; }
    else if (v === 'pt16') { pattern = 2; isFlex = true; isCenter = true; isCta = true; }
    else if (v === 'pt17') { pattern = 3; isFlex = true; isCta = true; }
    else if (v === 'pt18') { pattern = 3; isFlex = true; isCenter = true; isCta = true; }

    const gridClassMap = { 1: 'grid-2', 2: 'grid-3', 3: 'grid-4' };
    const gridClass = gridClassMap[pattern] || 'grid-2';
    
    let itemsHtml = '';
    for (let i = 0; i < count; i++) {
        let classes: string[] = [];
        if (isFlex) classes.push('parts-flex-item');
        else classes.push('parts-grid-item');
        if (isCenter) classes.push('flex-center');
        if (isCta) classes.push('cta');
        
        let detailHtml = '';
        if (hasDetail) {
            detailHtml = `<div class="parts-grid-item-text"><p>詳細が入ります</p></div>`;
        }

        if (isFlex) {
            let innerTextHtml = '';
            if (isCta) {
                innerTextHtml = `
                    <div class="parts-flext-text" style="display: flex; flex-direction: column; justify-content: space-between;">
                        <div class="flex-text-box">
                            <h4 class="grid-ttl" style="margin: 0 0 4px; font-size: 1.1rem;">タイトルタイトル</h4>
                            <p class="grid-text" style="margin: 0; font-size: 0.9rem; color: #666;">本文が入ります</p>
                        </div>
                        <div class="grid-detail-box" style="margin-top: 8px;">
                            <button class="grid-detail">詳細を見る</button>
                        </div>
                    </div>
                `;
            } else {
                innerTextHtml = `
                    <div class="parts-flext-text">
                        <h4 class="grid-ttl" style="margin: 0 0 4px; font-size: 1.1rem;">タイトルタイトル</h4>
                        <p class="grid-text" style="margin: 0; font-size: 0.9rem; color: #666;">本文が入ります</p>
                    </div>
                `;
            }
            itemsHtml += `
                <div class="${classes.join(' ')}" style="display: flex; gap: 24px;">
                    <div class="parts-flex-img" style="flex-shrink: 0; width: 120px;">
                        <img src="/dummy_210.svg" alt="" class="grid-img" style="width: 100%; height: auto; border-radius: 4px;" />
                    </div>
                    ${innerTextHtml}
                </div>
            `;
        } else {
            let ctaButtonHtml = isCta ? `<button class="grid-detail">詳細を見る</button>` : '';
            itemsHtml += `
                <div class="${classes.join(' ')}">
                    <img src="/dummy_210.svg" alt="" class="grid-img" style="width: 100%; height: auto; border-radius: 4px;" />
                    <h4 class="grid-ttl" style="margin: 8px 0 4px; font-size: 1.1rem;">タイトルタイトル</h4>
                    <p class="grid-text" style="margin: 0 0 8px; font-size: 0.9rem; color: #666;">本文が入ります</p>
                    ${detailHtml}
                    ${ctaButtonHtml}
                </div>
            `;
        }
    }

    return `<div class="parts-grid ${gridClass}">${itemsHtml}</div>`;
}

export function getPartsSliderHTML(p) {
    const v = p.variant || 'slider-pt1';
    const perPage = p.perPage || 3;
    const itemsCount = p.itemsCount || 6;
    const dotColor = p.dotColor || '#cccccc';
    const activeDotColor = p.activeDotColor || '#333333';

    let centerAlign = false;
    let showDetail = false;
    
    if (v === 'slider-pt2') centerAlign = true;
    else if (v === 'slider-pt3') showDetail = true;
    else if (v === 'slider-pt4') { centerAlign = true; showDetail = true; }

    const itemClass = centerAlign ? 'parts-slider-item slider-item-center' : 'parts-slider-item';
    const itemWidthPercent = 100 / perPage;

    let itemsHtml = '';
    for (let i = 0; i < itemsCount; i++) {
        let detailHtml = showDetail ? `<button class="slider-detail">詳細を見る</button>` : '';
        itemsHtml += `
            <div class="${itemClass}" style="flex: 0 0 ${itemWidthPercent}%; padding: 0 10px; box-sizing: border-box;">
                <img src="/dummy_210.svg" alt="ダミー" class="slider-img" style="width: 100%; height: auto; border-radius: 4px;">
                <h4 class="slider-ttl" style="margin: 8px 0 4px;">タイトル${i+1}</h4>
                <div class="slider-text" style="font-size: 0.9rem; color: #666;">本文が入ります本文が入ります</div>
                ${detailHtml}
            </div>
        `;
    }

    let dotsHtml = '';
    for (let i = 0; i < itemsCount; i++) {
        const color = i === 0 ? activeDotColor : dotColor;
        dotsHtml += `<span class="dot${i===0 ? ' is-active' : ''}" style="background-color: ${color};"></span>`;
    }

    return `
    <div class="parts-slider ${v} slider-3 js-parts-slider" style="position:relative; width:100%; max-width:1000px; margin:0 auto; padding:0 50px; box-sizing:border-box;">
        <div class="slider-wrapper" style="overflow:hidden; width:100%; padding:20px 0;">
            <div class="slider" style="display:flex; width:100%; transition:transform 0.3s ease;">
                ${itemsHtml}
            </div>
        </div>
        <div class="slider-button">
            <button class="prev">＜</button>
            <button class="next">＞</button>
        </div>
        <div class="slider-dots">
            ${dotsHtml}
        </div>
    </div>`;
}

export function getPartsTabHTML(p, panels) {
    const v = p.variant || 'pt1';
    const num = parseInt(v.replace('pt', '')) || 1;
    const isColumn = num >= 10;
    
    let html = `<div class="tab-wrapper js-parts-tab-box ${v} ${isColumn ? 'tab-column' : ''}" style="width:90%; margin:0 auto;">`;
    html += `<ul class="tab-wrap" style="display:flex; list-style:none; padding:0; margin:0;">`;
    panels.forEach((panel, i) => {
        const label = panel.props?.label || `Tab${i+1}`;
        html += `<li class="tab-item js-parts-tab-item ${i===0 ? ' active is-active' : ''}" style="cursor:pointer;"><button class="tab-button" style="background:none; border:none; padding:8px 16px; cursor:pointer;">${escapeHtml(label)}</button></li>`;
    });
    html += `</ul><div class="parts-tab-content js-parts-tab-content" style="margin-top:20px; padding:20px; border:1px solid #ccc; background:#fff;">`;
    panels.forEach((panel, i) => {
        const childrenHtml = (panel.children || []).map((c: any) => renderComponentHTML(c)).join('');
        html += `<div class="parts-tab-panel js-parts-tab-panel ${i===0 ? ' active is-active' : ''}" style="display:${i===0?'block':'none'}">${childrenHtml || '<p>コンテンツがありません</p>'}</div>`;
    });
    html += `</div></div>`;
    return html;
}


export function getMvHeroHTML(p, wrap = true) {
    const v = p.variant || 'pt1';
    let inner = "";
    switch(v) {
    case 'pt1': inner = `<div class="ttl-level1 ttl-pt1"><h1 class="ttl">${escapeHtml(p.title)}</h1></div>`; break;
    case 'pt2': inner = `<div class="ttl-level1 ttl-pt2 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div>`; break;
    case 'pt3': inner = `<div class="ttl-level1 ttl-pt3 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div>`; break;
    case 'pt4': inner = `<div class="ttl-level1 ttl-pt4"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div>`; break;
    case 'pt5': inner = `<div class="ttl-level1 ttl-pt5 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div>`; break;
    case 'pt6': inner = `<div class="ttl-level1-cta ttl-pt6 gap40"><h1 class="ttl">${escapeHtml(p.title)}</h1><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div>`; break;
    case 'pt7': inner = `<div class="ttl-level1-cta ttl-pt7 gap40"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div>`; break;
    case 'pt8': inner = `<div class="ttl-level1-cta ttl-pt8 gap40"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div>`; break;
    case 'pt9': inner = `<div class="ttl-level1-cta ttl-pt9 gap40"><div class="ttl-level1"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div>`; break;
    case 'pt10': inner = `<div class="ttl-level1-cta ttl-pt10 gap40"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div>`; break;
    case 'pt11': inner = `<div class="ttl-level1-cta ttl-pt11 gap40"><h1 class="ttl">${escapeHtml(p.title)}</h1><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt12': inner = `<div class="ttl-level1-cta ttl-pt12 gap40"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt13': inner = `<div class="ttl-level1-cta ttl-pt13 gap40"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt14': inner = `<div class="ttl-level1-cta ttl-pt14 gap40"><div class="ttl-level1"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt15': inner = `<div class="ttl-level1-cta ttl-pt15 gap40"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt16': inner = `<div class="ttl-level1-cta ttl-pt16 gap40"><h1 class="ttl">${escapeHtml(p.title)}</h1><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt17': inner = `<div class="ttl-level1-cta ttl-pt17 gap40"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt18': inner = `<div class="ttl-level1-cta ttl-pt18 gap40"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt19': inner = `<div class="ttl-level1-cta ttl-pt19 gap40"><div class="ttl-level1"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt20': inner = `<div class="ttl-level1-cta ttl-pt20 gap40"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt21': inner = `<div class="ttl-level1-sub-text ttl-pt21"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div>`; break;
    case 'pt22': inner = `<div class="ttl-level1-sub-text ttl-pt22 gap20"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div>`; break;
    case 'pt23': inner = `<div class="ttl-level1-sub-text ttl-pt23 gap20"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt24': inner = `<div class="ttl-level1-sub-text ttl-pt24 left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div>`; break;
    case 'pt25': inner = `<div class="ttl-level1-sub-text ttl-pt25 left gap20"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div>`; break;
    case 'pt26': inner = `<div class="ttl-level1-sub-text ttl-pt26 left gap20"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div>`; break;
    case 'pt27': inner = `<div class="ttl-level1 ttl-pt27 flex start"><h1 class="ttl">${escapeHtml(p.title)}</h1><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt28': inner = `<div class="ttl-level1 ttl-pt28 flex center"><h1 class="ttl">${escapeHtml(p.title)}</h1><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt29': inner = `<div class="ttl-level1 ttl-pt29 flex end"><h1 class="ttl">${escapeHtml(p.title)}</h1><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt30': inner = `<div class="ttl-level1 ttl-pt30 border"><div class="ttl-level1 ttl-pt30 flex start"><h1 class="ttl">${escapeHtml(p.title)}</h1><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div></div>`; break;
    case 'pt31': inner = `<div class="ttl-level1 ttl-pt31 border"><div class="ttl-level1 ttl-pt31 flex center"><h1 class="ttl">${escapeHtml(p.title)}</h1><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div></div>`; break;
    case 'pt32': inner = `<div class="ttl-level1 ttl-pt32 border"><div class="ttl-level1 ttl-pt32 flex end"><h1 class="ttl">${escapeHtml(p.title)}</h1><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div></div>`; break;
    case 'pt33': inner = `<div class="ttl-level1 ttl-pt33 flex start"><div class="flex-cta"><h1 class="ttl">${escapeHtml(p.title)}</h1><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt34': inner = `<div class="ttl-level1 ttl-pt34 flex center"><div class="flex-cta"><h1 class="ttl">${escapeHtml(p.title)}</h1><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt35': inner = `<div class="ttl-level1 ttl-pt35 flex end"><div class="flex-cta"><h1 class="ttl">${escapeHtml(p.title)}</h1><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt36': inner = `<div class="ttl-level1 ttl-pt36 flex start"><div class="flex-cta"><h1 class="ttl">${escapeHtml(p.title)}</h1><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt37': inner = `<div class="ttl-level1 ttl-pt37 flex center"><div class="flex-cta"><h1 class="ttl">${escapeHtml(p.title)}</h1><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt38': inner = `<div class="ttl-level1 ttl-pt38 flex end"><div class="flex-cta"><h1 class="ttl">${escapeHtml(p.title)}</h1><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt39': inner = `<div class="ttl-level1 ttl-pt39 flex start"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt40': inner = `<div class="ttl-level1 ttl-pt40 flex center"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt41': inner = `<div class="ttl-level1 ttl-pt41 flex end"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt42': inner = `<div class="ttl-level1 ttl-pt42 border flex start"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt43': inner = `<div class="ttl-level1 ttl-pt43 border flex center"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt44': inner = `<div class="ttl-level1 ttl-pt44 border flex end"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt45': inner = `<div class="ttl-level1 ttl-pt45 border"><div class="ttl-level1 ttl-pt45 flex start"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div></div>`; break;
    case 'pt46': inner = `<div class="ttl-level1 ttl-pt46 border"><div class="ttl-level1 ttl-pt46 flex center"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div></div>`; break;
    case 'pt47': inner = `<div class="ttl-level1 ttl-pt47 border"><div class="ttl-level1 ttl-pt47 flex end"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div></div>`; break;
    case 'pt48': inner = `<div class="ttl-level1 ttl-pt48 border"><div class="ttl-level1 ttl-pt48 flex start"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div></div>`; break;
    case 'pt49': inner = `<div class="ttl-level1 ttl-pt49 border"><div class="ttl-level1 ttl-pt49 flex center"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div></div>`; break;
    case 'pt50': inner = `<div class="ttl-level1 ttl-pt50 border"><div class="ttl-level1 ttl-pt50 flex end"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div></div>`; break;
    case 'pt51': inner = `<div class="ttl-level1 ttl-pt51 flex start widht"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt52': inner = `<div class="ttl-level1 ttl-pt52 flex center widht"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt53': inner = `<div class="ttl-level1 ttl-pt53 flex end widht"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt54': inner = `<div class="ttl-level1 ttl-pt54 flex start widht border"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt55': inner = `<div class="ttl-level1 ttl-pt55 flex center widht border"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt56': inner = `<div class="ttl-level1 ttl-pt56 flex end widht border"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt57': inner = `<div class="ttl-level1 ttl-pt57 flex start widht"><div class="flex-cta"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt58': inner = `<div class="ttl-level1 ttl-pt58 flex center widht"><div class="flex-cta"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt59': inner = `<div class="ttl-level1 ttl-pt59 flex end widht"><div class="flex-cta"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt60': inner = `<div class="ttl-level1 ttl-pt60 flex start widht"><div class="flex-cta"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt61': inner = `<div class="ttl-level1 ttl-pt61 flex center widht"><div class="flex-cta"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt62': inner = `<div class="ttl-level1 ttl-pt62 flex end widht"><div class="flex-cta"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt63': inner = `<div class="ttl-level1 ttl-pt63 flex start widht"><div class="flex-cta"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt64': inner = `<div class="ttl-level1 ttl-pt64 flex center widht"><div class="flex-cta"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt65': inner = `<div class="ttl-level1 ttl-pt65 flex end widht"><div class="flex-cta"><div class="ttl-level1 reverse left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><div class="parts btn2 column"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt66': inner = `<div class="ttl-level1 ttl-pt66 flex start widht"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt67': inner = `<div class="ttl-level1 ttl-pt67 flex center widht"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt68': inner = `<div class="ttl-level1 ttl-pt68 flex end widht"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt69': inner = `<div class="ttl-level1 ttl-pt69 flex start widht border"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt70': inner = `<div class="ttl-level1 ttl-pt70 flex center widht border"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt71': inner = `<div class="ttl-level1 ttl-pt71 flex end widht border"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt72': inner = `<div class="ttl-level1 ttl-pt72 flex start widht"><div class="flex-cta"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt73': inner = `<div class="ttl-level1 ttl-pt73 flex center widht"><div class="flex-cta"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt74': inner = `<div class="ttl-level1 ttl-pt74 flex end widht"><div class="flex-cta"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt75': inner = `<div class="ttl-level1 ttl-pt75 flex start widht"><div class="flex-cta"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt76': inner = `<div class="ttl-level1 ttl-pt76 flex center widht"><div class="flex-cta"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt77': inner = `<div class="ttl-level1 ttl-pt77 flex end widht"><div class="flex-cta"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt78': inner = `<div class="ttl-level1 ttl-pt78 flex start widht"><div class="flex-cta"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts column btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt79': inner = `<div class="ttl-level1 ttl-pt79 flex center widht"><div class="flex-cta"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts column btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt80': inner = `<div class="ttl-level1 ttl-pt80 flex end widht"><div class="flex-cta"><div class="ttl-level1 left"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts column btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt81': inner = `<div class="ttl-level1 ttl-pt81 flex start widht"><div class="ttl-level1-sub-text"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt82': inner = `<div class="ttl-level1 ttl-pt82 flex center widht"><div class="ttl-level1-sub-text"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt83': inner = `<div class="ttl-level1 ttl-pt83 flex end widht"><div class="ttl-level1-sub-text"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt84': inner = `<div class="ttl-level1 ttl-pt84 flex start widht border"><div class="ttl-level1-sub-text"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt85': inner = `<div class="ttl-level1 ttl-pt85 flex center widht border"><div class="ttl-level1-sub-text"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt86': inner = `<div class="ttl-level1 ttl-pt86 flex end widht border"><div class="ttl-level1-sub-text"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt87': inner = `<div class="ttl-level1 ttl-pt87 flex start widht"><div class="ttl-level1-sub-text gap40"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt88': inner = `<div class="ttl-level1 ttl-pt88 flex center widht"><div class="ttl-level1-sub-text gap40"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt89': inner = `<div class="ttl-level1 ttl-pt89 flex end widht"><div class="ttl-level1-sub-text gap40"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt90': inner = `<div class="ttl-level1 ttl-pt90 flex start widht"><div class="ttl-level1-sub-text gap40"><div class="flex-cta gap20"><div class="ttl-level1 reverse"><h1 class="ttl sub reverse">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt91': inner = `<div class="ttl-level1 ttl-pt91 flex center widht"><div class="ttl-level1-sub-text gap40"><div class="flex-cta gap20"><div class="ttl-level1 reverse"><h1 class="ttl sub reverse">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt92': inner = `<div class="ttl-level1 ttl-pt92 flex end widht"><div class="ttl-level1-sub-text gap40"><div class="flex-cta gap20"><div class="ttl-level1 reverse"><h1 class="ttl sub reverse">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt93': inner = `<div class="ttl-level1 ttl-pt93 flex start widht"><div class="ttl-level1-sub-text gap40"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts column btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt94': inner = `<div class="ttl-level1 ttl-pt94 flex center widht"><div class="ttl-level1-sub-text gap40"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts column btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt95': inner = `<div class="ttl-level1 ttl-pt95 flex end widht"><div class="ttl-level1-sub-text gap40"><div class="flex-cta"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts column btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt96': inner = `<div class="ttl-level1 ttl-pt96 flex start widht"><div class="ttl-level1-sub-text left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt97': inner = `<div class="ttl-level1 ttl-pt97 flex center widht"><div class="ttl-level1-sub-text left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt98': inner = `<div class="ttl-level1 ttl-pt98 flex end widht"><div class="ttl-level1-sub-text left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt99': inner = `<div class="ttl-level1 ttl-pt99 flex start widht border"><div class="ttl-level1-sub-text left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt100': inner = `<div class="ttl-level1 ttl-pt100 flex center widht border"><div class="ttl-level1-sub-text left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt101': inner = `<div class="ttl-level1 ttl-pt101 flex end widht border"><div class="ttl-level1-sub-text left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt102': inner = `<div class="ttl-level1 ttl-pt102 flex start widht"><div class="ttl-level1-sub-text left gap40"><div class="flex-cta left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt103': inner = `<div class="ttl-level1 ttl-pt103 flex center widht"><div class="ttl-level1-sub-text left gap40"><div class="flex-cta left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt104': inner = `<div class="ttl-level1 ttl-pt104 flex end widht"><div class="ttl-level1-sub-text left gap40"><div class="flex-cta left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="header__btn"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt105': inner = `<div class="ttl-level1 ttl-pt105 flex start widht"><div class="ttl-level1-sub-text left gap40"><div class="flex-cta left gap20"><div class="ttl-level1 reverse"><h1 class="ttl sub reverse">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt106': inner = `<div class="ttl-level1 ttl-pt106 flex center widht"><div class="ttl-level1-sub-text left gap40"><div class="flex-cta left gap20"><div class="ttl-level1 reverse"><h1 class="ttl sub reverse">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt107': inner = `<div class="ttl-level1 ttl-pt107 flex end widht"><div class="ttl-level1-sub-text left gap40"><div class="flex-cta left gap20"><div class="ttl-level1 reverse"><h1 class="ttl sub reverse">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt108': inner = `<div class="ttl-level1 ttl-pt108 flex start widht"><div class="ttl-level1-sub-text left gap40"><div class="flex-cta left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts column btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt109': inner = `<div class="ttl-level1 ttl-pt109 flex center widht"><div class="ttl-level1-sub-text left gap40"><div class="flex-cta left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts column btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    case 'pt110': inner = `<div class="ttl-level1 ttl-pt110 flex end widht"><div class="ttl-level1-sub-text left gap40"><div class="flex-cta left"><div class="ttl-level1 reverse"><h1 class="ttl sub">${escapeHtml(p.title)}</h1><p class="ttl-sub">${escapeHtml(p.subtitle || p.paragraph)}</p></div><p class="ttl-sub">${escapeHtml(p.paragraph || p.subtitle)}</p></div><div class="parts column btn2"><div class="header__btn ctn-btn1"><a href="${escapeHtml(p.btnUrl || '#')}">${escapeHtml(p.btnText || 'CTAボタン')}</a></div><div class="header__btn ctn-btn2"><a href="${escapeHtml(p.btnUrl2 || '#')}">${escapeHtml(p.btnText2 || 'CTAボタン2')}</a></div></div></div><img src="${escapeHtml(p.heroImage || '/dummy_210.svg')}" alt="ダミー画像" width="210" height="210"></div>`; break;
    default: inner = `<div class="ttl-level1 ttl-${v}"><h1 class="ttl">${escapeHtml(p.title)}</h1></div>`; break;
    }
    return wrap ? `<div class="wrapper">${inner}</div>` : inner;
}

export function getMvHeroInnerHTML(p) {
    return getMvHeroHTML(p, false);
}

export function getH3SectionHeadingHTML(p) {
    return buildH3HeadingHTML(p, escapeHtml);
}

export function getH3SectionHTML(p, childrenHtml = '') {
    return `<section class="section">${getH3SectionHeadingHTML(p)}${childrenHtml}</section>`;
}
