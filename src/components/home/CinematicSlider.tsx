import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const SLIDE_DURATION = 3000;

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
      return enabledSlider.map(s => ({
        id: s.id,
        url: s.url,
        title: s.title,
        subtitle: s.subtitle,
      }));
    }
    if (gallery.length > 0) {
      return gallery.map(g => ({
        id: g.id,
        url: g.url,
        title: g.title,
        subtitle: g.category,
      }));
    }
    return [];
  })();

  const [current, setCurrent] = useState(0);
  // paused is ONLY true when the user is actively hovering
  const [paused, setPaused] = useState(false);
  const total = activeSlides.length;

  // Reset index when slide list changes
  useEffect(() => { setCurrent(0); }, [total]);

  // Preload next image
  useEffect(() => {
    if (total === 0) return;
    const nextIdx = (current + 1) % total;
    const img = new window.Image();
    img.src = activeSlides[nextIdx].url;
  }, [current, total]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback((idx: number, t: number) => {
    setCurrent(((idx % t) + t) % t);
  }, []);

  // ── Auto-advance using a ref-based interval so it never goes stale ──
  const currentRef = useRef(current);
  currentRef.current = current;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const totalRef = useRef(total);
  totalRef.current = total;

  useEffect(() => {
    if (total <= 1) return;

    const id = setInterval(() => {
      // Read live values via refs — no stale closure
      if (!pausedRef.current) {
        setCurrent(prev => (prev + 1) % totalRef.current);
      }
    }, SLIDE_DURATION);

    return () => clearInterval(id);
  }, [total]); // re-create only when total changes

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % totalRef.current);
  }, []);
  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + totalRef.current) % totalRef.current);
  }, []);

  // Touch swipe
  const touchStart = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  };

  if (siteLoading) {
    return (
      <div className="w-full bg-[#111827] shimmer" style={{ height: 'clamp(500px, 85vh, 100vh)' }} />
    );
  }

  if (total === 0) return null;

  const padNum = (n: number) => String(n + 1).padStart(2, '0');
  const slide = activeSlides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ height: 'clamp(500px, 85vh, 100vh)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured photography slider"
    >
      {/* ── Slides ── */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          {/* Ken Burns zoom */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.07 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 6, ease: 'linear' }}
          >
            <img
              src={slide.url}
              alt={slide.title || 'Photography by Candid Canvas BD'}
              className="w-full h-full object-cover object-center"
              draggable={false}
              loading="eager"
              decoding="async"
            />
          </motion.div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent pointer-events-none" />

          {/* Slide text */}
          {(slide.title || slide.subtitle) && (
            <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 lg:px-16 pb-14 sm:pb-18">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {slide.title && (
                  <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl text-white mb-1.5 drop-shadow-lg leading-tight">
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p className="text-white/65 text-xs sm:text-sm tracking-widest uppercase">
                    {slide.subtitle}
                  </p>
                )}
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Prev / Next ── */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* ── Counter top-right ── */}
      <div className="absolute top-4 right-5 sm:top-5 sm:right-7 z-20">
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-white font-semibold text-base sm:text-lg leading-none">{padNum(current)}</span>
          <span className="text-white/35 text-xs">/</span>
          <span className="text-white/35 text-xs">{padNum(total - 1)}</span>
        </div>
      </div>

      {/* ── Dot indicators ── */}
      {total > 1 && total <= 20 && (
        <div className="absolute bottom-4 right-5 sm:right-7 z-20 flex items-center gap-1.5">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, total)}
              aria-label={`Go to slide ${i + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-5 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
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
              className="h-full bg-white/50"
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
