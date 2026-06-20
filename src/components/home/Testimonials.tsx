import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function Testimonials() {
  const { reviews } = useSite();
  const approvedReviews = reviews.filter(r => r.approved);

  if (approvedReviews.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #F8F9FA 0%, #F0F4FF 50%, #F8F9FA 100%)' }}>
      {/* Subtle blobs */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(ellipse at 70% 20%, rgba(99,102,241,0.07) 0%, transparent 50%), radial-gradient(ellipse at 10% 80%, rgba(245,158,11,0.05) 0%, transparent 50%)',
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

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {approvedReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl p-5 sm:p-7 hover:shadow-xl transition-all duration-300 flex flex-col"
              style={{
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(18px) saturate(160%)',
                WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.65)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.85)',
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
                  <p className="text-xs text-[#9CA3AF]">{review.service}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
