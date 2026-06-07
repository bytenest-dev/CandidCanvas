import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import CinematicSlider from '../components/home/CinematicSlider';
import Testimonials from '../components/home/Testimonials';
import CTABanner from '../components/home/CTABanner';
import { SITE_URL, SITE_NAME, SITE_NAME_FULL, BRAND_KEYWORDS, OG_IMAGE } from '../lib/seo';

export default function HomePage() {
  return (
    <>
      <Helmet>
        {/* ── Primary SEO ── */}
        <title>Candid Canvas | Wedding Photography &amp; Cinematography | Bogura, Bangladesh</title>
        <meta name="description" content={`Candid Canvas — official website for premium wedding photography, cinematography & reels in Bogura, Bangladesh (${SITE_NAME_FULL}). 500+ projects, 98% satisfaction. Book now.`} />
        <meta name="keywords" content={`${BRAND_KEYWORDS}, wedding photography bangladesh, wedding photographer bogura, candid photography bangladesh, cinematography bogura, event photography bangladesh, reels production bogura, corporate photography bangladesh, birthday photography`} />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta name="robots" content="index, follow" />
        <meta name="application-name" content={SITE_NAME} />

        {/* ── Open Graph ── */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content="Candid Canvas | Premium Photography &amp; Cinematography in Bangladesh" />
        <meta property="og:description" content="Candid Canvas offers premium wedding photography, cinematography, reels and event coverage in Bogura, Bangladesh. Preserving your special moments with cinematic storytelling." />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Candid Canvas BD — Premium Photography &amp; Cinematography" />
        <meta property="og:locale" content="en_BD" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Candid Canvas | Premium Photography &amp; Cinematography" />
        <meta name="twitter:description" content="Candid Canvas — premium wedding photography, cinematography & reels in Bogura, Bangladesh. 500+ projects. Book your session today." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Candid Canvas BD — Preserving Special Moments" />

        {/* ── Breadcrumb + Page Schema ── */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${SITE_URL}/#webpage`,
          "url": `${SITE_URL}/`,
          "name": "Candid Canvas | Premium Photography & Cinematography in Bangladesh",
          "description": "Candid Canvas — premium photography & cinematography services in Bogura, Bangladesh.",
          "isPartOf": { "@id": `${SITE_URL}/#website` },
          "about": { "@id": `${SITE_URL}/#business` },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` }
            ]
          }
        })}</script>
      </Helmet>
      <Hero />
      <CinematicSlider />
      {/* Spacer after slider */}
      <div className="h-16 sm:h-20 lg:h-24 bg-white" />
      <Testimonials />
      <CTABanner />

      {/* ── Brand SEO Content Block — visible to Google, subtle for users ── */}
      <section className="bg-white border-t border-[#F3F4F6] py-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-2xl text-[#111827] mb-3">
            Candid Canvas — Photography &amp; Cinematography Studio in Bangladesh
          </h2>
          <p className="text-[#6B7280] text-sm leading-relaxed max-w-2xl mx-auto mb-4">
            <strong>Candid Canvas</strong> (also known as <strong>Candid Canvas BD</strong>) is a professional photography and cinematography studio based in Bogura, Bangladesh.
            When you search for <em>candid canvas</em>, you find our team specializing in wedding photography, cinematic films, social media reels, corporate events, birthday sessions,
            festival coverage, and outdoor portrait photography. With 500+ completed projects and 98% client satisfaction,
            Candid Canvas is trusted across Bangladesh for preserving life's most special moments.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-[#9CA3AF]">
            {[
              'Candid Canvas',
              'Candid Canvas BD',
              'Candid Canvas Bangladesh',
              'Wedding Photography Bangladesh',
              'Photographer Bogura',
              'Cinematography Bangladesh',
              'Event Photography',
              'Reels Production',
              'Corporate Photography',
            ].map(tag => (
              <span key={tag} className="px-3 py-1 bg-[#F8F9FA] rounded-full border border-[#E5E7EB]">{tag}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
