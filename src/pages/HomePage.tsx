import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import CinematicSlider from '../components/home/CinematicSlider';
import Testimonials from '../components/home/Testimonials';
import CTABanner from '../components/home/CTABanner';

const BASE = 'https://candidcanvas.pro.bd';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Candid Canvas BD | Best Wedding Photography &amp; Cinematography in Bangladesh</title>
        <meta name="description" content="Candid Canvas BD — Bangladesh's #1 photography and cinematography studio. Premium wedding photography, cinematic films, reels, corporate events in Bogura &amp; across Bangladesh. 500+ projects, 98% client satisfaction. Book today!" />
        <meta name="keywords" content="Candid Canvas, Candid Canvas BD, candid canvas photography bangladesh, best wedding photographer bangladesh, best photographer bogura, wedding photography bangladesh, cinematography bangladesh, wedding cinematography, reels production bangladesh, corporate photography, event photography bangladesh, birthday photography bogura, pre-wedding photography bangladesh, candid photography, portrait photography bangladesh, photography studio bogura, বিয়ের ফটোগ্রাফি বাংলাদেশ, ক্যান্ডিড ক্যানভাস বিডি" />
        <link rel="canonical" href={`${BASE}/`} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="application-name" content="Candid Canvas BD" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Candid Canvas BD" />
        <meta property="og:title" content="Candid Canvas BD | Best Wedding Photography &amp; Cinematography Bangladesh" />
        <meta property="og:description" content="Candid Canvas BD — Premium wedding photography, cinematography, reels and event coverage in Bangladesh. 500+ projects, 98% satisfaction. Book now." />
        <meta property="og:url" content={`${BASE}/`} />
        <meta property="og:image" content={`${BASE}/logo.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Candid Canvas BD — Best Photography Studio Bangladesh" />
        <meta property="og:locale" content="en_BD" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@candidcanvasbd" />
        <meta name="twitter:title" content="Candid Canvas BD | Best Wedding Photography Bangladesh" />
        <meta name="twitter:description" content="Candid Canvas BD — Premium photography, cinematography &amp; reels. 500+ projects across Bangladesh. Book now." />
        <meta name="twitter:image" content={`${BASE}/logo.png`} />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${BASE}/#webpage`,
          "url": `${BASE}/`,
          "name": "Candid Canvas BD | Best Wedding Photography & Cinematography in Bangladesh",
          "description": "Candid Canvas BD — Premium photography & cinematography in Bangladesh. Wedding, events, reels, corporate.",
          "isPartOf": { "@id": `${BASE}/#website` },
          "about": { "@id": `${BASE}/#business` },
          "primaryImageOfPage": { "@type": "ImageObject", "url": `${BASE}/logo.png` },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE}/` }]
          }
        })}</script>
      </Helmet>

      <Hero />
      <CinematicSlider />
      <div className="h-16 sm:h-20 lg:h-24 bg-white" />
      <Testimonials />
      <CTABanner />

      {/* SEO Brand Content Block */}
      <section className="bg-white border-t border-[#F3F4F6] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl text-[#111827] mb-4">
              Candid Canvas BD — Photography &amp; Cinematography Studio in Bangladesh
            </h2>
            <p className="text-[#6B7280] text-sm leading-relaxed max-w-3xl mx-auto">
              <strong>Candid Canvas BD</strong> (also known as <strong>Candid Canvas</strong>) is Bangladesh's premier
              photography and cinematography studio, proudly based in <strong>Bogura, Bangladesh</strong>.
              We specialize in <strong>wedding photography</strong>, <strong>cinematic wedding films</strong>,
              <strong>social media reels</strong>, <strong>corporate events</strong>, <strong>birthday sessions</strong>,
              <strong>pre-wedding shoots</strong>, <strong>outdoor portrait photography</strong> and
              <strong>festival coverage</strong>. With <strong>500+ completed projects</strong> and{' '}
              <strong>98% client satisfaction</strong>, Candid Canvas BD is the most trusted photography studio
              across Bangladesh — from Bogura, Dhaka, Chittagong, Rajshahi to Sylhet.
            </p>
          </div>

          {/* Service tags grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {[
              { title: 'Wedding Photography', desc: 'Bogura & Bangladesh' },
              { title: 'Wedding Cinematography', desc: 'Cinematic Films' },
              { title: 'Pre-Wedding Shoots', desc: 'Romantic Sessions' },
              { title: 'Social Media Reels', desc: 'Instagram & Facebook' },
              { title: 'Corporate Events', desc: 'Professional Coverage' },
              { title: 'Birthday Photography', desc: 'Special Moments' },
              { title: 'Outdoor Portraits', desc: 'Creative Sessions' },
              { title: 'Festival Coverage', desc: 'Eid, Puja & More' },
            ].map(s => (
              <div key={s.title} className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-3 text-center">
                <p className="text-xs font-semibold text-[#111827]">{s.title}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Keyword tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Candid Canvas', 'Candid Canvas BD', 'Wedding Photography Bangladesh',
              'Best Photographer Bogura', 'Cinematography Bangladesh',
              'Reels Production Bangladesh', 'Event Photography',
              'Corporate Photography', 'Birthday Photography',
              'Pre-Wedding Shoot', 'Portrait Photography',
              'Photography Studio Bogura', 'Candid Photography Bangladesh',
            ].map(tag => (
              <span key={tag} className="px-3 py-1 bg-[#F8F9FA] rounded-full border border-[#E5E7EB] text-xs text-[#9CA3AF]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
