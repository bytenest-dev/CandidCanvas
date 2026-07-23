import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const SLIDE_DURATION = 5000;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
    [-1, 1].forEach(d => { const i = new window.Image(); i.src = slides[((cur + d) % n + n) % n].url; });
  }, [cur, n]); // eslint-disable-line

  const nRef = useRef(n); nRef.current = n;
  const pRef = useRef(paused); pRef.current = paused;

  const goNext = useCallback(() => { setDir(1);  setCur(p => (p + 1) % nRef.current); }, []);
  const goPrev = useCallback(() => { setDir(-1); setCur(p => (p - 1 + nRef.current) % nRef.current); }, []);
  const goTo   = useCallback((i: number) => { setCur(p => { setDir(i >= p ? 1 : -1); return i; }); }, []);

  useEffect(() => {
    if (n <= 1) return;
    const id = setInterval(() => { if (!pRef.current) { setDir(1); setCur(p => (p + 1) % nRef.current); } }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [n]);

  const tx = useRef(0);
  const onTS = (e: React.TouchEvent) => { tx.current = e.touches[0].clientX; };
  const onTE = (e: React.TouchEvent) => { const d = tx.current - e.changedTouches[0].clientX; if (Math.abs(d) > 48) d > 0 ? goNext() : goPrev(); };

  const at   = (offset: number) => slides[((cur + offset) % n + n) % n];
  const pad  = (x: number)      => String(x + 1).padStart(2, '0');

  const centerVariants = {
    enter:  (d: number) => ({ x: rm ? 0 : d * 80,  opacity: 0, scale: rm ? 1 : 1.03 }),
    show:                  ({ x: 0,                  opacity: 1, scale: 1 }),
    exit:   (d: number) => ({ x: rm ? 0 : d * -80, opacity: 0, scale: rm ? 1 : 0.97 }),
  };

  if (siteLoading) return <div className="w-full bg-[#0c0c0c] shimmer" style={{ minHeight: '75vh' }} />;
  if (n === 0) return null;

  return (
    <section
      className="relative w-full select-none overflow-hidden"
      style={{ height: 'clamp(520px, 90vh, 1020px)', background: '#0c0c0c' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTS}
      onTouchEnd={onTE}
      aria-label="Featured photography slider"
    >

      {/* ════════════════════════════════════
          LAYER 0 — Atmospheric blurred bg
      ════════════════════════════════════ */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={`bg-${cur}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1,  scale: 1.04 }}
          exit={{   opacity: 0,  scale: 1.0 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <img
            src={at(0).url} alt="" aria-hidden draggable={false}
            className="w-full h-full object-cover"
            style={{ filter: 'blur(36px) brightness(0.16) saturate(0.45)' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Depth vignette */}
      <div className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.65) 100%)' }}
      />
      {/* Top fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 z-[1]"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)' }}
      />

      {/* ════════════════════════════════════
          LAYER 1 — Three-panel stage
      ════════════════════════════════════ */}
      <div className="relative z-10 h-full flex items-center justify-center px-0">

        {/* ── LEFT PEEK ── */}
        {n > 1 && (
          <SidePeek
            url={at(-1).url}
            side="left"
            onClick={goPrev}
            slideKey={`prev-${cur}`}
          />
        )}

        {/* ── CENTER CARD ── */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="relative overflow-hidden"
            style={{
              width:     'clamp(260px, 42vw, 680px)',
              height:    'clamp(370px, 74vh, 860px)',
              borderRadius: 20,
              boxShadow: '0 0 0 1px rgba(255,255,255,0.09), 0 50px 120px rgba(0,0,0,0.9), 0 20px 40px rgba(0,0,0,0.6)',
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
                transition={{ duration: 0.8, ease: EASE }}
                className="absolute inset-0"
              >
                {/* Ken Burns */}
                <motion.img
                  src={at(0).url}
                  alt={at(0).title || 'Candid Canvas BD'}
                  className="w-full h-full object-cover object-center"
                  draggable={false} loading="eager" decoding="async"
                  initial={{ scale: rm ? 1 : 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: (SLIDE_DURATION / 1000) + 1.5, ease: 'linear' }}
                />

                {/* Rich gradient overlay */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0.05) 60%, transparent 100%)' }}
                />
                {/* Subtle left edge shadow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, transparent 30%)' }}
                />

                {/* ── Slide caption ── */}
                {(at(0).title || at(0).subtitle) && (
                  <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
                    <motion.div
                      initial="off"
                      animate="on"
                      variants={{ off: {}, on: { transition: { staggerChildren: 0.1, delayChildren: 0.38 } } }}
                    >
                      {at(0).subtitle && (
                        <motion.p
                          variants={{
                            off: { opacity: 0, y: 10 },
                            on:  { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
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
                            on:  { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
                          }}
                          className="font-heading text-2xl sm:text-[2.1rem] leading-none text-white"
                          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
                        >
                          {at(0).title}
                        </motion.h2>
                      )}
                    </motion.div>
                  </div>
                )}

                {/* Inner border rim */}
                <div className="absolute inset-0 pointer-events-none rounded-[20px]"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT PEEK ── */}
        {n > 1 && (
          <SidePeek
            url={at(1).url}
            side="right"
            onClick={goNext}
            slideKey={`next-${cur}`}
          />
        )}
      </div>

      {/* ════════════════════════════════════
          LAYER 2 — Controls overlay
      ════════════════════════════════════ */}

      {/* Arrow buttons — sit outside the 3-panel, hug the sides */}
      {n > 1 && (
        <>
          <NavArrow dir="left"  onClick={goPrev} />
          <NavArrow dir="right" onClick={goNext} />
        </>
      )}

      {/* ── Top-left brand tag / paused pill ── */}
      <div className="absolute top-5 left-6 z-30 flex items-center gap-3">
        <AnimatePresence>
          {paused && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{   opacity: 0, x: -8 }}
              transition={{ duration: 0.22 }}
              className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {/* Two pause bars */}
              <span className="flex gap-[3px]">
                <span className="block w-[2px] h-[10px] rounded-full bg-white/60" />
                <span className="block w-[2px] h-[10px] rounded-full bg-white/60" />
              </span>
              <span className="font-mono text-[9px] tracking-[2.5px] uppercase text-white/50">Paused</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Top-right counter ── */}
      <div className="absolute top-5 right-6 z-30">
        <div className="flex items-baseline gap-[3px] font-mono">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={cur}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{   opacity: 0, y:  8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="text-white text-lg font-semibold leading-none tabular-nums inline-block"
            >
              {pad(cur)}
            </motion.span>
          </AnimatePresence>
          <span className="text-white/25 text-sm leading-none">/</span>
          <span className="text-white/25 text-sm leading-none tabular-nums">{String(n).padStart(2, '0')}</span>
        </div>
      </div>

      {/* ── Bottom-right dots ── */}
      {n > 1 && n <= 24 && (
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} className="group p-1">
              <motion.span
                animate={{
                  width:           i === cur ? 22 : 7,
                  height:          i === cur ? 3  : 3,
                  backgroundColor: i === cur ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.28)',
                }}
                transition={{ duration: 0.38, ease: EASE }}
                className="block rounded-full group-hover:bg-white/60"
                style={{ display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Bottom progress line ── */}
      {n > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] z-30" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {!paused && (
            <motion.div
              key={`p-${cur}`}
              className="h-full"
              style={{ background: 'linear-gradient(to right, rgba(200,16,46,0.9), rgba(255,255,255,0.7))' }}
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

/* ─────────────────────────────────────────────────
   Side peek card — prev or next
───────────────────────────────────────────────── */
function SidePeek({
  url, side, onClick, slideKey,
}: {
  url: string;
  side: 'left' | 'right';
  onClick: () => void;
  slideKey: string;
}) {
  const isLeft = side === 'left';
  return (
    <motion.div
      className="hidden sm:flex flex-shrink-0 items-center cursor-pointer"
      style={{
        width:   'clamp(88px, 12vw, 180px)',
        height:  'clamp(320px, 64vh, 720px)',
        justifyContent: isLeft ? 'flex-end'  : 'flex-start',
        paddingRight:   isLeft ? '10px'      : '0',
        paddingLeft:    isLeft ? '0'         : '10px',
      }}
      onClick={onClick}
      whileHover={{ x: isLeft ? -5 : 5 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={slideKey}
          className="relative overflow-hidden"
          style={{ width: '100%', height: '100%', borderRadius: 14 }}
          initial={{ opacity: 0, x: isLeft ? -24 : 24, scale: 0.84 }}
          animate={{ opacity: 1,  x: 0,                 scale: 0.9  }}
          exit={{   opacity: 0,  x: isLeft ? -24 : 24, scale: 0.84 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={url} alt="" aria-hidden draggable={false}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.42) saturate(0.65)' }}
          />
          {/* Gradient edge fade toward center */}
          <div
            className="absolute inset-0"
            style={{
              background: isLeft
                ? 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, transparent 60%)'
                : 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 60%)',
            }}
          />
          {/* Hover hint glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(255,255,255,0)', borderRadius: 14 }}
            whileHover={{ background: 'rgba(255,255,255,0.05)' }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────
   Navigation arrow button
───────────────────────────────────────────────── */
function NavArrow({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) {
  const isLeft = dir === 'left';
  return (
    <motion.button
      onClick={onClick}
      aria-label={isLeft ? 'Previous slide' : 'Next slide'}
      className="absolute z-30 top-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{
        [isLeft ? 'left' : 'right']: 'clamp(10px, 1.5vw, 24px)',
        width:  44,
        height: 44,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.14)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'rgba(255,255,255,0.8)',
      }}
      whileHover={{
        scale: 1.12,
        background: 'rgba(255,255,255,0.16)',
        borderColor: 'rgba(255,255,255,0.32)',
        color: 'rgba(255,255,255,1)',
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      {isLeft ? <ChevronLeft size={18} strokeWidth={1.8} /> : <ChevronRight size={18} strokeWidth={1.8} />}
    </motion.button>
  );
}
