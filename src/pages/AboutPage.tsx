import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { Camera, Award, Users, Sparkles, MapPin, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import nabilImg from '../assets/nabil.png';
import { SITE_URL, SITE_NAME, OG_IMAGE } from '../lib/seo';

/* ─── constants ─────────────────────────────────────────── */
const EASE: [number,number,number,number] = [0.22, 1, 0.36, 1];

const STATS = [
  { num: '500+', label: 'Projects Delivered' },
  { num: '4+',   label: 'Years of Excellence' },
  { num: '98%',  label: 'Client Satisfaction' },
  { num: '300+', label: 'Happy Families' },
];

const TIMELINE = [
  { year: '2020', title: 'The First Frame', desc: 'Candid Canvas BD was born from a single camera and an unshakeable belief — that every moment deserves to be remembered forever.' },
  { year: '2021', title: 'First 100 Weddings', desc: 'Reached 100 wedding projects, building a reputation for emotionally rich, cinematic storytelling that clients call "exactly as I felt it."' },
  { year: '2022', title: 'Cinematography & Reels', desc: 'Expanded into full cinematography and short-form reels production — bringing our storytelling craft to the digital generation.' },
  { year: '2023', title: 'Corporate & Brand Work', desc: 'Added premium corporate event coverage and brand content, serving companies across Bogura and greater Bangladesh.' },
  { year: '2024', title: '500+ Projects & Beyond', desc: 'Crossed the 500-project milestone with a 98% satisfaction rate. The story is far from over.' },
];

const SERVICES = [
  { icon: Camera, label: 'Wedding Photography', desc: 'Every vow, every tear, every laugh — preserved in its full emotional depth.' },
  { icon: Sparkles, label: 'Cinematography', desc: 'Cinematic films that feel like a scene from your favourite movie, but better — it\'s real.' },
  { icon: Users, label: 'Corporate Events', desc: 'Professional coverage that represents your brand with the dignity it deserves.' },
  { icon: Award, label: 'Reels & Content', desc: 'Short-form visual content crafted to stop the scroll and tell your story in seconds.' },
];

/* ─── animation helpers ──────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: EASE, delay },
});

/* ─── sub-components ─────────────────────────────────────── */
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[3.5px] uppercase text-[#9CA3AF] mb-4">
      <span className="w-5 h-px bg-[#C8102E] opacity-70" />
      {children}
    </span>
  );
}

function SectionTitle({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2
      className={`font-heading leading-none ${light ? 'text-white' : 'text-[#111827]'}`}
      style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)' }}
    >
      {children}
    </h2>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <>
      {/* ── SEO ── */}
      <Helmet>
        <title>About {SITE_NAME} | Our Story & Vision | Bogura, Bangladesh</title>
        <meta name="description" content="Meet Nabil Chowdhury and the team behind Candid Canvas BD — Bangladesh's premier photography studio. 500+ projects, 4+ years of wedding photography & cinematography." />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <meta property="og:title" content={`About ${SITE_NAME} | Our Story & Vision`} />
        <meta property="og:description" content="500+ projects, 4+ years of excellence. Meet the team behind Candid Canvas BD, Bogura." />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta property="og:image" content={OG_IMAGE} />
      </Helmet>

      {/* ── 1. HERO ── */}
      <HeroSection />

      {/* ── 2. OWNER LETTER ── */}
      <OwnerSection />

      {/* ── 3. STATS BAR ── */}
      <StatsSection />

      {/* ── 4. SERVICES ── */}
      <ServicesSection />

      {/* ── 5. TIMELINE ── */}
      <TimelineSection />

      {/* ── 6. PHILOSOPHY ── */}
      <PhilosophySection />

      {/* ── 7. CTA ── */}
      <CTASection />
    </>
  );
}

/* ════════════════════════════════════════════════════════
   HERO SECTION — dark cinematic banner
════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: 'clamp(400px, 56vh, 640px)', background: '#080808' }}
    >
      {/* grain texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '180px' }}
      />
      {/* vertical accent line */}
      <motion.div
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
        className="absolute left-[8vw] top-[15%] bottom-[15%] w-px origin-top"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(200,16,46,0.6) 40%, rgba(200,16,46,0.6) 60%, transparent)' }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-16 sm:pb-20 pt-32 sm:pt-40">
        <motion.div {...fadeUp(0.1)}>
          <SectionEyebrow>Our Story</SectionEyebrow>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.25 }}
          className="font-heading text-white leading-none"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}
        >
          More Than a Studio.
          <br />
          <span className="text-white/30">A Promise.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
          className="mt-6 text-white/50 text-base sm:text-lg leading-relaxed max-w-xl"
        >
          Based in Bogura, Bangladesh — we document the moments you never want to forget, with the craft they deserve.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-4 flex items-center gap-2 text-white/30 text-xs font-mono tracking-widest"
        >
          <MapPin size={11} />
          Gohail Rd, Bogura, Bangladesh
        </motion.div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #080808)' }}
      />
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   OWNER SECTION — photo + letter from founder
════════════════════════════════════════════════════════ */
function OwnerSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* ── Left: photo + badge ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: EASE }}
            className="relative"
          >
            {/* photo card */}
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: 20, aspectRatio: '4/5',
                boxShadow: '0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)' }}
            >
              <img
                src={nabilImg}
                alt="Nabil Chowdhury — Founder & Lead Photographer, Candid Canvas BD"
                className="w-full h-full object-cover object-top"
                loading="eager"
                decoding="async"
              />
              {/* overlay gradient */}
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }}
              />
              {/* name tag inside photo */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                <p className="font-heading text-white text-2xl leading-none">Nabil Chowdhury</p>
                <p className="font-mono text-[10px] tracking-[3px] uppercase text-white/45 mt-1.5">
                  Founder & Lead Photographer
                </p>
              </div>
              {/* inner rim */}
              <div className="absolute inset-0 pointer-events-none rounded-[20px]"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
              />
            </div>

            {/* floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.55, duration: 0.7, ease: EASE }}
              className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-8 p-5 sm:p-6"
              style={{
                borderRadius: 16,
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                minWidth: 140,
              }}
            >
              <p className="font-heading text-white text-4xl leading-none">500<span className="text-[#C8102E]">+</span></p>
              <p className="font-mono text-[9px] tracking-[3px] uppercase text-white/40 mt-2">Projects<br/>Delivered</p>
            </motion.div>
          </motion.div>

          {/* ── Right: founder letter ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 0.18 }}
            className="text-white"
          >
            <SectionEyebrow>A Word from the Founder</SectionEyebrow>
            <SectionTitle light>The camera is just<br/>the beginning.</SectionTitle>

            {/* large quote mark */}
            <div className="mt-8 mb-6">
              <Quote size={38} className="text-[#C8102E] opacity-60" strokeWidth={1.2} />
            </div>

            <div className="space-y-5 text-white/60 text-[15px] leading-[1.82]">
              <p>
                I didn't pick up a camera to take pictures. I picked it up because I was terrified of forgetting — forgetting the look on my mother's face at a family gathering, the way light fell on a quiet moment, the laughter that felt too perfect to last.
              </p>
              <p>
                That fear turned into a calling. Every time I walk into a wedding, a birthday, or a quiet portrait session, I carry the same feeling: <em className="text-white/85 not-italic font-medium">"this moment will never exist again."</em> That awareness is what makes me press the shutter with intention.
              </p>
              <p>
                Candid Canvas BD is built on one simple belief — that great photography isn't about technical perfection. It's about truth. The truth of a feeling. The truth of a relationship. The truth of a single, unrepeatable second.
              </p>
              <p>
                When you trust us with your moments, we don't just show up with gear. We show up with care, with patience, and with a genuine love for what human connection looks like when the light is right.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
              <div>
                <p className="font-heading text-white text-xl leading-none">Nabil Chowdhury</p>
                <p className="font-mono text-[10px] tracking-[2.5px] uppercase text-white/35 mt-1.5">
                  Founder — Candid Canvas BD · Bogura, Bangladesh
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   STATS BAR
════════════════════════════════════════════════════════ */
function StatsSection() {
  return (
    <section className="py-12 sm:py-14" style={{ background: 'linear-gradient(135deg, #111827 0%, #1a1a2e 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {STATS.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i * 0.08)} className="text-center">
              <p
                className="font-heading text-white leading-none"
                style={{ fontSize: 'clamp(2.4rem, 4vw, 3.2rem)' }}
              >
                {s.num}
              </p>
              <p className="font-mono text-[9px] tracking-[2.5px] uppercase text-white/35 mt-3">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   SERVICES GRID
════════════════════════════════════════════════════════ */
function ServicesSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-14 sm:mb-18">
          <SectionEyebrow>What We Do</SectionEyebrow>
          <SectionTitle>Crafted for every milestone.</SectionTitle>
          <p className="mt-4 text-[#6B7280] text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            From intimate ceremonies to high-energy corporate events — we show up fully prepared and leave nothing to chance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.label}
                {...fadeUp(i * 0.1)}
                className="group relative p-7 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#111827] transition-all duration-500 hover:shadow-xl overflow-hidden"
              >
                {/* accent corner on hover */}
                <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-[#C8102E] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500" />
                <div className="w-11 h-11 rounded-xl bg-[#111827] flex items-center justify-center mb-5 group-hover:bg-[#C8102E] transition-colors duration-300">
                  <Icon size={18} className="text-white" strokeWidth={1.6} />
                </div>
                <h3 className="font-heading text-[#111827] text-xl mb-2 leading-tight">{svc.label}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{svc.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   TIMELINE
════════════════════════════════════════════════════════ */
function TimelineSection() {
  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionEyebrow>Our Journey</SectionEyebrow>
          <SectionTitle>Five years of firsts.</SectionTitle>
        </motion.div>

        <div className="relative">
          {/* spine line */}
          <div className="absolute left-[28px] sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-[#E5E7EB]" />

          <div className="space-y-0">
            {TIMELINE.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.year}
                  {...fadeUp(i * 0.1)}
                  className="relative flex items-start sm:items-center gap-6 sm:gap-0 py-8"
                >
                  {/* dot */}
                  <div className="absolute left-[28px] sm:left-1/2 sm:-translate-x-1/2 top-1/2 sm:top-1/2 -translate-y-1/2 z-10">
                    <div className="w-4 h-4 rounded-full bg-[#111827] border-2 border-white ring-4 ring-[#F3F4F6]" />
                  </div>

                  {/* mobile layout */}
                  <div className="pl-14 sm:hidden">
                    <span className="font-mono text-[10px] tracking-[3px] uppercase text-[#C8102E]">{item.year}</span>
                    <h3 className="font-heading text-[#111827] text-xl mt-1 mb-1.5">{item.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                  </div>

                  {/* desktop: alternating sides */}
                  <div className={`hidden sm:block w-1/2 ${isLeft ? 'pr-12 text-right' : 'pl-12 ml-auto'}`}>
                    <span className="font-mono text-[10px] tracking-[3px] uppercase text-[#C8102E]">{item.year}</span>
                    <h3 className="font-heading text-[#111827] text-2xl mt-1 mb-2">{item.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   PHILOSOPHY — dark section with three pillars
════════════════════════════════════════════════════════ */
function PhilosophySection() {
  const pillars = [
    {
      label: 'Mission',
      text: 'To be Bangladesh\'s most trusted photography brand — known not for the cameras we use, but for the stories we tell and the emotions we preserve.',
    },
    {
      label: 'Vision',
      text: 'A world where every significant human moment is captured with artistry, delivered with care, and remembered forever.',
    },
    {
      label: 'Philosophy',
      text: 'The best photographs are the ones that tell the truth of a moment. We don\'t chase perfect composition — we chase authentic feeling.',
    },
  ];

  return (
    <section
      className="py-20 sm:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #080808 0%, #111827 100%)' }}
    >
      {/* dot grid texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <SectionEyebrow>What Drives Us</SectionEyebrow>
          <SectionTitle light>Photography is an act<br/>of love.</SectionTitle>
          <p className="mt-5 text-white/45 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Not a service. Not a transaction. A genuine act of witnessing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              {...fadeUp(i * 0.12)}
              className="relative p-8 rounded-2xl overflow-hidden group"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(200,16,46,0.12) 0%, transparent 70%)' }}
              />
              <span className="font-mono text-[10px] tracking-[3px] uppercase text-[#C8102E] opacity-80">{p.label}</span>
              <p className="mt-4 text-white/65 text-sm leading-[1.85]">{p.text}</p>
              {/* bottom accent */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#C8102E]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   CTA SECTION
════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-[#F8F9FA]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div {...fadeUp()}>
          <SectionEyebrow>Ready?</SectionEyebrow>
          <SectionTitle>Let's tell your story.</SectionTitle>
          <p className="mt-5 text-[#6B7280] text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Whether it's your wedding day, a milestone birthday, or your brand's next chapter — we'd love to be there with a camera and a whole lot of care.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book"
              className="btn-primary inline-flex items-center gap-2.5"
            >
              Book a Session <ArrowRight size={14} />
            </Link>
            <Link to="/gallery" className="btn-outline inline-flex items-center gap-2.5">
              View Our Work
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
