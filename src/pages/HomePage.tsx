import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import CinematicSlider from '../components/home/CinematicSlider';
import Testimonials from '../components/home/Testimonials';
import CTABanner from '../components/home/CTABanner';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Candid Canvas BD — Premium Photography & Cinematography in Dhaka</title>
        <meta name="description" content="Candid Canvas BD offers premium photography, cinematography, reels and event coverage in Dhaka, Bangladesh. Preserving your special moments with cinematic storytelling." />
        <meta name="keywords" content="photography dhaka, wedding photographer bangladesh, candid photography, cinematography, event photography" />
        <meta property="og:title" content="Candid Canvas BD — Preserving Special Moments" />
        <meta property="og:description" content="Premium photography & cinematography in Dhaka, Bangladesh." />
        <meta property="og:type" content="website" />
      </Helmet>
      <Hero />
      <CinematicSlider />
      <Testimonials />
      <CTABanner />
    </>
  );
}
