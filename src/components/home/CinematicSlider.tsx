import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const SLIDE_DURATION = 5000;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
// Side card width as a fraction of total section width — kept intentionally small
// so they never push outside the viewport.
const SIDE_W = 140; // px — fixed, predictable, won't overflow

interface Slide { id: string; url: string; title: string; subtitle?: string }

export default function CinematicSlider() {
  const { gallery, slider, siteLoading } = useSite();
  const rm = useReducedMotion();

  const slides: Slide[] = (() => {
    const en = slider.filter(s => s.enabled).sort((a, b) => a.order - b.order);
    if (en.length > 0) return en.map(s => ({ id: s.id, url: s.url, title: s.title, subtitle: s.subtitle }));
    return gallery.map(g => ({ id: g.id, url: g.url, title: g.title, subtitle: g.category }));
  })();

  const [cur, setCur]       = useState(0);
  const [dir, setDir]       = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  useEffect(() => { setCur(0); }, [n]);

  // Preload ±1
  useEffect(() => {
    if (n < 2) return;
    [-1, 1].forEach(d => {
      const i = new window.Image();
      i.src = slides[((cur + d) % n + n) % n].url;
    });
  }, [cur, n]); // eslint-disable-line

  const nRef = useRef(n); nRef.current = n;
  const pRef = useRef(paused); pRef.current = paused;

  const goNext = useCallback(() => { setDir(1);  setCur(p => (p + 1) % nRef.current); }, []);
  const goPrev = useCallback(() => { setDir(-1); setCur(p => (p - 1 + nRef.current) % nRef.current); }, []);
  const goTo   = useCallback((i: number) => {
    setCur(p => { setDir(i >= p ? 1 : -1); return i; });
  }, []);

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => {
      if (!pRef.current) { setDir(1); setCur(p => (p + 1) % nRef.current); }
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [n]);

  const tx = useRef(0);
  const onTS = (e: React.TouchEvent) => { tx.current = e.touches[0].clientX; };
  const onTE = (e: React.TouchEvent) => {
    const d = tx.current - e.changedTouches[0].clientX;
    if (Math.abs(d) > 48) d > 0 ? goNext() : goPrev();
  };

  const at  = (offset: number) => slides[((cur + offset) % n + n) % n];
  const pad = (x: number)      => String(x + 1).padStart(2, '0');

  const centerVariants = {
    enter:  (d: number) => ({ x: rm ? 0 : d * 60,  opacity: 0, scale: rm ? 1 : 1.03 }),
    show:                  ({ x: 0, opacity: 1, scale: 1 }),
    exit:   (d: number) => ({ x: rm ? 0 : d * -60, opacity: 0, scale: rm ? 1 : 0.97 }),
  };

  if (siteLoading) return <div className="w-full bg-[#0c0c0c] shimmer" style={{ minHeight: '75vh' }} />;
  if (n === 0) return null;

  return (
    <section
      className="relative w-full select-none overflow-hidden"
      style={{ height: 'clamp(480px, 88vh, 960px)', background: '#0c0c0c' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTS}
      onTouchEnd={onTE}
      aria-label="Featured photography slider"
    >
      {/* ── Atmospheric blurred bg ── */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`bg-${cur}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1,  scale: 1.03 }}
          exit={{   opacity: 0,  scale: 1.0  }}
          transition={{ duration: 1.3, ease: EASE }}
        >
          <img
            src={at(0).url} alt="" aria-hidden draggable={false}
            className="w-full h-full object-cover"
            style={{ filter: 'blur(36px) brightness(0.16) saturate(0.4)' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 18%, rgba(0,0,0,0.68) 100%)' }}
      />
      {/* Top fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-20 z-[1]"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)' }}
      />

      {/* ── Three-panel layout — contained perfectly ── */}
      {/*
        Layout: [side-L | center | side-R]
        • side panels are fixed SIDE_W px wide on sm+, hidden on mobile
        • center is flex-1 — takes remaining space
        • overflow-hidden on section clips everything cleanly
      */}
      <div className="relative z-10 h-full w-full flex items-center">

        {/* LEFT peek — fixed width, full height, clips internally */}
        {n > 1 && (
          <div
            className="hidden sm:flex flex-shrink-0 items-center justify-end cursor-pointer"
            style={{ width: SIDE_W, height: '100%' }}
            onClick={goPrev}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`prev-${cur}`}
                className="relative overflow-hidden cursor-pointer"
                style={{
                  width:  SIDE_W - 12,   // slight inset from edge
                  height: 'clamp(280px, 62vh, 680px)',
                  borderRadius: '0 14px 14px 0',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1,  x: 0   }}
                exit={{   opacity: 0,  x: -20  }}
                transition={{ duration: 0.55, ease: EASE }}
                whileHover={{ opacity: 0.6 }}
              >
                <img
                  src={at(-1).url} alt="" aria-hidden draggable={false}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.38) saturate(0.6)', transform: 'scale(1.05)' }}
                />
                {/* right-edge fade toward center */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to left, rgba(12,12,12,0.85) 0%, transparent 55%)' }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* CENTER — flex-1 takes all remaining space */}
        <div className="flex-1 flex items-center justify-center px-3 sm:px-4 h-full">
          <div
            className="relative overflow-hidden flex-shrink-0"
            style={{
              width:        '100%',
              maxWidth:     'clamp(260px, 46vw, 680px)',
              height:       'clamp(340px, 76vh, 840px)',
              borderRadius: 18,
              boxShadow:    '0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.9)',
            }}
          >
            <AnimatePresence custom={dir} mode="sync" initial={false}>
              <motion.div
                key={cur}
                custom={dir}
                variants={centerVariants}
                initial="enter"
                animate="show"
                exit="exit"
                transition={{ duration: 0.75, ease: EASE }}
                className="absolute inset-0"
              >
                {/* Ken Burns */}
                <motion.img
                  src={at(0).url}
                  alt={at(0).title || 'Candid Canvas BD'}
                  className="w-full h-full object-cover object-center"
                  draggable={false} loading="eager" decoding="async"
                  initial={{ scale: rm ? 1 : 1.07 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: (SLIDE_DURATION / 1000) + 2, ease: 'linear' }}
                />

                {/* Rich bottom gradient */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 38%, transparent 65%)' }}
                />

                {/* Caption */}
                {(at(0).title || at(0).subtitle) && (
                  <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
                    <motion.div
                      initial="off" animate="on"
                      variants={{ off: {}, on: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } } }}
                    >
                      {at(0).subtitle && (
                        <motion.p
                          variants={{
                            off: { opacity: 0, y: 10 },
                            on:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                          }}
                          className="font-mono text-[9px] tracking-[4px] uppercase text-white/45 mb-2"
                        >
                          — {at(0).subtitle}
                        </motion.p>
                      )}
                      {at(0).title && (
                        <motion.h2
                          variants={{
                            off: { opacity: 0, y: 14 },
                            on:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                          }}
                          className="font-heading text-xl sm:text-[2rem] leading-none text-white"
                          style={{ textShadow: '0 2px 18px rgba(0,0,0,0.55)' }}
                        >
                          {at(0).title}
                        </motion.h2>
                      )}
                    </motion.div>
                  </div>
                )}

                {/* Inner rim */}
                <div className="absolute inset-0 pointer-events-none rounded-[18px]"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)' }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT peek — mirror of left */}
        {n > 1 && (
          <div
            className="hidden sm:flex flex-shrink-0 items-center justify-start cursor-pointer"
            style={{ width: SIDE_W, height: '100%' }}
            onClick={goNext}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`next-${cur}`}
                className="relative overflow-hidden cursor-pointer"
                style={{
                  width:  SIDE_W - 12,
                  height: 'clamp(280px, 62vh, 680px)',
                  borderRadius: '14px 0 0 14px',
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1,  x: 0  }}
                exit={{   opacity: 0,  x: 20  }}
                transition={{ duration: 0.55, ease: EASE }}
                whileHover={{ opacity: 0.6 }}
              >
                <img
                  src={at(1).url} alt="" aria-hidden draggable={false}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.38) saturate(0.6)', transform: 'scale(1.05)' }}
                />
                {/* left-edge fade toward center */}
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to right, rgba(12,12,12,0.85) 0%, transparent 55%)' }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Nav arrows — inside section, z-30 ── */}
      {n > 1 && (
        <>
          <NavArrow side="left"  onClick={goPrev} />
          <NavArrow side="right" onClick={goNext} />
        </>
      )}

      {/* ── Paused pill ── */}
      <AnimatePresence>
        {paused && n > 1 && (
          <motion.div
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-5 left-5 z-30 flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <span className="flex gap-[3px]">
              <span className="block w-[2px] h-[10px] rounded-full bg-white/55" />
              <span className="block w-[2px] h-[10px] rounded-full bg-white/55" />
            </span>
            <span className="font-mono text-[9px] tracking-[2.5px] uppercase text-white/45">Paused</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Counter top-right ── */}
      <div className="absolute top-5 right-5 z-30 font-mono flex items-baseline gap-[3px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={cur}
            initial={{ opacity: 0, y: -7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 7 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="text-white text-base sm:text-lg font-semibold leading-none tabular-nums inline-block"
          >
            {pad(cur)}
          </motion.span>
        </AnimatePresence>
        <span className="text-white/25 text-xs">/</span>
        <span className="text-white/25 text-xs tabular-nums">{String(n).padStart(2, '0')}</span>
      </div>

      {/* ── Dot indicators bottom-right ── */}
      {n > 1 && n <= 24 && (
        <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} className="p-1">
              <motion.span
                animate={{
                  width:           i === cur ? 20 : 6,
                  backgroundColor: i === cur ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)',
                }}
                transition={{ duration: 0.35, ease: EASE }}
                className="block rounded-full"
                style={{ height: 3 }}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Progress bar ── */}
      {n > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] z-30"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          {!paused && (
            <motion.div
              key={`p-${cur}`}
              className="h-full"
              style={{ background: 'linear-gradient(to right, rgba(200,16,46,0.85), rgba(255,255,255,0.65))' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
            />
          )}
        </div>
      )}
    </section>
  );
}

/* ── Nav Arrow ── */
function NavArrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const isLeft = side === 'left';
  return (
    <motion.button
      onClick={onClick}
      aria-label={isLeft ? 'Previous' : 'Next'}
      className="absolute z-30 top-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{
        [isLeft ? 'left' : 'right']: 12,
        width: 42, height: 42,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'rgba(255,255,255,0.75)',
      }}
      whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.17)', color: 'rgba(255,255,255,1)' }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      {isLeft ? <ChevronLeft size={17} strokeWidth={1.8} /> : <ChevronRight size={17} strokeWidth={1.8} />}
    </motion.button>
  );
}
