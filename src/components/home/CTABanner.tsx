import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTABanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"
          alt=""
          role="presentation"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,8,8,0.8) 0%, rgba(17,24,39,0.7) 100%)' }} />
        {/* Subtle color tint */}
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.3) 0%, transparent 60%)' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 sm:p-12"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <span className="text-xs tracking-[0.4em] uppercase text-white/40 font-mono">Begin Your Story</span>
          <h2 className="font-heading text-white mt-4 leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}>
            Your Story Deserves
            <br />
            <span className="italic text-white/70">to Be Told Beautifully.</span>
          </h2>
          <p className="text-white/50 mt-5 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Let us preserve the moments that define you. Book your session with Candid Canvas BD and experience storytelling photography at its finest.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/gallery"
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm tracking-wide transition-colors"
            >
              View our work <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
