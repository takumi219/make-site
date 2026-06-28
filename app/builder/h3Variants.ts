// Auto-generated h3 section variants

export const H3_VARIANT_COUNT = 29;

export const H3_DESCRIPTIONS: Record<string, string> = {
    "pt1": "左寄せタイトル",
    "pt2": "中央寄せタイトル",
    "pt3": "左ボーダー付きタイトル",
    "pt4": "中央寄せ・左ボーダー付きタイトル",
    "pt6": "下線付きタイトル（左）",
    "pt7": "下線付きタイトル（中央）",
    "pt8": "ボトムボーダー（左）",
    "pt10": "枠線ボックス（左）",
    "pt56": "枠線ボックス（中央）",
    "pt11": "左寄せ＋サブタイトル",
    "pt12": "中央寄せ＋サブタイトル",
    "pt14": "左ボーダー＋サブタイトル",
    "pt15": "左ボーダー中央＋サブタイトル",
    "pt16": "下線＋サブタイトル（左）",
    "pt17": "下線＋サブタイトル（中央）",
    "pt18": "逆順（サブ上・タイトル下）中央",
    "pt57": "逆順（サブ上・タイトル下）左",
    "pt19": "左寄せ＋リード文",
    "pt20": "中央＋リード文",
    "pt41": "背景バンド・中央タイトル",
    "pt42": "背景バンド・左＋サブ",
    "pt44": "大見出し（中央）",
    "pt45": "小見出し（左）",
    "pt46": "ラベル付き見出し（中央）",
    "pt47": "ラベル付き見出し（左）",
    "pt48": "区切り線上・中央タイトル",
    "pt49": "区切り線下・左タイトル",
    "pt50": "2カラム（タイトル左・テキスト右）",
    "pt51": "2カラム中央（タイトル・テキスト）"
};

export type H3SectionProps = {
    variant?: string;
    title?: string;
    subtitle?: string;
    paragraph?: string;
};

export function buildH3HeadingHTML(
    p: H3SectionProps,
    esc: (v: any) => string
): string {
    const v = p.variant || 'pt1';
    const title = esc(p.title || 'タイトルタイトルタイトル');
    const subtitle = esc(p.subtitle || 'サブタイトルテキスト');
    const paragraph = esc(p.paragraph || 'テキストテキストテキストテキスト');

    switch (v) {
        case 'pt1':
            return `<div class="ttl-level3 pt1"><h3 class="ttl3">${title}</h3></div>`;
        case 'pt2':
            return `<div class="ttl-level3 pt2 center"><h3 class="ttl3">${title}</h3></div>`;
        case 'pt3':
            return `<div class="ttl-level3 pt3"><h3 class="ttl3 left-border">${title}</h3></div>`;
        case 'pt4':
            return `<div class="ttl-level3 pt4 center"><h3 class="ttl3 left-border">${title}</h3></div>`;
        case 'pt6':
            return `<div class="ttl-level3 pt6"><h3 class="ttl3 underline">${title}</h3></div>`;
        case 'pt7':
            return `<div class="ttl-level3 pt7 center"><h3 class="ttl3 underline">${title}</h3></div>`;
        case 'pt8':
            return `<div class="ttl-level3 pt8"><h3 class="ttl3 bottom-border">${title}</h3></div>`;
        case 'pt10':
            return `<div class="ttl-level3 pt10"><h3 class="ttl3 box-border">${title}</h3></div>`;
        case 'pt56':
            return `<div class="ttl-level3 pt56 center"><h3 class="ttl3 box-border">${title}</h3></div>`;
        case 'pt11':
            return `<div class="ttl-level3 pt11"><h3 class="ttl3">${title}</h3><p class="ttl3-sub">${subtitle}</p></div>`;
        case 'pt12':
            return `<div class="ttl-level3 pt12 center"><h3 class="ttl3">${title}</h3><p class="ttl3-sub">${subtitle}</p></div>`;
        case 'pt14':
            return `<div class="ttl-level3 pt14"><h3 class="ttl3 left-border">${title}</h3><p class="ttl3-sub">${subtitle}</p></div>`;
        case 'pt15':
            return `<div class="ttl-level3 pt15 center"><h3 class="ttl3 left-border">${title}</h3><p class="ttl3-sub">${subtitle}</p></div>`;
        case 'pt16':
            return `<div class="ttl-level3 pt16"><h3 class="ttl3 underline">${title}</h3><p class="ttl3-sub">${subtitle}</p></div>`;
        case 'pt17':
            return `<div class="ttl-level3 pt17 center"><h3 class="ttl3 underline">${title}</h3><p class="ttl3-sub">${subtitle}</p></div>`;
        case 'pt18':
            return `<div class="ttl-level3 pt18 center reverse"><h3 class="ttl3">${title}</h3><p class="ttl3-sub">${subtitle}</p></div>`;
        case 'pt57':
            return `<div class="ttl-level3 pt57 reverse"><h3 class="ttl3">${title}</h3><p class="ttl3-sub">${subtitle}</p></div>`;
        case 'pt19':
            return `<div class="ttl-level3 pt19"><h3 class="ttl3">${title}</h3><p class="ttl3-lead">${paragraph}</p></div>`;
        case 'pt20':
            return `<div class="ttl-level3 pt20 center"><h3 class="ttl3">${title}</h3><p class="ttl3-lead">${paragraph}</p></div>`;
        case 'pt41':
            return `<div class="ttl-level3 pt41 band center"><h3 class="ttl3">${title}</h3></div>`;
        case 'pt42':
            return `<div class="ttl-level3 pt42 band"><h3 class="ttl3">${title}</h3><p class="ttl3-sub">${subtitle}</p></div>`;
        case 'pt44':
            return `<div class="ttl-level3 pt44 center large"><h3 class="ttl3">${title}</h3></div>`;
        case 'pt45':
            return `<div class="ttl-level3 pt45 small"><h3 class="ttl3">${title}</h3></div>`;
        case 'pt46':
            return `<div class="ttl-level3 pt46 center"><p class="ttl3-label">${subtitle}</p><h3 class="ttl3">${title}</h3></div>`;
        case 'pt47':
            return `<div class="ttl-level3 pt47"><p class="ttl3-label">${subtitle}</p><h3 class="ttl3">${title}</h3></div>`;
        case 'pt48':
            return `<div class="ttl-level3 pt48 center divider-top"><h3 class="ttl3">${title}</h3></div>`;
        case 'pt49':
            return `<div class="ttl-level3 pt49 divider-bottom"><h3 class="ttl3">${title}</h3></div>`;
        case 'pt50':
            return `<div class="ttl-level3 pt50 flex between align-start"><h3 class="ttl3">${title}</h3><p class="ttl3-lead col-text">${paragraph}</p></div>`;
        case 'pt51':
            return `<div class="ttl-level3 pt51 flex center align-start gap40"><h3 class="ttl3">${title}</h3><p class="ttl3-lead col-text">${paragraph}</p></div>`;
        default:
            return `<div class="ttl-level3 pt1"><h3 class="ttl3">${title}</h3></div>`;
    }
}
