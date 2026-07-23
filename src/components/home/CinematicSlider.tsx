import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const SLIDE_DURATION = 4000;

interface ActiveSlide {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
}

// easing curve used throughout
const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

export default function CinematicSlider() {
  const { gallery, slider, siteLoading } = useSite();
  const reduceMotion = useReducedMotion();

  const activeSlides: ActiveSlide[] = (() => {
    const enabledSlider = slider.filter(s => s.enabled).sort((a, b) => a.order - b.order);
    if (enabledSlider.length > 0)
      return enabledSlider.map(s => ({ id: s.id, url: s.url, title: s.title, subtitle: s.subtitle }));
    if (gallery.length > 0)
      return gallery.map(g => ({ id: g.id, url: g.url, title: g.title, subtitle: g.category }));
    return [];
  })();

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = forward, -1 = backward
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

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent(p => (p + 1) % totalRef.current);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent(p => (p - 1 + totalRef.current) % totalRef.current);
  }, []);

  const goTo = useCallback((idx: number) => {
    setCurrent(prev => {
      setDirection(idx >= prev ? 1 : -1);
      return idx;
    });
  }, []);

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setDirection(1);
        setCurrent(p => (p + 1) % totalRef.current);
      }
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [total]);

  const touchStart = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
  };

  const padNum = (n: number) => String(n + 1).padStart(2, '0');
  const getSlide = (offset: number) =>
    activeSlides[((current + offset) % total + total) % total];

  // Direction-aware slide variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: reduceMotion ? 0 : dir * 60,
      opacity: 0,
      scale: reduceMotion ? 1 : 1.04,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: reduceMotion ? 0 : dir * -60,
      opacity: 0,
      scale: reduceMotion ? 1 : 0.96,
    }),
  };

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
      {/* ── Blurred background — crossfades with scale pop ── */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.04 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE_CINEMATIC }}
        >
          <img
            src={getSlide(0).url}
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            style={{ filter: 'blur(32px) brightness(0.2) saturate(0.5)' }}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle vignette on top of bg */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* ── Three-panel layout ── */}
      <div className="relative z-10 h-full flex items-center justify-center">

        {/* ── Prev peek ── */}
        {total > 1 && (
          <motion.div
            className="hidden sm:flex flex-shrink-0 items-center justify-end pr-3 cursor-pointer select-none"
            style={{ width: 'clamp(90px, 13vw, 190px)', height: 'clamp(300px, 62vh, 680px)' }}
            onClick={goPrev}
            whileHover={{ x: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`prev-${current}`}
                className="relative w-full h-full overflow-hidden rounded-xl"
                initial={{ opacity: 0, x: -20, scale: 0.85 }}
                animate={{ opacity: 0.38, x: 0, scale: 0.88 }}
                exit={{ opacity: 0, x: -20, scale: 0.82 }}
                transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
                style={{ filter: 'brightness(0.5) saturate(0.7)' }}
              >
                <img
                  src={getSlide(-1).url}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Center main slide ── */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              width: '100%',
              maxWidth: 'clamp(280px, 44vw, 700px)',
              height: 'clamp(340px, 72vh, 820px)',
              boxShadow:
                '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.08)',
            }}
          >
            <AnimatePresence initial={false} custom={direction} mode="sync">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.72, ease: EASE_CINEMATIC }}
                className="absolute inset-0"
              >
                {/* Ken Burns on the image itself */}
                <motion.img
                  src={getSlide(0).url}
                  alt={getSlide(0).title || 'Photography by Candid Canvas BD'}
                  className="w-full h-full object-cover object-center"
                  draggable={false}
                  loading="eager"
                  decoding="async"
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1.0 }}
                  transition={{ duration: SLIDE_DURATION / 1000 + 1, ease: 'linear' }}
                />

                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                {/* ── Slide text with stagger ── */}
                {(getSlide(0).title || getSlide(0).subtitle) && (
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-7">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
                      }}
                    >
                      {getSlide(0).subtitle && (
                        <motion.p
                          variants={{
                            hidden: { opacity: 0, y: 12 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_CINEMATIC } },
                          }}
                          className="text-white/50 text-[10px] tracking-[3px] uppercase font-mono mb-1.5"
                        >
                          {getSlide(0).subtitle}
                        </motion.p>
                      )}
                      {getSlide(0).title && (
                        <motion.h2
                          variants={{
                            hidden: { opacity: 0, y: 16 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_CINEMATIC } },
                          }}
                          className="font-heading text-xl sm:text-3xl text-white drop-shadow-lg leading-tight"
                        >
                          {getSlide(0).title}
                        </motion.h2>
                      )}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Next peek ── */}
        {total > 1 && (
          <motion.div
            className="hidden sm:flex flex-shrink-0 items-center justify-start pl-3 cursor-pointer select-none"
            style={{ width: 'clamp(90px, 13vw, 190px)', height: 'clamp(300px, 62vh, 680px)' }}
            onClick={goNext}
            whileHover={{ x: 6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`next-${current}`}
                className="relative w-full h-full overflow-hidden rounded-xl"
                initial={{ opacity: 0, x: 20, scale: 0.85 }}
                animate={{ opacity: 0.38, x: 0, scale: 0.88 }}
                exit={{ opacity: 0, x: 20, scale: 0.82 }}
                transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
                style={{ filter: 'brightness(0.5) saturate(0.7)' }}
              >
                <img
                  src={getSlide(1).url}
                  alt=""
                  aria-hidden
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Prev / Next arrow buttons ── */}
      {total > 1 && (
        <>
          <motion.button
            onClick={goPrev}
            aria-label="Previous slide"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.75)' }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            onClick={goNext}
            aria-label="Next slide"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.75)' }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white"
          >
            <ChevronRight size={20} />
          </motion.button>
        </>
      )}

      {/* ── Counter top-right — animates on change ── */}
      <div className="absolute top-4 right-5 sm:top-5 sm:right-7 z-20 font-mono">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={current}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: EASE_CINEMATIC }}
            className="text-white font-semibold text-base sm:text-lg leading-none inline-block"
          >
            {padNum(current)}
          </motion.span>
        </AnimatePresence>
        <span className="text-white/35 text-xs mx-0.5">/</span>
        <span className="text-white/35 text-xs">{String(total).padStart(2, '0')}</span>
      </div>

      {/* ── Dot indicators ── */}
      {total > 1 && total <= 20 && (
        <div className="absolute bottom-5 right-5 sm:right-7 z-20 flex items-center gap-1.5">
          {activeSlides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}>
              <motion.span
                animate={{
                  width: i === current ? 20 : 6,
                  backgroundColor: i === current ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.35)',
                }}
                transition={{ duration: 0.35, ease: EASE_CINEMATIC }}
                className="block rounded-full"
                style={{ height: 6 }}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Progress bar ── */}
      {total > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
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
      <AnimatePresence>
        {paused && total > 1 && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.25 }}
            className="absolute top-4 left-5 z-20"
          >
            <span className="text-[10px] text-white/35 font-mono tracking-widest uppercase">
              Paused
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
