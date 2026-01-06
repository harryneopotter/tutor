import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { BookOpen, Calendar, Clock, Users, Bookmark, Trash2, ChevronRight } from 'lucide-react';

// Lazy map of real app components for chapters
const ChapterComponentMap: Record<string, React.ComponentType<any>> = {
  calendar: lazy(() => import('../features/calendar/WeeklyCalendar').then(m => ({ default: m.WeeklyCalendar }))),
  today: lazy(() => import('../features/dashboard/TodayDashboard').then(m => ({ default: m.TodayDashboard }))),
  waitlist: lazy(() => import('../features/waitlist/WaitlistManagement').then(m => ({ default: m.WaitlistManagement }))),
  availability: lazy(() => import('../features/binder/AvailabilityReport').then(m => ({ default: m.AvailabilityReport }))),
  binder: lazy(() => import('../features/binder/StudentBinder').then(m => ({ default: m.StudentBinder }))),
  trash: lazy(() => import('../features/system/TrashView').then(m => ({ default: m.TrashView }))),
};

const PremiumBookUI = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward' | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const pages = [
    {
      id: 'cover',
      type: 'cover',
      title: 'TUTOR',
      subtitle: 'VIRTUAL CLASSROOM',
      edition: 'PREMIUM EDITION'
    },
    {
      id: 'toc',
      type: 'toc',
      title: 'Table of Contents',
      chapters: [
        { id: 'calendar', title: 'Weekly Calendar', icon: Calendar, chapter: 'I' },
        { id: 'today', title: 'Today\'s Schedule', icon: Clock, chapter: 'II' },
        { id: 'waitlist', title: 'Student Waitlist', icon: Users, chapter: 'III' },
        { id: 'availability', title: 'Availability Report', icon: Clock, chapter: 'IV' },
        { id: 'binder', title: 'Student Binder', icon: Bookmark, chapter: 'V' },
        { id: 'trash', title: 'Archive', icon: Trash2, chapter: 'VI' },
      ]
    },
    { id: 'calendar', type: 'chapter', title: 'Weekly Calendar', icon: Calendar, chapter: 'I' },
    { id: 'today', type: 'chapter', title: 'Today\'s Schedule', icon: Clock, chapter: 'II' },
    { id: 'waitlist', type: 'chapter', title: 'Student Waitlist', icon: Users, chapter: 'III' },
    { id: 'availability', type: 'chapter', title: 'Availability Report', icon: Clock, chapter: 'IV' },
    { id: 'binder', type: 'chapter', title: 'Student Binder', icon: Bookmark, chapter: 'V' },
    { id: 'trash', type: 'chapter', title: 'Archive', icon: Trash2, chapter: 'VI' },
  ];

  const goToNextPage = () => {
    if (isTransitioning || currentPageIndex >= pages.length - 1) return;
    setIsTransitioning(true);
    setTransitionDirection('forward');
    setTimeout(() => {
      setCurrentPageIndex(prev => prev + 1);
      setIsTransitioning(false);
      setTransitionDirection(null);
    }, 400); // Snappier Apple-style transitions
  };

  const goToPreviousPage = () => {
    if (isTransitioning || currentPageIndex <= 0) return;
    setIsTransitioning(true);
    setTransitionDirection('backward');
    setTimeout(() => {
      setCurrentPageIndex(prev => prev - 1);
      setIsTransitioning(false);
      setTransitionDirection(null);
    }, 400);
  };

  const goToPage = (index) => {
    if (isTransitioning || index === currentPageIndex) return;
    setIsTransitioning(true);
    setTransitionDirection(index > currentPageIndex ? 'forward' : 'backward');
    setTimeout(() => {
      setCurrentPageIndex(index);
      setIsTransitioning(false);
      setTransitionDirection(null);
    }, 400);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goToNextPage();
    }
    if (touchStart - touchEnd < -75) {
      goToPreviousPage();
    }
  };

  // Keyboard navigation: ArrowLeft/Right, PageUp/PageDown, Home/End
  const onKeyDown = useCallback((e) => {
    if (isTransitioning) return;
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault();
        goToNextPage();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        goToPreviousPage();
        break;
      case 'Home':
        e.preventDefault();
        if (currentPageIndex !== 0) {
          setIsTransitioning(true);
          setTransitionDirection('backward');
          setTimeout(() => {
            setCurrentPageIndex(0);
            setIsTransitioning(false);
            setTransitionDirection(null);
          }, 400);
        }
        break;
      case 'End':
        e.preventDefault();
        if (currentPageIndex !== pages.length - 1) {
          setIsTransitioning(true);
          setTransitionDirection('forward');
          setTimeout(() => {
            setCurrentPageIndex(pages.length - 1);
            setIsTransitioning(false);
            setTransitionDirection(null);
          }, 400);
        }
        break;
      default:
        break;
    }
  }, [isTransitioning, currentPageIndex, pages.length]);

  // Auto-advance from cover
  useEffect(() => {
    if (currentPageIndex === 0) {
      const timer = setTimeout(() => {
        goToNextPage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPageIndex]);

  // Move focus to the page stack container when page changes (if not transitioning)
  useEffect(() => {
    if (!isTransitioning) {
      const container = document.querySelector('[aria-roledescription="Book pages"]') as HTMLElement | null;
      container?.focus();
    }
  }, [currentPageIndex, isTransitioning]);

  const currentPage = pages[currentPageIndex];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 overflow-hidden">
      <style>{`
        /* Fonts are loaded globally via index.html */
        
        .page-texture {
          background-image: 
            linear-gradient(90deg, rgba(139, 69, 19, 0.015) 1px, transparent 1px),
            linear-gradient(rgba(139, 69, 19, 0.015) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        
        .leather-texture {
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(0,0,0,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(0,0,0,0.15) 0%, transparent 50%);
          background-size: 300px 300px, 300px 300px;
        }
        
        .roll-out {
          animation: rollOut 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
        }
        
        .roll-out-reverse {
          animation: rollOutReverse 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
        }
        
        @keyframes rollOut {
          0% {
            transform: translateX(0) scale(1) rotateY(0deg);
            opacity: 1;
            filter: blur(0);
          }
          100% {
            transform: translateX(-120%) scale(0.9) rotateY(-20deg);
            opacity: 0;
            filter: blur(10px);
          }
        }
        
        @keyframes rollOutReverse {
          0% {
            transform: translateX(0) scale(1) rotateY(0deg);
            opacity: 1;
            filter: blur(0);
          }
          100% {
            transform: translateX(120%) scale(0.9) rotateY(20deg);
            opacity: 0;
            filter: blur(10px);
          }
        }
        
        .page-enter {
          animation: pageEnter 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
        }
        
        @keyframes pageEnter {
          0% {
            transform: scale(1.05);
            opacity: 0;
            filter: blur(5px);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }
        
        .gold-accent {
          background: linear-gradient(135deg, #d4af37 0%, #f9d77e 50%, #d4af37 100%);
        }
        
        .ornament {
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 5 L25 15 L35 15 L27 22 L30 32 L20 26 L10 32 L13 22 L5 15 L15 15 Z' fill='%23d4af37' opacity='0.4'/%3E%3C/svg%3E");
        }
        
        .title-font {
          font-family: 'Cinzel', serif;
        }
        
        .body-font {
          font-family: 'EB Garamond', serif;
        }

        @media (prefers-reduced-motion: reduce) {
          .roll-out,
          .roll-out-reverse,
          .page-enter {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Page Stack - Shows all pages underneath */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        role="region"
        aria-roledescription="Book pages"
        aria-label="Premium book UI"
        tabIndex={0}
        aria-keyshortcuts="ArrowLeft ArrowRight PageUp PageDown Home End"
        onKeyDown={onKeyDown}
      >
        {pages.map((page, index) => {
          // Render windowing: only render current page and immediate neighbors
          if (index < currentPageIndex - 1 || index > currentPageIndex + 1) return null;

          const isActive = index === currentPageIndex;
          const zIndex = pages.length - index;
          const scale = 1 - (index - currentPageIndex) * 0.05;
          const translateY = (index - currentPageIndex) * 20;
          const transitionClass = isActive && isTransitioning
            ? (transitionDirection === 'forward' ? 'roll-out' : transitionDirection === 'backward' ? 'roll-out-reverse' : '')
            : (isActive ? 'page-enter' : '');

          return (
            <div
              key={page.id}
              className={`absolute inset-4 md:inset-8 lg:inset-16 ${transitionClass}`}
              style={{
                zIndex,
                transform: `scale(${scale}) translateY(${translateY}px)`,
                transition: isActive ? 'none' : 'transform 0.3s ease-out',
              }}
              onTouchStart={isActive ? handleTouchStart : undefined}
              onTouchMove={isActive ? handleTouchMove : undefined}
              onTouchEnd={isActive ? handleTouchEnd : undefined}
              role="group"
              aria-roledescription="Page"
              aria-label={`${page.title}${page.chapter ? `, Chapter ${page.chapter}` : ''}`}
            >
              {page.type === 'cover' && <CoverPage page={page} />}
              {page.type === 'toc' && <TOCPage page={page} goToPage={goToPage} pages={pages} />}
              {page.type === 'chapter' && <ChapterPage page={page} />}
            </div>
          );
        })}
      </div>

      {/* Navigation UI */}
      {currentPageIndex > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4" role="navigation" aria-label="Page navigation">
          {/* Progress Dots */}
          <div className="flex items-center gap-2 bg-amber-900/80 backdrop-blur-sm px-4 py-2 rounded-full">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                disabled={isTransitioning}
                className={`transition-all duration-300 rounded-full ${currentPageIndex === index
                  ? 'bg-amber-300 w-8 h-2'
                  : 'bg-amber-600/40 w-2 h-2 hover:bg-amber-500'
                  } disabled:opacity-50`}
                aria-label={`Go to page ${index + 1}`}
                aria-current={currentPageIndex === index ? 'page' : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Swipe Hint */}
      {currentPageIndex < pages.length - 1 && !isTransitioning && (
        <button
          onClick={goToNextPage}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-amber-800/90 backdrop-blur-sm text-amber-100 hover:bg-amber-700 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        >
          <ChevronRight className="w-6 h-6" />
          <span className="absolute right-14 whitespace-nowrap text-sm bg-amber-900/90 backdrop-blur-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            Swipe, Click, or Arrow Keys
          </span>
        </button>
      )}

      {/* Page Counter */}
      {currentPageIndex > 0 && (
        <div className="fixed top-8 right-8 z-40 text-amber-800/60 text-sm body-font" aria-live="polite">
          Page {currentPageIndex} of {pages.length - 1}
        </div>
      )}
    </div>
  );
};

// Cover Page Component
const CoverPage = ({ page }) => (
  <div className="w-full h-full rounded-2xl shadow-2xl leather-texture bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 flex flex-col items-center justify-center border-4 border-amber-950 relative overflow-hidden">
    {/* Gold Border Frame */}
    <div className="absolute inset-8 border-2 border-amber-400/30 rounded-xl"></div>
    <div className="absolute inset-12 border border-amber-400/20"></div>

    {/* Ornamental Corners */}
    <div className="absolute top-16 left-16 w-20 h-20 ornament"></div>
    <div className="absolute top-16 right-16 w-20 h-20 ornament transform rotate-90"></div>
    <div className="absolute bottom-16 left-16 w-20 h-20 ornament transform -rotate-90"></div>
    <div className="absolute bottom-16 right-16 w-20 h-20 ornament transform rotate-180"></div>

    {/* Title */}
    <div className="relative z-10 text-center space-y-8 px-8">
      <div className="flex justify-center mb-8">
        <BookOpen className="w-24 h-24 text-amber-400" strokeWidth={1.5} />
      </div>
      <h1 className="title-font text-6xl md:text-8xl font-bold text-amber-100 tracking-wider">
        {page.title}
      </h1>
      <div className="h-px w-64 mx-auto gold-accent"></div>
      <h2 className="title-font text-2xl md:text-3xl font-semibold text-amber-300 tracking-widest">
        {page.subtitle}
      </h2>
      <p className="text-amber-400/70 text-sm tracking-[0.3em] mt-8">
        {page.edition}
      </p>
    </div>

    {/* Bottom Ornament */}
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-amber-400/30 text-xs tracking-widest">
      ✦ MMXXV ✦
    </div>
  </div>
);

// Table of Contents Page Component
const TOCPage = ({ page, goToPage, pages }) => (
  <div className="w-full h-full rounded-2xl shadow-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 page-texture border border-amber-200/50 overflow-hidden">
    <div className="h-full flex flex-col p-8 md:p-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="title-font text-5xl md:text-6xl font-bold text-amber-900 mb-4 tracking-wide">
          {page.title}
        </h1>
        <div className="h-px w-48 mx-auto gold-accent"></div>
      </div>

      {/* Chapters List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {page.chapters.map((chapter, idx) => (
          <button
            key={chapter.id}
            onClick={() => goToPage(pages.findIndex(p => p.id === chapter.id))}
            className="w-full group hover:bg-amber-100/70 p-4 md:p-6 rounded-xl transition-all duration-300 border border-transparent hover:border-amber-300/50 hover:shadow-md"
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex-shrink-0">
                {React.createElement(chapter.icon, {
                  className: "w-8 h-8 md:w-10 md:h-10 text-amber-600 group-hover:text-amber-700 transition-colors",
                  strokeWidth: 1.5
                })}
              </div>
              <div className="flex-1 text-left">
                <div className="title-font text-xs md:text-sm text-amber-600/60 mb-1 tracking-widest">
                  CHAPTER {chapter.chapter}
                </div>
                <div className="body-font text-lg md:text-xl font-semibold text-amber-900 group-hover:text-amber-700 transition-colors">
                  {chapter.title}
                </div>
              </div>
              <div className="title-font text-amber-600/40 text-sm md:text-base">
                {(idx + 1) * 2 + 2}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Decoration */}
      <div className="text-center text-amber-400/40 text-xl mt-8">
        ❦
      </div>
    </div>
  </div>
);

// Chapter Page Component
const ChapterPage = ({ page }) => (
  <div className="w-full h-full rounded-2xl shadow-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 page-texture border border-amber-200/50 overflow-hidden">
    <div className="h-full flex flex-col p-8 md:p-16">
      {/* Chapter Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          {React.createElement(page.icon, {
            className: "w-10 h-10 md:w-12 md:h-12 text-amber-600",
            strokeWidth: 1.5
          })}
          <div>
            <div className="text-xs md:text-sm text-amber-600/60 tracking-widest title-font">
              CHAPTER {page.chapter}
            </div>
            <h1 className="title-font text-3xl md:text-4xl font-bold text-amber-900">
              {page.title}
            </h1>
          </div>
        </div>
        <div className="h-px w-full gold-accent"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="bg-white/50 rounded-xl p-3 md:p-4 border border-amber-200/50 h-full max-w-screen-xl mx-auto">
          <Suspense fallback={<div className="body-font text-amber-800 p-6" role="status" aria-live="polite">Loading {page.title}...</div>}>
            {ChapterComponentMap[page.id] ? (
              <div className="rounded-lg bg-white/70 p-2 md:p-4 overflow-auto min-h-[60vh]">
                {React.createElement(ChapterComponentMap[page.id])}
              </div>
            ) : (
              <div className="body-font text-amber-700 p-6">Component not found for {page.id}.</div>
            )}
          </Suspense>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-amber-400/40 text-xl mt-6">
        ❦
      </div>
    </div>
  </div>
);

export default PremiumBookUI;