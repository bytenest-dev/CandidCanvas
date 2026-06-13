import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Camera, Target, Eye, Heart, Award, Users } from 'lucide-react';

const TIMELINE = [
  { year: '2020', title: 'The Beginning', desc: 'Candid Canvas BD was founded with a single camera and an unwavering belief in the power of visual storytelling.' },
  { year: '2021', title: 'First 100 Weddings', desc: 'Reached a milestone of 100 wedding projects, establishing our reputation for cinematic, emotional wedding photography.' },
  { year: '2022', title: 'Cinematography Launch', desc: 'Expanded into full cinematography and social media reels production, bringing our storytelling to the digital world.' },
  { year: '2023', title: 'Corporate & Events', desc: 'Added corporate event coverage to our portfolio, serving brands across Dhaka and beyond.' },
  { year: '2024', title: '500+ Projects', desc: 'Crossed 500 projects milestone with a satisfaction rate above 98%. Our story continues.' },
];

const TEAM = [
  {
    name: 'Md. Farhan',
    role: 'Lead Photographer & Creative Director',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: '6 years of photographic experience with a passion for capturing raw human emotion.',
  },
  {
    name: 'Tasnim Akter',
    role: 'Cinematographer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    bio: 'Cinematic storyteller who transforms ordinary events into extraordinary films.',
  },
  {
    name: 'Rafiq Islam',
    role: 'Photo Editor & Colorist',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Master of light and color who gives every image its signature editorial quality.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Candid Canvas BD | Best Photography Studio Story | Bogura Bangladesh</title>
        <meta name="description" content="Meet the team behind Candid Canvas BD — Bangladesh's premier photography studio. 500+ projects, 4+ years of wedding photography &amp; cinematography excellence. Our story, philosophy and creative vision in Bogura, Bangladesh." />
        <meta name="keywords" content="about candid canvas bd, about candid canvas, candid canvas bd team, photography studio bangladesh story, best photographer bangladesh, wedding photographer bogura team, professional photographer bangladesh, photography studio bogura, candid canvas history, candid canvas founders" />
        <link rel="canonical" href="https://www.candidcanvas.pro.bd/about" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Candid Canvas BD" />
        <meta property="og:title" content="About Candid Canvas BD | Our Story, Team &amp; Vision" />
        <meta property="og:description" content="500+ projects, 4+ years of excellence. Meet the team behind Bangladesh's best photography studio — Candid Canvas BD, Bogura." />
        <meta property="og:url" content="https://www.candidcanvas.pro.bd/about" />
        <meta property="og:image" content="https://www.candidcanvas.pro.bd/logo.png" />
        <meta property="og:image:alt" content="Candid Canvas BD Photography Team" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Candid Canvas BD | Our Story &amp; Team" />
        <meta name="twitter:description" content="500+ projects. 4+ years. Meet the team behind Bangladesh's best photography studio — Candid Canvas BD." />
        <meta name="twitter:image" content="https://www.candidcanvas.pro.bd/logo.png" />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Candid Canvas BD — Photography Studio Bangladesh",
          "description": "Learn about Candid Canvas BD — our story, philosophy, team, and vision for premium photography in Bangladesh.",
          "url": "https://www.candidcanvas.pro.bd/about",
          "isPartOf": { "@id": "https://www.candidcanvas.pro.bd/#website" },
          "about": { "@id": "https://www.candidcanvas.pro.bd/#business" },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.candidcanvas.pro.bd/" },
              { "@type": "ListItem", "position": 2, "name": "About", "item": "https://www.candidcanvas.pro.bd/about" }
            ]
          }
        })}</script>
      </Helmet>

      {/* Hero */}
      <div className="relative pt-32 pb-24 bg-[#080808] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1600&q=80" alt="" role="presentation" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-[#080808]/60" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-xs tracking-[0.4em] uppercase text-white/40 font-mono">Our Story</span>
            <h1 className="font-heading text-white mt-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              About Candid Canvas BD
            </h1>
            <p className="text-white/60 mt-6 text-base leading-relaxed max-w-2xl mx-auto">
              We are a team of visual storytellers based in Bogura, Bangladesh. Our mission is simple: to preserve the moments that define you, through photography that feels like memory.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Philosophy */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              { icon: Target, title: 'Mission', text: 'To be Bangladesh\'s most trusted photography brand — known not for the cameras we use, but for the stories we tell and the emotions we preserve.' },
              { icon: Eye, title: 'Vision', text: 'A world where every significant human moment is captured with artistry, delivered with care, and remembered forever.' },
              { icon: Heart, title: 'Philosophy', text: 'Photography is not about taking pictures. It\'s about seeing the world through the lens of emotion — and honoring the beauty in every ordinary moment.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.7 }}
                  className="text-center p-8 border border-[#E5E7EB] rounded hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-5">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-heading text-xl text-[#111827] mb-3">{item.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '500+', label: 'Projects' },
              { num: '4+', label: 'Years Active' },
              { num: '98%', label: 'Satisfaction' },
              { num: '3', label: 'Core Team' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-heading text-4xl text-white">{s.num}</div>
                <div className="text-white/40 text-xs tracking-widest uppercase mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.4em] uppercase text-[#6B7280] font-mono">Our Journey</span>
            <h2 className="font-heading text-[#111827] mt-3 text-4xl">The Timeline</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[#E5E7EB]" />
            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="flex gap-8 pl-20 relative"
                >
                  <div className="absolute left-8 w-8 h-8 bg-[#111827] rounded-full flex items-center justify-center -translate-x-1/2">
                    <Camera size={14} className="text-white" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-[#6B7280] tracking-widest">{item.year}</span>
                    <h3 className="font-heading text-xl text-[#111827] mt-1">{item.title}</h3>
                    <p className="text-[#6B7280] text-sm mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.4em] uppercase text-[#6B7280] font-mono">The People</span>
            <h2 className="font-heading text-[#111827] mt-3 text-4xl">Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-5 rounded-full overflow-hidden">
                  <img src={member.image} alt={`${member.name} — ${member.role} at Candid Canvas BD`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
                <h3 className="font-heading text-xl text-[#111827]">{member.name}</h3>
                <p className="text-xs text-[#6B7280] tracking-wide mt-1 mb-3">{member.role}</p>
                <p className="text-[#6B7280] text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-[#F8F9FA] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-[#111827] text-3xl">Achievements & Recognition</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              '500+ Projects Delivered',
              '98% Client Retention',
              'Top Photography Studio — Dhaka 2023',
              '4+ Years of Excellence',
              'Certified Professional Photographers',
            ].map((ach) => (
              <div key={ach} className="flex items-center gap-2.5 bg-white px-5 py-3 rounded-full border border-[#E5E7EB] text-sm text-[#374151]">
                <Award size={14} className="text-[#111827]" />
                {ach}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
