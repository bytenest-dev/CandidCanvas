import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star, ArrowRight } from 'lucide-react';

const DEMO_PACKAGES = [
  {
    id: '1',
    name: 'Essentials',
    tag: 'PHOTO',
    price: 15000,
    shortDescription: 'Perfect for intimate events and portrait sessions.',
    features: ['4 hours coverage', '150 edited photos', 'Online gallery delivery', '1 photographer', 'Standard retouching'],
    popular: false,
  },
  {
    id: '2',
    name: 'Signature',
    tag: 'PHOTO + CINE',
    price: 35000,
    shortDescription: 'Our most loved package for weddings and major events.',
    features: ['8 hours coverage', '400 edited photos', 'Cinematic highlight reel', '2 photographers', 'Premium retouching', 'Same-day preview', 'Printed album'],
    popular: true,
  },
  {
    id: '3',
    name: 'Prestige',
    tag: 'FULL COVERAGE',
    price: 65000,
    shortDescription: 'The complete storytelling experience — no detail missed.',
    features: ['Full-day coverage', '600+ edited photos', 'Full film (3-5 min)', 'Social reels package', '3 photographers', 'Luxury retouching', 'Premium album', 'Pre-event session', 'Dedicated editor'],
    popular: false,
  },
];

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString('en-BD')}`;
}

export default function PackagesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {DEMO_PACKAGES.map((pkg, i) => (
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
                <div className="absolute top-0 left-0 right-0 bg-[#111827] py-1.5 text-center">
                  <span className="text-white text-xs tracking-widest uppercase font-mono flex items-center justify-center gap-1.5">
                    <Star size={10} fill="currentColor" /> Most Popular
                  </span>
                </div>
              )}
              <div className={`p-8 ${pkg.popular ? 'pt-12' : ''}`}>
                <div className="mb-6">
                  <span className="text-xs tracking-widest uppercase text-[#6B7280] font-mono">{pkg.tag}</span>
                  <h3 className="font-heading text-2xl text-[#111827] mt-1">{pkg.name}</h3>
                  <p className="text-[#6B7280] text-sm mt-2">{pkg.shortDescription}</p>
                </div>
                <div className="mb-6">
                  <span className="font-heading text-4xl text-[#111827]">{formatBDT(pkg.price)}</span>
                  <span className="text-[#6B7280] text-sm ml-1">/ session</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#374151]">
                      <Check size={14} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                      {f}
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
          ))}
        </div>

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
            View all packages & custom options <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
