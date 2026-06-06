import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, Camera } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function FeaturedGallery() {
  const { gallery, siteLoading } = useSite();
  const FEATURED = gallery.slice(0, 6);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setLightbox(i => i !== null ? (i - 1 + FEATURED.length) % FEATURED.length : null);
  const next = () => setLightbox(i => i !== null ? (i + 1) % FEATURED.length : null);

  return (
    <section ref={ref} className="py-20 sm:py-28 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 sm:mb-16"
        >
          <span className="text-xs tracking-[0.4em] uppercase text-[#9CA3AF] font-mono">Portfolio</span>
          <h2 className="font-heading text-[#111827] mt-3 text-4xl sm:text-5xl">Featured Work</h2>
          <p className="text-[#6B7280] mt-4 max-w-md mx-auto text-sm leading-relaxed">
            A glimpse into stories we've had the privilege of preserving.
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {siteLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}
                className="shimmer rounded-xl bg-[#F3F4F6]"
                style={{ aspectRatio: i === 0 || i === 3 ? '3/4' : '4/3' }}
              />
            ))}
          </div>
        ) : FEATURED.length === 0 ? (
          <div className="text-center py-20 bg-[#F8F9FA] rounded-2xl border-2 border-dashed border-[#E5E7EB]">
            <Camera size={40} className="text-[#D1D5DB] mx-auto mb-4" />
            <p className="text-[#374151] font-medium mb-1">Gallery Coming Soon</p>
            <p className="text-sm text-[#9CA3AF]">Check back soon for our latest work</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {FEATURED.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className={`relative group cursor-pointer rounded-xl overflow-hidden ${
                  i === 0 || i === 3 ? 'row-span-2' : ''
                }`}
                style={{ aspectRatio: i === 0 || i === 3 ? '3/4' : '4/3' }}
                onClick={() => setLightbox(i)}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  loading="lazy"
                  style={{ transform: 'scale(1)', transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <ZoomIn size={20} className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs sm:text-sm font-medium truncate">{img.title}</p>
                  <p className="text-white/60 text-[10px] sm:text-xs capitalize mt-0.5">{img.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#111827] text-[#111827] text-sm font-medium tracking-widest uppercase hover:bg-[#111827] hover:text-white transition-all duration-300 rounded-xl"
          >
            View Full Gallery
          </Link>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && FEATURED[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              onClick={() => setLightbox(null)}
            >
              <X size={20} />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              onClick={e => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              onClick={e => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={24} />
            </button>
            <motion.img
              key={lightbox}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.22 }}
              src={FEATURED[lightbox].url}
              alt={FEATURED[lightbox].title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-white font-medium">{FEATURED[lightbox].title}</p>
              <p className="text-white/50 text-sm capitalize mt-1">{FEATURED[lightbox].category}</p>
              <p className="text-white/30 text-xs mt-2">{lightbox + 1} / {FEATURED.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
