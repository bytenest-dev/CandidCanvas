import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star, ArrowRight, Tag } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

function formatBDT(price: string) {
  if (!price) return '';
  if (price.startsWith('৳')) return price;
  const n = parseInt(price.replace(/\D/g, ''));
  if (isNaN(n)) return price;
  return `৳${n.toLocaleString('en-BD')}`;
}

function calcDiscountPct(original: string, actual: string) {
  const orig = parseInt(original.replace(/\D/g, ''));
  const act = parseInt(actual.replace(/\D/g, ''));
  if (isNaN(orig) || isNaN(act) || orig <= act) return null;
  return Math.round(((orig - act) / orig) * 100);
}

export default function PackagesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { packages, siteLoading } = useSite();

  // Show up to 3 active packages; fall back to nothing while loading
  const activePackages = packages.filter(p => p.active).slice(0, 3);

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.4em] uppercase text-[#6B7280] font-mono">Investment</span>
          <h2 className="font-heading text-[#111827] mt-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Our Packages
          </h2>
          <p className="text-[#6B7280] mt-4 max-w-sm mx-auto text-sm">
            Transparent pricing. No hidden fees. Every package is a commitment to excellence.
          </p>
        </motion.div>

        {siteLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded border border-[#E5E7EB] p-8 animate-pulse">
                <div className="h-3 bg-[#F3F4F6] rounded w-16 mb-4" />
                <div className="h-6 bg-[#F3F4F6] rounded w-28 mb-2" />
                <div className="h-3 bg-[#F3F4F6] rounded w-full mb-6" />
                <div className="h-9 bg-[#F3F4F6] rounded w-1/2 mb-6" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => <div key={j} className="h-3 bg-[#F3F4F6] rounded" />)}
                </div>
              </div>
            ))}
          </div>
        ) : activePackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {activePackages.map((pkg, i) => {
              const hasOriginal = !!pkg.originalPrice;
              const discountPct = hasOriginal ? calcDiscountPct(pkg.originalPrice!, pkg.price) : null;

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.8 }}
                  className={`relative bg-white rounded border ${
                    pkg.popular
                      ? 'border-[#111827] shadow-2xl shadow-gray-200 scale-105'
                      : 'border-[#E5E7EB] hover:border-[#9CA3AF] hover:shadow-lg'
                  } transition-all duration-300 overflow-hidden`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-[#111827] py-1.5 text-center z-10">
                      <span className="text-white text-xs tracking-widest uppercase font-mono flex items-center justify-center gap-1.5">
                        <Star size={10} fill="currentColor" /> Most Popular
                      </span>
                    </div>
                  )}

                  {/* Image with discount badge */}
                  {pkg.imageUrl && (
                    <div className="aspect-video overflow-hidden relative">
                      <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                      {(pkg.discountLabel || discountPct) && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                            {pkg.discountLabel || `${discountPct}% OFF`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`p-8 ${pkg.popular ? 'pt-12' : ''}`}>
                    <div className="mb-6">
                      <span className="text-xs tracking-widest uppercase text-[#6B7280] font-mono">{pkg.category}</span>
                      <h3 className="font-heading text-2xl text-[#111827] mt-1">{pkg.name}</h3>
                      <p className="text-[#6B7280] text-sm mt-2">{pkg.description}</p>
                    </div>

                    {/* ── Psychological Pricing ── */}
                    <div className="mb-6">
                      {hasOriginal ? (
                        <div className="space-y-1.5">
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="font-heading text-4xl text-[#111827]">{formatBDT(pkg.price)}</span>
                            <span className="text-[#B0B5BE] text-xl line-through font-light">{formatBDT(pkg.originalPrice!)}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {(pkg.discountLabel || discountPct) && (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full">
                                <Tag size={9} /> {pkg.discountLabel || `${discountPct}% OFF`}
                              </span>
                            )}
                            <span className="text-[#9CA3AF] text-sm">/ session</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-heading text-4xl text-[#111827]">{formatBDT(pkg.price)}</span>
                          <span className="text-[#6B7280] text-sm ml-1">/ session</span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {pkg.features.split('\n').filter(Boolean).map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-[#374151]">
                          <Check size={14} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          {f.trim()}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/book"
                      className={`block w-full py-3 text-center text-sm tracking-wide font-medium rounded transition-all duration-300 ${
                        pkg.popular
                          ? 'bg-[#111827] text-white hover:bg-[#374151]'
                          : 'border border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white'
                      }`}
                    >
                      Book This Package
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            View all packages &amp; custom options <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
