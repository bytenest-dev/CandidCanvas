import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { SOCIAL_LINKS } from '../../lib/utils';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs tracking-[0.4em] uppercase text-[#6B7280] font-mono">Get In Touch</span>
            <h2 className="font-heading text-[#111827] mt-3 mb-6" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)' }}>
              Let's Create
              <br />
              Something Beautiful
            </h2>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-10">
              Whether you're planning a wedding, a corporate event, or simply want to preserve a moment that matters — we'd love to hear your story.
            </p>

            <div className="space-y-5">
              <a href={`tel:${SOCIAL_LINKS.phone}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white border border-[#E5E7EB] rounded flex items-center justify-center group-hover:border-[#111827] transition-colors">
                  <Phone size={18} className="text-[#374151]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">Phone / WhatsApp</p>
                  <p className="text-sm font-medium text-[#111827]">{SOCIAL_LINKS.phone}</p>
                </div>
              </a>
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white border border-[#E5E7EB] rounded flex items-center justify-center group-hover:border-[#111827] transition-colors">
                  <Mail size={18} className="text-[#374151]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">Email</p>
                  <p className="text-sm font-medium text-[#111827]">{SOCIAL_LINKS.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white border border-[#E5E7EB] rounded flex items-center justify-center">
                  <MapPin size={18} className="text-[#374151]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">Location</p>
                  <p className="text-sm font-medium text-[#111827]">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2.5 px-6 py-3 bg-[#25D366] text-white text-sm font-medium rounded hover:bg-green-600 transition-colors"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
              <ExternalLink size={13} />
            </a>
          </motion.div>

          {/* Right — Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="rounded overflow-hidden border border-[#E5E7EB] aspect-square">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233667.8223950959!2d90.27923821870657!3d23.780573297952475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2s!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Candid Canvas BD Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
