import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star, ArrowRight, Package, Tag, Loader2, CheckCircle2, XCircle, X, LayoutList, Table2 } from 'lucide-react';
import { useSite } from '../context/SiteContext';

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

export default function PackagesPage() {
  const { packages, siteLoading } = useSite();
  const activePackages = packages.filter(p => p.active);
  const [viewMode, setViewMode] = useState<'cards' | 'compare'>('cards');

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [promoState, setPromoState] = useState<{
    loading: boolean; valid: boolean | null; error: string; discount: number; type: string; promoData: any | null;
  }>({ loading: false, valid: null, error: '', discount: 0, type: 'percentage', promoData: null });

  const applyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    setPromoState(s => ({ ...s, loading: true, valid: null, error: '' }));
    try {
      const { validatePromoCode } = await import('../lib/promoCodes');
      const result = await validatePromoCode(code);
      if (result.valid && result.promo) {
        setPromoState({
          loading: false, valid: true, error: '',
          discount: result.promo.discountValue,
          type: result.promo.discountType || 'percentage',
          promoData: result.promo,
        });
      } else {
        setPromoState({ loading: false, valid: false, error: result.error || 'Invalid or expired code', discount: 0, type: 'percentage', promoData: null });
      }
    } catch {
      setPromoState({ loading: false, valid: false, error: 'Failed to validate. Try again.', discount: 0, type: 'percentage', promoData: null });
    }
  };

  const clearPromo = () => {
    setPromoCode('');
    setPromoState({ loading: false, valid: null, error: '', discount: 0, type: 'percentage', promoData: null });
  };

  // Get discounted price for display
  const getDiscountedPrice = (price: string) => {
    if (!promoState.valid || !promoState.discount) return null;
    const raw = parseInt(price.replace(/\D/g, ''));
    if (isNaN(raw)) return null;
    if (promoState.type === 'percentage') {
      return Math.round(raw * (1 - promoState.discount / 100));
    }
    return Math.max(0, raw - promoState.discount);
  };

  // Pre-compute discounted prices map for comparison table
  const discountedByPromoMap = Object.fromEntries(
    activePackages.map(pkg => [pkg.id, getDiscountedPrice(pkg.price)])
  );

  return (
    <>
      <Helmet>
        <title>Photography Packages &amp; Pricing | Candid Canvas BD Bangladesh</title>
        <meta name="description" content="Candid Canvas BD photography packages — transparent pricing for wedding photography, cinematography, reels, corporate events &amp; birthday sessions in Bangladesh. No hidden fees. Best rates in Bogura. Book online." />
        <meta name="keywords" content="candid canvas bd packages, candid canvas bd pricing, photography packages bangladesh, wedding photography price bangladesh, wedding photography cost bogura, cinematography packages bangladesh, reels production price, event photography packages bangladesh, photography pricing bogura, best photography packages bangladesh, affordable photographer bangladesh" />
        <link rel="canonical" href="https://www.candidcanvas.pro.bd/packages" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Candid Canvas BD" />
        <meta property="og:title" content="Photography Packages &amp; Pricing | Candid Canvas BD Bangladesh" />
        <meta property="og:description" content="Candid Canvas BD — Transparent photography packages for wedding, events, reels &amp; corporate in Bangladesh. Competitive pricing, no hidden fees." />
        <meta property="og:url" content="https://www.candidcanvas.pro.bd/packages" />
        <meta property="og:image" content="https://www.candidcanvas.pro.bd/logo.png" />
        <meta property="og:image:alt" content="Candid Canvas BD Photography Packages Bangladesh" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Candid Canvas BD Photography Packages &amp; Pricing" />
        <meta name="twitter:description" content="Best photography packages in Bangladesh — wedding, events, reels &amp; corporate by Candid Canvas BD. Book now." />
        <meta name="twitter:image" content="https://www.candidcanvas.pro.bd/logo.png" />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemPage",
          "name": "Candid Canvas BD Photography Packages & Pricing",
          "description": "Photography and cinematography service packages with transparent pricing by Candid Canvas BD, Bangladesh.",
          "url": "https://www.candidcanvas.pro.bd/packages",
          "isPartOf": { "@id": "https://www.candidcanvas.pro.bd/#website" },
          "about": { "@id": "https://www.candidcanvas.pro.bd/#business" },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.candidcanvas.pro.bd/" },
              { "@type": "ListItem", "position": 2, "name": "Packages", "item": "https://www.candidcanvas.pro.bd/packages" }
            ]
          }
        })}</script>
      </Helmet>

      {/* Hero header */}
      <div className="pt-28 pb-16 bg-[#111827] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs tracking-[0.4em] uppercase text-white/40 font-mono">Investment</span>
            <h1 className="font-heading text-white mt-3 text-4xl sm:text-5xl lg:text-6xl">Our Packages</h1>
            <p className="text-white/50 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              Transparent pricing. No hidden fees. Every package is a commitment to excellence and storytelling.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

        {/* ── Promo Code Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-xl mx-auto"
        >
          <div className="relative bg-gradient-to-r from-[#111827] to-[#1f2937] rounded-2xl p-5 sm:p-6 shadow-lg overflow-hidden">
            {/* Decorative sparkle dots */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
              backgroundSize: '14px 14px',
            }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                  <Tag size={14} className="text-white" />
                </div>
                <span className="text-white font-semibold text-sm">Have a promo code?</span>
                <span className="text-white/40 text-xs">Get an exclusive discount instantly</span>
              </div>
              {promoState.valid ? (
                /* Applied state */
                <div className="flex items-center justify-between bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-semibold">
                        {promoState.type === 'percentage'
                          ? `${promoState.discount}% off applied!`
                          : `৳${promoState.discount.toLocaleString()} off applied!`}
                      </p>
                      <p className="text-green-300 text-xs">Code: <span className="font-mono font-bold">{promoCode.toUpperCase()}</span></p>
                    </div>
                  </div>
                  <button onClick={clearPromo} className="text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                    <XCircle size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && applyPromo()}
                    placeholder="Enter promo code"
                    className={`flex-1 bg-white/10 border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 transition-colors font-mono tracking-wider ${
                      promoState.valid === false
                        ? 'border-red-400/50 focus:ring-red-400/50'
                        : 'border-white/20 focus:ring-white/30'
                    }`}
                  />
                  <button
                    onClick={applyPromo}
                    disabled={promoState.loading || !promoCode.trim()}
                    className="px-5 py-2.5 bg-white text-[#111827] text-sm font-semibold rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 flex-shrink-0"
                  >
                    {promoState.loading ? <Loader2 size={14} className="animate-spin" /> : null}
                    Apply
                  </button>
                </div>
              )}
              {promoState.valid === false && promoState.error && (
                <p className="mt-2 text-red-400 text-xs flex items-center gap-1.5">
                  <XCircle size={12} /> {promoState.error}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── View mode toggle (only when packages exist) ── */}
        {!siteLoading && activePackages.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${viewMode === 'cards' ? 'bg-[#111827] text-white border-[#111827]' : 'bg-white text-[#374151] border-[#E5E7EB] hover:border-[#374151]'}`}
            >
              <LayoutList size={14} /> Card View
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${viewMode === 'compare' ? 'bg-[#111827] text-white border-[#111827]' : 'bg-white text-[#374151] border-[#E5E7EB] hover:border-[#374151]'}`}
            >
              <Table2 size={14} /> Compare
            </button>
          </div>
        )}

        {/* Loading state */}
        {siteLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-7 animate-pulse">
                <div className="h-4 bg-[#F3F4F6] rounded w-20 mb-3" />
                <div className="h-8 bg-[#F3F4F6] rounded w-32 mb-2" />
                <div className="h-4 bg-[#F3F4F6] rounded w-full mb-1" />
                <div className="h-4 bg-[#F3F4F6] rounded w-3/4 mb-6" />
                <div className="h-10 bg-[#F3F4F6] rounded w-1/2 mb-6" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, j) => <div key={j} className="h-3 bg-[#F3F4F6] rounded" />)}
                </div>
              </div>
            ))}
          </div>
        ) : activePackages.length === 0 ? (
          <div className="text-center py-24">
            <Package size={48} className="text-[#D1D5DB] mx-auto mb-4" />
            <h2 className="font-heading text-2xl text-[#374151] mb-2">Packages Coming Soon</h2>
            <p className="text-[#9CA3AF] text-sm mb-6">Check back soon or contact us directly for pricing.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#111827] text-white text-sm rounded-xl hover:bg-[#374151] transition-colors">
              Contact Us <ArrowRight size={14} />
            </Link>
          </div>
        ) : viewMode === 'compare' ? (
          /* ── COMPARISON TABLE ── */
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider w-40">Feature</th>
                  {activePackages.map(pkg => (
                    <th key={pkg.id} className={`px-5 py-4 text-center ${pkg.popular ? 'bg-[#111827] text-white' : 'text-[#111827]'}`}>
                      <div className="flex flex-col items-center gap-1">
                        {pkg.popular && (
                          <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-mono uppercase tracking-wider flex items-center gap-1">
                            <Star size={8} fill="currentColor" /> Popular
                          </span>
                        )}
                        <span className="font-heading text-lg">{pkg.name}</span>
                        <span className={`text-xs font-mono ${pkg.popular ? 'text-white/60' : 'text-[#9CA3AF]'}`}>{pkg.category}</span>
                        {/* Price */}
                        <div className="mt-1">
                          {pkg.originalPrice ? (
                            <div className="flex items-center gap-1.5 flex-col">
                              <span className={`font-heading text-xl ${pkg.popular ? 'text-white' : 'text-[#111827]'}`}>{formatBDT(pkg.price)}</span>
                              <span className={`text-xs line-through ${pkg.popular ? 'text-white/40' : 'text-[#9CA3AF]'}`}>{formatBDT(pkg.originalPrice)}</span>
                            </div>
                          ) : (
                            <span className={`font-heading text-xl ${pkg.popular ? 'text-white' : 'text-[#111827]'}`}>{formatBDT(pkg.price)}</span>
                          )}
                        </div>
                        {/* Promo-discounted price */}
                        {discountedByPromoMap[pkg.id] !== null && (
                          <span className="text-xs text-emerald-400 font-semibold">→ ৳{discountedByPromoMap[pkg.id]?.toLocaleString('en-BD')}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Collect all unique features across all packages */}
                {(() => {
                  const allFeatures = Array.from(new Set(
                    activePackages.flatMap(p => p.features.split('\n').map(f => f.trim()).filter(Boolean))
                  ));
                  return allFeatures.map((feature, idx) => (
                    <tr key={idx} className={`border-b border-[#F3F4F6] last:border-0 ${idx % 2 === 0 ? '' : 'bg-[#F8F9FA]/50'}`}>
                      <td className="px-5 py-3.5 text-[#374151] font-medium text-xs">{feature}</td>
                      {activePackages.map(pkg => {
                        const pkgFeatures = pkg.features.split('\n').map(f => f.trim().toLowerCase());
                        const hasIt = pkgFeatures.some(f => f.includes(feature.toLowerCase()) || feature.toLowerCase().includes(f));
                        return (
                          <td key={pkg.id} className={`px-5 py-3.5 text-center ${pkg.popular ? 'bg-[#F8F9FA]' : ''}`}>
                            {hasIt
                              ? <Check size={16} className="text-[#10B981] mx-auto" />
                              : <X size={14} className="text-[#D1D5DB] mx-auto" />
                            }
                          </td>
                        );
                      })}
                    </tr>
                  ));
                })()}
                {/* Book row */}
                <tr className="border-t-2 border-[#E5E7EB]">
                  <td className="px-5 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider"></td>
                  {activePackages.map(pkg => (
                    <td key={pkg.id} className={`px-5 py-4 text-center ${pkg.popular ? 'bg-[#F8F9FA]' : ''}`}>
                      <Link
                        to={`/book?pkg=${encodeURIComponent(pkg.name)}`}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                          pkg.popular
                            ? 'bg-[#111827] text-white hover:bg-[#374151]'
                            : 'border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white'
                        }`}
                      >
                        Book <ArrowRight size={11} />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activePackages.map((pkg, i) => {
              const hasOriginal = !!pkg.originalPrice;
              const discountPct = hasOriginal ? calcDiscountPct(pkg.originalPrice!, pkg.price) : null;
              const discountedByPromo = getDiscountedPrice(pkg.price);

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`relative bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                    pkg.popular
                      ? 'border-2 border-[#111827] shadow-2xl shadow-gray-200/80 scale-[1.02]'
                      : 'border border-[#E5E7EB] hover:border-[#9CA3AF] hover:shadow-xl hover:shadow-gray-100'
                  }`}
                >
                  {/* Package image */}
                  {pkg.imageUrl && (
                    <div className="aspect-video overflow-hidden relative">
                      <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                      {/* Discount badge on image */}
                      {(pkg.discountLabel || discountPct) && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                            {pkg.discountLabel || `${discountPct}% OFF`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {pkg.popular && (
                    <div className="bg-[#111827] py-2 text-center">
                      <span className="text-white text-xs tracking-widest uppercase font-mono flex items-center justify-center gap-1.5">
                        <Star size={10} fill="currentColor" /> Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    <div className="mb-5">
                      <span className="text-xs tracking-widest uppercase text-[#9CA3AF] font-mono">{pkg.category}</span>
                      <h3 className="font-heading text-2xl text-[#111827] mt-1">{pkg.name}</h3>
                      <p className="text-[#6B7280] text-sm mt-2 leading-relaxed">{pkg.description}</p>
                    </div>

                    {/* ── Psychological Pricing Block ── */}
                    <div className="mb-6 pb-6 border-b border-[#F3F4F6]">
                      {/* Promo-discounted price */}
                      {discountedByPromo !== null ? (
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="font-heading text-4xl text-[#111827]">
                              ৳{discountedByPromo.toLocaleString('en-BD')}
                            </span>
                            <span className="text-[#9CA3AF] text-sm line-through">
                              {formatBDT(pkg.price)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                              <Tag size={10} /> Promo applied
                            </span>
                            {hasOriginal && (
                              <span className="text-[#9CA3AF] text-xs line-through">{formatBDT(pkg.originalPrice!)}</span>
                            )}
                          </div>
                        </div>
                      ) : hasOriginal ? (
                        /* Psychological pricing — no promo active */
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="font-heading text-4xl text-[#111827]">{formatBDT(pkg.price)}</span>
                            <span className="text-[#B0B5BE] text-xl line-through font-light tracking-tight">{formatBDT(pkg.originalPrice!)}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {(pkg.discountLabel || discountPct) && (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full">
                                {pkg.discountLabel || `${discountPct}% OFF`}
                              </span>
                            )}
                            <span className="text-[#9CA3AF] text-xs">/ session</span>
                          </div>
                        </div>
                      ) : (
                        /* Plain price */
                        <div className="flex items-baseline gap-2">
                          <span className="font-heading text-4xl text-[#111827]">{formatBDT(pkg.price)}</span>
                          <span className="text-[#9CA3AF] text-sm">/ session</span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-7 flex-1">
                      {pkg.features.split('\n').filter(Boolean).map((f, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-[#374151]">
                          <Check size={14} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                          {f.trim()}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={`/book?pkg=${encodeURIComponent(pkg.name)}`}
                      className={`block w-full py-3 text-center text-sm font-medium rounded-xl transition-all duration-300 ${
                        pkg.popular
                          ? 'bg-[#111827] text-white hover:bg-[#374151]'
                          : 'border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white'
                      }`}
                    >
                      Book This Package
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Custom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 text-center py-14 sm:py-16 px-8 bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-2xl"
        >
          <h2 className="font-heading text-3xl sm:text-4xl text-white mb-3">Need Something Custom?</h2>
          <p className="text-white/60 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Every story is different. Contact us to craft a bespoke package that fits your vision and budget perfectly.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#111827] text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
          >
            Discuss Custom Package <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </>
  );
}
