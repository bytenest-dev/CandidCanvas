import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const SLIDE_DURATION = 3500;

interface ActiveSlide {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
}

export default function CinematicSlider() {
  const { gallery, slider, siteLoading } = useSite();

  const activeSlides: ActiveSlide[] = (() => {
    const enabledSlider = slider.filter(s => s.enabled).sort((a, b) => a.order - b.order);
    if (enabledSlider.length > 0) {
      return enabledSlider.map(s => ({ id: s.id, url: s.url, title: s.title, subtitle: s.subtitle }));
    }
    if (gallery.length > 0) {
      return gallery.map(g => ({ id: g.id, url: g.url, title: g.title, subtitle: g.category }));
    }
    return [];
  })();

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = activeSlides.length;

  useEffect(() => { setCurrent(0); }, [total]);

  // Preload neighbours
  useEffect(() => {
    if (total < 2) return;
    [-1, 1].forEach(offset => {
      const img = new window.Image();
      img.src = activeSlides[((current + offset) % total + total) % total].url;
    });
  }, [current, total]); // eslint-disable-line

  const totalRef = useRef(total);
  totalRef.current = total;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const next = useCallback(() => setCurrent(prev => (prev + 1) % totalRef.current), []);
  const prev = useCallback(() => setCurrent(prev => (prev - 1 + totalRef.current) % totalRef.current), []);

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setCurrent(p => (p + 1) % totalRef.current);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [total]);

  const touchStart = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  const padNum = (n: number) => String(n + 1).padStart(2, '0');

  const getSlide = (offset: number) =>
    activeSlides[((current + offset) % total + total) % total];

  if (siteLoading) {
    return <div className="w-full bg-[#0a0a0a] shimmer" style={{ minHeight: '70vh' }} />;
  }
  if (total === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-[#080808]"
      style={{ height: 'clamp(480px, 88vh, 960px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured photography slider"
    >
      {/* ── Full-bleed blurred bg ── */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={getSlide(0).url}
            alt=""
            aria-hidden
            className="w-full h-full object-cover scale-110"
            style={{ filter: 'blur(28px) brightness(0.22) saturate(0.6)' }}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Three-panel layout ── */}
      <div className="relative z-10 h-full flex items-center justify-center gap-0">

        {/* Prev peek */}
        {total > 1 && (
          <div
            className="hidden sm:block flex-shrink-0 cursor-pointer select-none"
            style={{ width: 'clamp(100px, 14vw, 200px)' }}
            onClick={prev}
          >
            <div
              className="h-full flex items-center justify-end pr-3"
              style={{ height: 'clamp(300px, 62vh, 680px)' }}
            >
              <div
                className="relative overflow-hidden rounded-xl"
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: 0.38,
                  filter: 'brightness(0.55)',
                  transform: 'scale(0.88)',
                  transition: 'opacity 0.3s, transform 0.3s',
                }}
              >
                <img
                  src={getSlide(-1).url}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Center main slide */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{
              width: '100%',
              maxWidth: 'clamp(280px, 44vw, 700px)',
              height: 'clamp(340px, 72vh, 820px)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07)',
            }}
          >
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={current}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <img
                  src={getSlide(0).url}
                  alt={getSlide(0).title || 'Photography by Candid Canvas BD'}
                  className="w-full h-full object-cover object-center"
                  draggable={false}
                  loading="eager"
                  decoding="async"
                />

                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Slide text */}
                {(getSlide(0).title || getSlide(0).subtitle) && (
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.6 }}
                    >
                      {getSlide(0).title && (
                        <h2 className="font-heading text-xl sm:text-2xl text-white drop-shadow-lg leading-tight mb-0.5">
                          {getSlide(0).title}
                        </h2>
                      )}
                      {getSlide(0).subtitle && (
                        <p className="text-white/55 text-[10px] tracking-widest uppercase font-mono">
                          {getSlide(0).subtitle}
                        </p>
                      )}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Next peek */}
        {total > 1 && (
          <div
            className="hidden sm:block flex-shrink-0 cursor-pointer select-none"
            style={{ width: 'clamp(100px, 14vw, 200px)' }}
            onClick={next}
          >
            <div
              className="h-full flex items-center justify-start pl-3"
              style={{ height: 'clamp(300px, 62vh, 680px)' }}
            >
              <div
                className="relative overflow-hidden rounded-xl"
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: 0.38,
                  filter: 'brightness(0.55)',
                  transform: 'scale(0.88)',
                  transition: 'opacity 0.3s, transform 0.3s',
                }}
              >
                <img
                  src={getSlide(1).url}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Prev / Next buttons ── */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* ── Counter top-right ── */}
      <div className="absolute top-4 right-5 sm:top-5 sm:right-7 z-20">
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-white font-semibold text-base sm:text-lg leading-none">{padNum(current)}</span>
          <span className="text-white/35 text-xs">/</span>
          <span className="text-white/35 text-xs">{String(total).padStart(2, '0')}</span>
        </div>
      </div>

      {/* ── Dot indicators bottom-right ── */}
      {total > 1 && total <= 20 && (
        <div className="absolute bottom-5 right-5 sm:right-7 z-20 flex items-center gap-1.5">
          {activeSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`}>
              <span className={`block rounded-full transition-all duration-300 ${
                i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/65'
              }`} />
            </button>
          ))}
        </div>
      )}

      {/* ── Progress bar ── */}
      {total > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          {!paused && (
            <motion.div
              key={`progress-${current}`}
              className="h-full bg-white/45"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
            />
          )}
        </div>
      )}

      {/* ── Paused label ── */}
      {paused && total > 1 && (
        <div className="absolute top-4 left-5 z-20">
          <span className="text-[10px] text-white/35 font-mono tracking-widest uppercase">Paused</span>
        </div>
      )}
    </section>
  );
}
