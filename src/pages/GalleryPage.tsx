import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function GalleryPage() {
  const { gallery, galleryCategories } = useSite();
  const [category, setCategory] = useState<string>('all');
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
        <title>Photography Portfolio | Candid Canvas BD Gallery | Bangladesh</title>
        <meta name="description" content="Browse Candid Canvas BD's photography portfolio — stunning wedding photography, birthday sessions, corporate events, festivals, outdoor portraits and cinematic sessions across Bangladesh. 500+ moments preserved." />
        <meta name="keywords" content="candid canvas bd gallery, candid canvas portfolio, wedding photography portfolio bangladesh, photography gallery bogura, event photography portfolio bangladesh, candid photos bangladesh, cinematography portfolio bangladesh, best photography portfolio bangladesh, candid canvas bd photos, wedding photos bangladesh" />
        <link rel="canonical" href="https://www.candidcanvas.pro.bd/gallery" />
        <meta name="robots" content="index, follow, max-image-preview:large" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Candid Canvas BD" />
        <meta property="og:title" content="Photography Portfolio &amp; Gallery | Candid Canvas BD Bangladesh" />
        <meta property="og:description" content="Browse Candid Canvas BD's stunning photography portfolio — weddings, events, outdoor & cinematic sessions across Bangladesh. 500+ beautiful moments." />
        <meta property="og:url" content="https://www.candidcanvas.pro.bd/gallery" />
        <meta property="og:image" content="https://www.candidcanvas.pro.bd/logo.png" />
        <meta property="og:image:alt" content="Candid Canvas BD Photography Gallery Bangladesh" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Candid Canvas BD Photography Gallery | Bangladesh" />
        <meta name="twitter:description" content="500+ stunning moments — wedding, events, outdoor & cinematic photography by Candid Canvas BD, Bangladesh." />
        <meta name="twitter:image" content="https://www.candidcanvas.pro.bd/logo.png" />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Candid Canvas BD Photography Portfolio & Gallery",
          "description": "Wedding, event, and cinematic photography portfolio by Candid Canvas BD, Bangladesh.",
          "url": "https://www.candidcanvas.pro.bd/gallery",
          "isPartOf": { "@id": "https://www.candidcanvas.pro.bd/#website" },
          "about": { "@id": "https://www.candidcanvas.pro.bd/#business" },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.candidcanvas.pro.bd/" },
              { "@type": "ListItem", "position": 2, "name": "Gallery", "item": "https://www.candidcanvas.pro.bd/gallery" }
            ]
          }
        })}</script>
      </Helmet>

      {/* Header */}
      <div className="pt-28 sm:pt-32 pb-10 sm:pb-16 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #F8F9FA 0%, #EEF2FF 60%, #F8F9FA 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.07) 0%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs tracking-[0.4em] uppercase text-[#6B7280] font-mono">Our Work</span>
          <h1 className="font-heading text-[#111827] mt-2" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            The Gallery
          </h1>
          <p className="text-[#6B7280] mt-3 max-w-lg text-sm leading-relaxed">
            Stories captured, emotions preserved, moments made eternal.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Filter — scrollable on mobile */}
        <div className="flex items-center gap-2 mb-8 sm:mb-12 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {['all', ...galleryCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 sm:px-4 py-2 text-[10px] sm:text-xs tracking-widest uppercase font-mono rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                category === cat
                  ? 'bg-[#111827] text-white shadow-md'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
              style={category !== cat ? {
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(229,231,235,0.8)',
              } : {}}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Responsive Masonry Grid */}
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-3 gap-3 sm:gap-4">
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                className="break-inside-avoid mb-3 sm:mb-4 group cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden relative block"
                onClick={() => openLightbox(img.id)}
              >
                <img
                  src={img.url}
                  alt={`${img.title} — ${img.category} photography by Candid Canvas BD`}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 block"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-400 flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100"
                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <ZoomIn size={18} className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-medium truncate">{img.title}</p>
                  <p className="text-white/60 text-[10px] capitalize mt-0.5">{img.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 sm:py-24 text-[#6B7280]">
            <p className="font-heading text-xl sm:text-2xl">No images in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox — improved mobile nav buttons */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/97 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white z-10 transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
              onClick={() => setLightbox(null)}
            >
              <X size={20} />
            </button>
            <button
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white z-10 transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white/60 hover:text-white z-10 transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={22} />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22 }}
              src={filtered[lightbox].url}
              alt={filtered[lightbox].title}
              className="max-w-full max-h-[78vh] sm:max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 text-center px-16">
              <p className="text-white text-sm font-medium truncate">{filtered[lightbox].title}</p>
              <p className="text-white/50 text-xs capitalize mt-1">{filtered[lightbox].category} · {lightbox + 1}/{filtered.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
