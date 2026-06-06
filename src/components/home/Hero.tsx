import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroCanvas from './HeroCanvas';
import logoImg from '../../assets/logo.png';

const SERVICES = ['PHOTO', 'CINE', 'REELS', 'EVENTS'];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Three.js light canvas */}
      <HeroCanvas />

      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Service tags */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex items-center justify-center gap-3 mb-8 flex-wrap"
        >
          {SERVICES.map((s, i) => (
            <span key={s} className="flex items-center gap-3">
              <span
                className="font-mono uppercase font-semibold"
                style={{ color: '#374151', fontSize: '11px', letterSpacing: '0.35em' }}
              >
                {s}
              </span>
              {i < SERVICES.length - 1 && (
                <span style={{ color: '#6B7280', fontSize: '10px', fontWeight: 600 }}>•</span>
              )}
            </span>
          ))}
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-6"
        >
          {/* Visually-hidden h1 for SEO — screen readers & Google see this */}
          <h1 className="sr-only">Candid Canvas BD — Premium Photography &amp; Cinematography in Bangladesh</h1>
          <img
            src={logoImg}
            alt="Candid Canvas BD — Premium Photography & Cinematography"
            className="h-32 md:h-44 w-auto object-contain drop-shadow-lg"
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="hero-tagline mb-10"
        >
          Preserving Special Moments
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="w-16 h-px bg-[#9CA3AF] mx-auto mb-10"
        />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/gallery" className="btn-primary">
            Explore Gallery
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
