import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Film, Video, Calendar, ArrowRight } from 'lucide-react';

const SERVICES_DATA = [
  {
    icon: Camera,
    tag: 'PHOTO',
    title: 'Photography',
    description: 'Editorial-quality photography that transforms your most precious moments into timeless art. Each frame is composed with intention, light, and emotion.',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=700&q=80',
    features: ['Wedding & Pre-wedding', 'Portrait Sessions', 'Event Coverage', 'Product Photography'],
  },
  {
    icon: Film,
    tag: 'CINE',
    title: 'Cinematography',
    description: 'Cinematic storytelling that brings your events to life. From intimate ceremonies to grand productions — every frame is a work of art.',
    image: 'https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=700&q=80',
    features: ['Wedding Films', 'Documentary Style', 'Highlight Reels', 'Brand Films'],
  },
  {
    icon: Video,
    tag: 'REELS',
    title: 'Social Reels',
    description: 'High-impact short-form content optimized for Instagram, TikTok, and YouTube. Stop the scroll with visuals that speak before words.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80',
    features: ['Instagram Reels', 'TikTok Content', 'YouTube Shorts', 'Brand Campaigns'],
  },
  {
    icon: Calendar,
    tag: 'EVENTS',
    title: 'Events',
    description: 'Complete visual coverage for corporate events, festivals, and special occasions. Professional, unobtrusive, and always capturing what matters.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80',
    features: ['Corporate Events', 'Festivals & Eid', 'Birthday Parties', 'Conferences'],
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="text-xs tracking-[0.4em] uppercase text-[#6B7280] font-mono">What We Offer</span>
          <h2 className="font-heading text-[#111827] mt-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Our Services
          </h2>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES_DATA.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.tag}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className="group bg-white rounded overflow-hidden border border-[#E5E7EB] hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#111827] text-white text-xs tracking-widest uppercase px-3 py-1.5 rounded-sm font-mono">
                      {service.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon size={18} className="text-[#374151]" />
                    <h3 className="font-heading text-xl font-semibold text-[#111827]">{service.title}</h3>
                  </div>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {service.features.map((f) => (
                      <span key={f} className="text-xs bg-[#F8F9FA] text-[#374151] px-2.5 py-1 rounded-full border border-[#E5E7EB]">
                        {f}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/packages"
                    className="inline-flex items-center gap-1.5 text-sm text-[#374151] hover:text-[#111827] font-medium transition-colors group-hover:gap-2.5"
                  >
                    View Packages <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
