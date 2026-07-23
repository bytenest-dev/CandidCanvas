import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const AUTO_MS  = 4500;
const EASE: [number,number,number,number] = [0.22, 1, 0.36, 1];

export default function Testimonials() {
  const { reviews } = useSite();
  const approved = reviews.filter(r => r.approved);

  const [cur, setCur]       = useState(0);
  const [dir, setDir]       = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const total = approved.length;

  const tRef = useRef(total);   tRef.current   = total;
  const pRef = useRef(paused);  pRef.current   = paused;

  const goNext = useCallback(() => { setDir(1);  setCur(p => (p + 1) % tRef.current); }, []);
  const goPrev = useCallback(() => { setDir(-1); setCur(p => (p - 1 + tRef.current) % tRef.current); }, []);
  const goTo   = useCallback((i: number) => { setDir(i >= cur ? 1 : -1); setCur(i); }, [cur]);

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => { if (!pRef.current) { setDir(1); setCur(p => (p + 1) % tRef.current); } }, AUTO_MS);
    return () => clearInterval(id);
  }, [total]);

  const tx = useRef(0);
  const onTS = (e: React.TouchEvent) => { tx.current = e.touches[0].clientX; };
  const onTE = (e: React.TouchEvent) => {
    const d = tx.current - e.changedTouches[0].clientX;
    if (Math.abs(d) > 48) d > 0 ? goNext() : goPrev();
  };

  const at = (offset: number) => approved[((cur + offset) % total + total) % total];

  if (total === 0) return null;

  return (
    <section
      className="py-16 sm:py-24 overflow-hidden relative"
      style={{ background: 'linear-gradient(160deg, #F8F9FA 0%, #EEF2FF 50%, #F8F9FA 100%)' }}
    >
      {/* background blobs */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:
          'radial-gradient(ellipse at 70% 20%, rgba(99,102,241,0.07) 0%, transparent 50%), radial-gradient(ellipse at 10% 80%, rgba(245,158,11,0.05) 0%, transparent 50%)',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[3px] uppercase text-[#9CA3AF] mb-4">
            <span className="w-4 h-px bg-[#C8102E] opacity-60" />
            Client Stories
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-[#111827] mb-3">What Our Clients Say</h2>
          <p className="text-[#6B7280] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Real stories from real people — moments captured, memories preserved forever.
          </p>
        </motion.div>

        {/* ── Carousel stage ── */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTS}
          onTouchEnd={onTE}
        >
          {/*
            Three-column grid — side cards are fixed 260px wide on lg,
            center takes remaining space. overflow-hidden on parent clips everything.
          */}
          <div className="flex items-stretch justify-center gap-4 overflow-hidden">

            {/* LEFT peek */}
            {total > 1 && (
              <div
                className="hidden lg:block flex-shrink-0 cursor-pointer self-center"
                style={{ width: 260 }}
                onClick={goPrev}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={`lp-${cur}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1,  x: 0  }}
                    exit={{   opacity: 0,  x: -20 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <ReviewCard review={at(-1)} variant="side" />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* CENTER active card */}
            <div className="flex-1 min-w-0" style={{ maxWidth: 520 }}>
              <AnimatePresence custom={dir} mode="wait" initial={false}>
                <motion.div
                  key={cur}
                  custom={dir}
                  initial={(d: number) => ({ opacity: 0, x: d * 50, scale: 0.97 })}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={(d: number)   => ({ opacity: 0, x: d * -50, scale: 0.97 })}
                  transition={{ duration: 0.48, ease: EASE }}
                >
                  <ReviewCard review={at(0)} variant="active" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT peek */}
            {total > 1 && (
              <div
                className="hidden lg:block flex-shrink-0 cursor-pointer self-center"
                style={{ width: 260 }}
                onClick={goNext}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={`rp-${cur}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1,  x: 0 }}
                    exit={{   opacity: 0,  x: 20 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <ReviewCard review={at(1)} variant="side" />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* ── Controls ── */}
        {total > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={goPrev}
              aria-label="Previous review"
              className="w-9 h-9 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] flex items-center justify-center text-[#374151] transition-colors shadow-sm"
            >
              <ChevronLeft size={15} />
            </button>

            <div className="flex items-center gap-2">
              {approved.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} aria-label={`Review ${i + 1}`}>
                  <motion.span
                    animate={{
                      width:           i === cur ? 20 : 7,
                      backgroundColor: i === cur ? '#111827' : '#D1D5DB',
                    }}
                    transition={{ duration: 0.32, ease: EASE }}
                    className="block rounded-full"
                    style={{ height: 7 }}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={goNext}
              aria-label="Next review"
              className="w-9 h-9 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] flex items-center justify-center text-[#374151] transition-colors shadow-sm"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Card ── */
type Variant = 'active' | 'side';

interface CardProps {
  review: { name: string; comment: string; rating: number; service?: string };
  variant: Variant;
}

function ReviewCard({ review, variant }: CardProps) {
  const isActive = variant === 'active';

  return (
    <div
      className="rounded-2xl flex flex-col transition-all duration-300"
      style={{
        padding:        isActive ? '28px 28px' : '20px 20px',
        background:     isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border:    isActive ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.5)',
        boxShadow: isActive
          ? '0 12px 48px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1)'
          : '0 4px 16px rgba(0,0,0,0.04)',
        opacity:   isActive ? 1 : 0.52,
        transform: isActive ? 'scale(1)' : 'scale(0.94)',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <Quote
        size={isActive ? 28 : 20}
        className="flex-shrink-0 mb-3"
        style={{ color: isActive ? '#E5E7EB' : '#D1D5DB' }}
      />

      <p
        className="italic flex-1 mb-4 leading-relaxed"
        style={{
          color:    isActive ? '#374151' : '#6B7280',
          fontSize: isActive ? '14px'   : '12px',
        }}
      >
        "{review.comment}"
      </p>

      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star
            key={j}
            size={isActive ? 14 : 11}
            className={j < review.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#E5E7EB]'}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-[#F3F4F6]">
        <div
          className="rounded-full bg-[#111827] flex items-center justify-center text-white font-bold flex-shrink-0"
          style={{ width: isActive ? 40 : 32, height: isActive ? 40 : 32, fontSize: isActive ? 14 : 11 }}
        >
          {review.name[0]?.toUpperCase()}
        </div>
        <div>
          <p style={{ fontSize: isActive ? '14px' : '11px' }} className="font-semibold text-[#111827]">
            {review.name}
          </p>
          {review.service && (
            <p style={{ fontSize: isActive ? '11px' : '10px' }} className="text-[#9CA3AF]">
              {review.service}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
