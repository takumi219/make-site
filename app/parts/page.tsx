"use client";
import "../css/style.css"
import "../css/parts.css"
import { useRef, useState, useEffect } from "react";

const ORIGINAL_ITEMS = [
{ id: 1, ttl: "タイトル1", text: "本文が入ります" },
{ id: 2, ttl: "タイトル2", text: "本文が入ります" },
{ id: 3, ttl: "タイトル3", text: "本文が入ります" },
{ id: 4, ttl: "タイトル4", text: "本文が入ります" },
{ id: 5, ttl: "タイトル5", text: "本文が入ります" },
{ id: 6, ttl: "タイトル6", text: "本文が入ります" },
];

function SliderComponent({ patternClass, showDetail, centerAlign, dotColor = '#ccc', activeDotColor = '#333' }) {
  const containerRef = useRef<HTMLDivElement>(null); // parts-slider全体
  const wrapperRef  = useRef<HTMLDivElement>(null); // slider-wrapper（パディング除外の実幅）

  // クラス名から表示数を読み取る（マウント後）
  const [desktopPerPage, setDesktopPerPage] = useState(3);
  useEffect(() => {
    if (containerRef.current) {
      const match = containerRef.current.className.match(/slider-(\d+)/);
      if (match?.[1]) setDesktopPerPage(parseInt(match[1], 10));
    }
  }, []);

  // 画面幅を監視してモバイル・タブレット判定（768px以下 → 1アイテム）
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const activePerPage = isMobile ? 1 : desktopPerPage;
  const total = ORIGINAL_ITEMS.length;

  // ---- スライダー状態 ----
  const [currentIndex, setCurrentIndex] = useState(desktopPerPage); // 初期値=desktopPerPage
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef    = useRef(0);
  const dragOffsetRef = useRef(0);
  const [dragOffset, setDragOffset] = useState(0); // 描画用

  // activePerPage が実際に変わった時だけインデックスをリセット
  const prevActivePerPage = useRef(activePerPage);
  useEffect(() => {
    if (prevActivePerPage.current !== activePerPage) {
      prevActivePerPage.current = activePerPage;
      setIsTransitioning(false);
      setCurrentIndex(activePerPage);
    }
  }, [activePerPage]);

  // 無限ループ：境界を超えたら透明にジャンプ
  useEffect(() => {
    if (currentIndex >= total + activePerPage) {
      const t = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(activePerPage);
      }, 320);
      return () => clearTimeout(t);
    }
    if (currentIndex < activePerPage) {
      const t = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(total + activePerPage - 1);
      }, 320);
      return () => clearTimeout(t);
    }
  }, [currentIndex, total, activePerPage]);

  // クローンを含む全アイテム配列
  const clonesBefore = ORIGINAL_ITEMS.slice(-activePerPage);
  const clonesAfter  = ORIGINAL_ITEMS.slice(0, activePerPage);
  const combinedItems = [...clonesBefore, ...ORIGINAL_ITEMS, ...clonesAfter];

  // アクティブなドットのインデックス（0始まり）
  const activeDotIndex = ((currentIndex - activePerPage) % total + total) % total;

  // ---- ハンドラ ----
  const handleScroll = (direction) => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + (direction === 'next' ? 1 : -1));
  };

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index + activePerPage);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setIsTransitioning(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    dragOffsetRef.current = 0;
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - startXRef.current;
    dragOffsetRef.current = offset;
    setDragOffset(offset); // 描画更新
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsTransitioning(true);
    // slider-wrapper の実幅（パディングを除いた正確な幅）
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

  // Transform 計算：wrapperWidth ベースでドラッグをパーセントに変換
  const itemWidthPercent = 100 / activePerPage;
  const wrapperWidth = wrapperRef.current?.offsetWidth || 1;
  const dragPercent  = (dragOffset / wrapperWidth) * 100;
  const transformX   = -currentIndex * itemWidthPercent + dragPercent;

  return (
    <div
      className={`parts-slider ${patternClass} slider-3`}
      ref={containerRef}
      style={{
        ['--dot-color' as string]: dotColor,
        ['--dot-active-color' as string]: activeDotColor,
      } as React.CSSProperties}
    >
      <div className="slider-wrapper" ref={wrapperRef}>
        <div
          className="slider"
          style={{
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
              style={{ flex: `0 0 ${itemWidthPercent}%`, maxWidth: `${itemWidthPercent}%` }}
            >
              <img src="/dummy_210.svg" alt="" className="slider-img" draggable={false} />
              <h4 className="slider-ttl">{item.ttl}</h4>
              <div className="slider-text">{item.text}</div>
              {showDetail && <button className="slider-detail">詳細を見る</button>}
            </div>
          ))}
        </div>
      </div>
      <div className="slider-button">
        <button className="prev" onClick={() => handleScroll('prev')}>＜</button>
        <button className="next" onClick={() => handleScroll('next')}>＞</button>
      </div>
      <div className="slider-dots">
        {ORIGINAL_ITEMS.map((_, index) => (
          <span
            key={index}
            className={`dot ${activeDotIndex === index ? 'is-active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

const TAB_ITEMS = ["すべて", "アイテム1", "アイテム2", "アイテム3", "アイテム4"];
function TabComponent({ patternClass, isColumn }) {
const [activeIndex, setActiveIndex] = useState(0);

return (
<div className={`tab-wrapper ${patternClass} ${isColumn ? 'tab-column' : ''}`}>
<ul className="tab-wrap">
{TAB_ITEMS.map((item, index) => (
<li 
key={index} 
className={`tab-item ${activeIndex === index ? 'active' : ''}`}
>
<button className="tab-button" onClick={() => setActiveIndex(index)}>
{item}
</button>
</li>
))}
</ul>
</div>
);
}

const GridItem = ({ hasDetail = false, isFlex = false, isCenter = false, isCta = false }) => (
  <div className={`${isFlex ? 'parts-flex-item' : 'parts-grid-item'} ${isCenter ? 'flex-center' : ''} ${isCta ? 'cta' : ''}`.trim()}>
    {isFlex ? (
      <>
        <div className="parts-flex-img">
          <img src="/dummy_210.svg" alt="" className="grid-img" />
        </div>
        <div className="parts-flext-text">
          {isCta ? (
            <>
              <div className="flex-text-box">
                <h4 className="grid-ttl">タイトルタイトル</h4>
                <p className="grid-text">本文が入ります</p>
              </div>
              <div className="grid-detail-box">
                <button className="grid-detail">詳細を見る</button>
              </div>
            </>
          ) : (
            <>
              <h4 className="grid-ttl">タイトルタイトル</h4>
              <p className="grid-text">本文が入ります</p>
            </>
          )}
        </div>
      </>
    ) : (
      <>
        <img src="/dummy_210.svg" alt="" className="grid-img" />
        <h4 className="grid-ttl">タイトルタイトル</h4>
        <p className="grid-text">本文が入ります</p>
        {hasDetail && <button className="grid-detail">詳細を見る</button>}
      </>
    )}
  </div>
);

const GridSection = ({ pattern, gridClass, childrenCount = 6, hasDetail=false, isFlex=false, isCenter=false, isCta=false }) => (
  <div className={`parts-grid grid-${pattern} grid-${gridClass}`}>
    {Array.from({ length: childrenCount }).map((_, i) => (
      <GridItem key={i} hasDetail={hasDetail} isFlex={isFlex} isCenter={isCenter} isCta={isCta} />
    ))}
  </div>
);

export default function Parts() {
  const normalPatterns = ["pt1", "pt2", "pt3", "pt4", "pt5", "pt6", "pt7", "pt8", "pt9"];
  const columnPatterns = ["pt10", "pt11", "pt12", "pt13"];
  return (
    <>
      <GridSection pattern="pt1" gridClass="2" />
      <GridSection pattern="pt2" gridClass="3" />
      <GridSection pattern="pt3" gridClass="4" />
      <GridSection pattern="pt4" gridClass="2" hasDetail={true} />
      <GridSection pattern="pt5" gridClass="3" hasDetail={true} />
      <GridSection pattern="pt6" gridClass="4" hasDetail={true} />
      
      <GridSection pattern="pt7" gridClass="2" isFlex={true} />
      <GridSection pattern="pt8" gridClass="2" isFlex={true} isCenter={true} />
      <GridSection pattern="pt9" gridClass="3" isFlex={true} />
      <GridSection pattern="pt10" gridClass="3" isFlex={true} isCenter={true} />
      <GridSection pattern="pt11" gridClass="4" isFlex={true} />
      <GridSection pattern="pt12" gridClass="4" isFlex={true} isCenter={true} />
      
      <GridSection pattern="pt13" gridClass="2" isFlex={true} isCta={true} />
      <GridSection pattern="pt14" gridClass="2" isFlex={true} isCenter={true} isCta={true} />
      <GridSection pattern="pt15" gridClass="3" isFlex={true} isCta={true} />
      <GridSection pattern="pt16" gridClass="3" isFlex={true} isCenter={true} isCta={true} />
      <GridSection pattern="pt17" gridClass="4" isFlex={true} isCta={true} />
      <GridSection pattern="pt18" gridClass="4" isFlex={true} isCenter={true} isCta={true} />

      {/* 以下スライダー */}
      <div className="showcase-container">
        <SliderComponent patternClass="slider-pt1" showDetail={false} centerAlign={false} />
        <SliderComponent patternClass="slider-pt2" showDetail={false} centerAlign={true} />
        <SliderComponent patternClass="slider-pt3" showDetail={true} centerAlign={false} />
        <SliderComponent patternClass="slider-pt4" showDetail={true} centerAlign={true} />
      </div>

      {/* 以下タブ切り替え */}
      <div className="tab-showcase-container">
        {normalPatterns.map((pt) => (
          <TabComponent key={pt} patternClass={pt} isColumn={false} />
        ))}
        {columnPatterns.map((pt) => (
          <TabComponent key={pt} patternClass={pt} isColumn={true} />
        ))}
      </div>

      {/* 以下Q&Aエリア */}
<div className="qa-wrapper pt-1">
  <dl className="qa-container">
    
    <div className="qa-item">
      <input type="checkbox" id="qa-1" className="qa-toggle" />
      <label htmlFor="qa-1" className="qa-header">
        <span className="qa-label">Q</span>
        <dt className="qa-ttl">質問テキストテキストテキスト</dt>
        <svg className="qa-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </label>
      <div className="qa-inner">
        <span className="qa-label">A</span>
        <dd className="qa-text">回答テキストテキストテキスト</dd>
      </div>
    </div>

    <div className="qa-item">
      <input type="checkbox" id="qa-2" className="qa-toggle" />
      <label htmlFor="qa-2" className="qa-header">
        <span className="qa-label">Q</span>
        <dt className="qa-ttl">質問テキストテキストテキスト</dt>
        <svg className="qa-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </label>
      <div className="qa-inner">
        <span className="qa-label">A</span>
        <dd className="qa-text">回答テキストテキストテキスト</dd>
      </div>
    </div>

    <div className="qa-item">
      <input type="checkbox" id="qa-3" className="qa-toggle" />
      <label htmlFor="qa-3" className="qa-header">
        <span className="qa-label">Q</span>
        <dt className="qa-ttl">質問テキストテキストテキスト</dt>
        <svg className="qa-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </label>
      <div className="qa-inner">
        <span className="qa-label">A</span>
        <dd className="qa-text">回答テキストテキストテキスト</dd>
      </div>
    </div>

  </dl>
</div>


      {/* Tableエリア */}
      <div className="padding"></div>
    </>
  );
}