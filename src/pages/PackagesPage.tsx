import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star, ArrowRight, Package } from 'lucide-react';
import { useSite } from '../context/SiteContext';

function formatBDT(price: string) {
  // If already formatted (e.g. "৳35,000"), return as-is
  if (price.startsWith('৳')) return price;
  const n = parseInt(price.replace(/\D/g, ''));
  if (isNaN(n)) return price;
  return `৳${n.toLocaleString('en-BD')}`;
}

export default function PackagesPage() {
  const { packages, siteLoading } = useSite();
  const activePackages = packages.filter(p => p.active);

  return (
    <>
      <Helmet>
        <title>Candid Canvas BD | Photography Packages &amp; Pricing | Bangladesh</title>
        <meta name="description" content="Transparent photography &amp; cinematography packages in Bangladesh. Wedding, reels, events &amp; corporate packages. Competitive pricing, no hidden fees. Book online." />
        <meta name="keywords" content="photography packages bangladesh, wedding photography pricing dhaka, cinematography packages, event photography cost bangladesh, photography packages price" />
        <link rel="canonical" href="https://candid-canvas.netlify.app/packages" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Candid Canvas BD" />
        <meta property="og:title" content="Photography Packages &amp; Pricing | Candid Canvas BD" />
        <meta property="og:description" content="Transparent photography & cinematography packages with competitive pricing in Bangladesh. Find the perfect package for your wedding, event, or corporate session." />
        <meta property="og:url" content="https://candid-canvas.netlify.app/packages" />
        <meta property="og:image" content="https://candid-canvas.netlify.app/logo.png" />
        <meta property="og:image:alt" content="Candid Canvas BD Photography Packages" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Photography Packages &amp; Pricing | Candid Canvas BD" />
        <meta name="twitter:description" content="Find the perfect photography package for your wedding, event or corporate session. Transparent pricing in Bangladesh." />
        <meta name="twitter:image" content="https://candid-canvas.netlify.app/logo.png" />

        {/* Breadcrumb + ItemList Schema */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemPage",
          "name": "Photography Packages & Pricing",
          "description": "Photography and cinematography service packages with pricing by Candid Canvas BD.",
          "url": "https://candid-canvas.netlify.app/packages",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://candid-canvas.netlify.app/" },
              { "@type": "ListItem", "position": 2, "name": "Packages", "item": "https://candid-canvas.netlify.app/packages" }
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activePackages.map((pkg, i) => (
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
                  <div className="aspect-video overflow-hidden">
                    <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
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

                  <div className="mb-6 pb-6 border-b border-[#F3F4F6]">
                    <span className="font-heading text-4xl text-[#111827]">{formatBDT(pkg.price)}</span>
                    <span className="text-[#9CA3AF] text-sm ml-1">/ session</span>
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
                    to="/book"
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
            ))}
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
