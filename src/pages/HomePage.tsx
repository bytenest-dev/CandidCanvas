import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import CinematicSlider from '../components/home/CinematicSlider';
import Testimonials from '../components/home/Testimonials';
import CTABanner from '../components/home/CTABanner';

const BASE_URL = 'https://candid-canvas.netlify.app';
const OG_IMAGE = `${BASE_URL}/logo.png`;

export default function HomePage() {
  return (
    <>
      <Helmet>
        {/* ── Primary SEO ── */}
        <title>Candid Canvas BD | Premium Photography &amp; Cinematography in Bangladesh</title>
        <meta name="description" content="Candid Canvas BD offers premium wedding photography, cinematography, reels and event coverage in Dhaka, Bangladesh. 500+ projects. 98% client satisfaction." />
        <meta name="keywords" content="wedding photography bangladesh, wedding photographer dhaka, candid photography bangladesh, cinematography dhaka, event photography bangladesh, reels production dhaka, corporate photography bangladesh, birthday photography" />
        <link rel="canonical" href={`${BASE_URL}/`} />
        <meta name="robots" content="index, follow" />

        {/* ── Open Graph ── */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Candid Canvas BD" />
        <meta property="og:title" content="Candid Canvas BD | Premium Photography &amp; Cinematography in Bangladesh" />
        <meta property="og:description" content="Premium wedding photography, cinematography, reels and event coverage in Dhaka, Bangladesh. Preserving your special moments with cinematic storytelling." />
        <meta property="og:url" content={`${BASE_URL}/`} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Candid Canvas BD — Premium Photography &amp; Cinematography" />
        <meta property="og:locale" content="en_BD" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Candid Canvas BD | Premium Photography &amp; Cinematography" />
        <meta name="twitter:description" content="Premium wedding photography, cinematography & reels in Dhaka, Bangladesh. 500+ projects. Book your session today." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:image:alt" content="Candid Canvas BD — Preserving Special Moments" />

        {/* ── Breadcrumb + Page Schema ── */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${BASE_URL}/#webpage`,
          "url": `${BASE_URL}/`,
          "name": "Candid Canvas BD | Premium Photography & Cinematography in Bangladesh",
          "description": "Premium photography & cinematography services in Dhaka, Bangladesh.",
          "isPartOf": { "@id": `${BASE_URL}/#website` },
          "about": { "@id": `${BASE_URL}/#business` },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE_URL}/` }
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
    </>
  );
}
