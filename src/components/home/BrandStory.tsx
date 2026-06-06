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
                alt="Photography storytelling"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            {/* Floating quote card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-8 -right-8 bg-white p-6 rounded shadow-xl max-w-xs"
            >
              <p className="font-heading text-lg italic text-[#111827] leading-relaxed">
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

            <div className="mt-10 flex flex-wrap gap-4">
              {['PHOTO', 'CINE', 'REELS', 'EVENTS'].map((service) => (
                <span
                  key={service}
                  className="px-4 py-2 border border-white/20 text-white/50 text-xs tracking-widest uppercase hover:border-white/50 hover:text-white/80 transition-all cursor-default"
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
