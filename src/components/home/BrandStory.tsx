import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function BrandStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28 lg:py-36 bg-[#080808] relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px), radial-gradient(circle at 80% 50%, #ffffff 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=900&q=80"
                alt="Professional photography storytelling session — Candid Canvas BD"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            {/* Floating quote card — glass */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-4 right-2 sm:-bottom-8 sm:-right-8 p-5 sm:p-6 rounded-2xl max-w-[14rem] sm:max-w-xs"
              style={{
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(20px) saturate(160%)',
                WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.7)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,1)',
              }}
            >
              <p className="font-heading text-base sm:text-lg italic text-[#111827] leading-relaxed">
                "Photography is not about taking pictures."
              </p>
              <p className="text-xs text-[#6B7280] mt-2 tracking-wide">— Candid Canvas BD</p>
            </motion.div>
          </motion.div>

          {/* Right — Story */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="text-white"
          >
            <div className="mb-6">
              <span className="text-xs tracking-[0.4em] uppercase text-white/40 font-mono">Our Philosophy</span>
            </div>

            <h2 className="font-heading text-white leading-tight mb-8" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
              We Don't Take
              <br />
              <span className="italic text-white/70">Pictures. We</span>
              <br />
              Preserve Stories.
            </h2>

            <div className="space-y-5 text-white/60 text-base leading-relaxed font-body">
              <p>
                Photography is about preserving emotions, memories, relationships, and stories — the invisible threads that connect us to the moments that matter most.
              </p>
              <p>
                At Candid Canvas BD, we approach every session as storytellers first. We observe, we feel, and only then do we capture — because the best photographs are the ones that tell the truth of a moment.
              </p>
              <p>
                From intimate weddings to grand corporate events, from quiet birthday mornings to cinematic brand reels — every project receives the same devotion to craft and emotional depth.
              </p>
            </div>

          <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
              {['PHOTO', 'CINE', 'REELS', 'EVENTS'].map((service) => (
                <span
                  key={service}
                  className="px-3 sm:px-4 py-2 text-white/50 text-xs tracking-widest uppercase cursor-default transition-all hover:text-white/80 rounded-lg"
                  style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                >
                  {service}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
