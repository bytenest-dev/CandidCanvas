import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye, Heart, Award, Clock, Users, Zap } from 'lucide-react';

const REASONS = [
  {
    icon: Eye,
    title: 'Storytelling First',
    desc: 'We see every event as a narrative waiting to be told. Our photographers are trained to capture the invisible — the glances, the tears, the laughter.',
  },
  {
    icon: Heart,
    title: 'Emotional Depth',
    desc: 'We don\'t just document events. We feel them. Every delivery carries the weight of the moment, preserved with care.',
  },
  {
    icon: Award,
    title: 'Editorial Quality',
    desc: 'Every image is post-processed to editorial magazine standards — cinematic color grades, precise retouching, and pixel-perfect delivery.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    desc: 'We respect your timelines as much as we respect your moments. Previews within 48 hours, full delivery on schedule.',
  },
  {
    icon: Users,
    title: 'Dedicated Team',
    desc: 'A collaborative team of photographers, cinematographers, and editors — each bringing expertise to their craft.',
  },
  {
    icon: Zap,
    title: 'Modern Workflow',
    desc: 'Online booking, digital delivery, client portals, and real-time status updates. Photography meets seamless technology.',
  },
];

export default function WhyUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 lg:py-32 relative overflow-hidden bg-white">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(99,102,241,0.05) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(16,185,129,0.04) 0%, transparent 50%)',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <span className="text-xs tracking-[0.4em] uppercase text-[#6B7280] font-mono">Why Choose Us</span>
            <h2 className="font-heading text-[#111827] mt-3 leading-tight" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)' }}>
              Not Just
              <br />
              <span className="italic text-[#6B7280]">Another</span>
              <br />
              Studio.
            </h2>
            <p className="text-[#6B7280] mt-6 text-sm leading-relaxed">
              Candid Canvas BD was built on a single belief: that photography's highest purpose is not aesthetics — it's preservation of the human story.
            </p>
            <div className="mt-8 h-px bg-gradient-to-r from-[#E5E7EB] to-transparent" />
            <div className="mt-8 flex items-center gap-4 sm:gap-6 flex-wrap">
              <div>
                <div className="font-heading text-3xl text-[#111827]">500+</div>
                <div className="text-xs text-[#6B7280] tracking-wide mt-1">Happy Clients</div>
              </div>
              <div className="w-px h-12 bg-[#E5E7EB]" />
              <div>
                <div className="font-heading text-3xl text-[#111827]">4+</div>
                <div className="text-xs text-[#6B7280] tracking-wide mt-1">Years Active</div>
              </div>
              <div className="w-px h-12 bg-[#E5E7EB]" />
              <div>
                <div className="font-heading text-3xl text-[#111827]">98%</div>
                <div className="text-xs text-[#6B7280] tracking-wide mt-1">Satisfaction</div>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {REASONS.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="group p-5 sm:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-default"
                  style={{
                    background: 'rgba(248,249,250,0.85)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(229,231,235,0.8)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)',
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(17,24,39,0.08)' }}>
                    <Icon size={18} className="text-[#374151] group-hover:text-[#111827] transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-[#111827] text-sm mb-2">{r.title}</h3>
                  <p className="text-[#6B7280] text-xs leading-relaxed">{r.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
