import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const AUTO_SCROLL_MS = 4000;

export default function Testimonials() {
  const { reviews } = useSite();
  const approvedReviews = reviews.filter(r => r.approved);

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = approvedReviews.length;

  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const totalRef = useRef(total);
  totalRef.current = total;

  const next = useCallback(() => setCurrent(p => (p + 1) % totalRef.current), []);
  const prev = useCallback(() => setCurrent(p => (p - 1 + totalRef.current) % totalRef.current), []);

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setCurrent(p => (p + 1) % totalRef.current);
    }, AUTO_SCROLL_MS);
    return () => clearInterval(id);
  }, [total]);

  // Touch support
  const touchStart = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  if (total === 0) return null;

  const getReview = (offset: number) =>
    approvedReviews[((current + offset) % total + total) % total];

  return (
    <section
      className="py-16 sm:py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #F8F9FA 0%, #F0F4FF 50%, #F8F9FA 100%)' }}
    >
      {/* Subtle blobs */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:
          'radial-gradient(ellipse at 70% 20%, rgba(99,102,241,0.07) 0%, transparent 50%), radial-gradient(ellipse at 10% 80%, rgba(245,158,11,0.05) 0%, transparent 50%)',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-[3px] uppercase text-[#9CA3AF] mb-4">
            Client Stories
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-[#111827] mb-4">What Our Clients Say</h2>
          <p className="text-[#6B7280] text-sm sm:text-base max-w-xl mx-auto">
            Real stories from real people — moments captured, memories preserved forever.
          </p>
        </motion.div>

        {/* ── Carousel ── */}
        <div
          className="relative flex items-stretch justify-center gap-4 sm:gap-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Prev card peek */}
          {total > 1 && (
            <div
              className="hidden md:flex flex-shrink-0 items-center cursor-pointer"
              style={{ width: 'clamp(180px, 22vw, 300px)' }}
              onClick={prev}
              aria-label="Previous review"
            >
              <ReviewCard review={getReview(-1)} dim />
            </div>
          )}

          {/* Center active card */}
          <div
            className="flex-1 flex items-stretch"
            style={{ maxWidth: 'clamp(280px, 38vw, 500px)', minWidth: 0 }}
          >
            <ReviewCard review={getReview(0)} key={current} active />
          </div>

          {/* Next card peek */}
          {total > 1 && (
            <div
              className="hidden md:flex flex-shrink-0 items-center cursor-pointer"
              style={{ width: 'clamp(180px, 22vw, 300px)' }}
              onClick={next}
              aria-label="Next review"
            >
              <ReviewCard review={getReview(1)} dim />
            </div>
          )}
        </div>

        {/* ── Controls ── */}
        {total > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="w-9 h-9 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] flex items-center justify-center text-[#374151] transition-colors shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {approvedReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to review ${i + 1}`}
                >
                  <span className={`block rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-5 h-2 bg-[#111827]'
                      : 'w-2 h-2 bg-[#D1D5DB] hover:bg-[#9CA3AF]'
                  }`} />
                </button>
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next review"
              className="w-9 h-9 rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] flex items-center justify-center text-[#374151] transition-colors shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Single review card ── */
interface CardProps {
  review: { name: string; comment: string; rating: number; service?: string };
  active?: boolean;
  dim?: boolean;
}

function ReviewCard({ review, active, dim }: CardProps) {
  return (
    <motion.div
      initial={active ? { opacity: 0, scale: 0.96 } : false}
      animate={{ opacity: dim ? 0.45 : 1, scale: dim ? 0.93 : 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full rounded-2xl p-5 sm:p-7 flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.7)',
        boxShadow: active
          ? '0 8px 40px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)'
          : '0 4px 16px rgba(0,0,0,0.05)',
        pointerEvents: dim ? 'none' : undefined,
      }}
    >
      {/* Quote icon */}
      <Quote size={26} className="text-[#E5E7EB] mb-4 flex-shrink-0" />

      {/* Comment */}
      <p className="text-[#374151] text-sm leading-relaxed flex-1 mb-5 italic">
        "{review.comment}"
      </p>

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star
            key={j}
            size={14}
            className={j < review.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#E5E7EB]'}
          />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#F3F4F6]">
        <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {review.name[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#111827]">{review.name}</p>
          {review.service && (
            <p className="text-xs text-[#9CA3AF]">{review.service}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
