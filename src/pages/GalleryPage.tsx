import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { GALLERY_CATEGORIES } from '../lib/utils';
import type { GalleryCategory } from '../types';

export default function GalleryPage() {
  const { gallery } = useSite();
  const [category, setCategory] = useState<GalleryCategory>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = category === 'all'
    ? gallery
    : gallery.filter(img => img.category.toLowerCase() === category.toLowerCase());

  const openLightbox = (id: string) => {
    const idx = filtered.findIndex(img => img.id === id);
    setLightbox(idx);
  };

  const prev = () => setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null);
  const next = () => setLightbox(i => i !== null ? (i + 1) % filtered.length : null);

  return (
    <>
      <Helmet>
        <title>Gallery — Candid Canvas BD</title>
        <meta name="description" content="Browse our portfolio of weddings, events, portraits and cinematic work." />
      </Helmet>

      {/* Header */}
      <div className="pt-32 pb-16 bg-[#F8F9FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="text-xs tracking-[0.4em] uppercase text-[#6B7280] font-mono">Our Work</span>
          <h1 className="font-heading text-[#111827] mt-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            The Gallery
          </h1>
          <p className="text-[#6B7280] mt-4 max-w-lg text-sm leading-relaxed">
            Stories captured, emotions preserved, moments made eternal.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value as GalleryCategory)}
              className={`px-4 py-2 text-xs tracking-widest uppercase font-mono rounded-sm transition-all duration-200 ${
                category === cat.value
                  ? 'bg-[#111827] text-white'
                  : 'border border-[#E5E7EB] text-[#6B7280] hover:border-[#374151] hover:text-[#111827]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="masonry-item group cursor-pointer rounded overflow-hidden relative"
                onClick={() => openLightbox(img.id)}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                  <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-medium">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-[#6B7280]">
            <p className="font-heading text-2xl">No images in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white/60 hover:text-white z-10" onClick={() => setLightbox(null)}>
              <X size={28} />
            </button>
            <button className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10"
              onClick={(e) => { e.stopPropagation(); prev(); }}>
              <ChevronLeft size={36} />
            </button>
            <button className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10"
              onClick={(e) => { e.stopPropagation(); next(); }}>
              <ChevronRight size={36} />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              src={filtered[lightbox].url}
              alt={filtered[lightbox].title}
              className="max-w-full max-h-[85vh] object-contain rounded"
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-white text-sm">{filtered[lightbox].title}</p>
              <p className="text-white/50 text-xs capitalize mt-1">{filtered[lightbox].category} • {lightbox + 1}/{filtered.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
