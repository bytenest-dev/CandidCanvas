import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, Send, ExternalLink, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SOCIAL_LINKS } from '../lib/utils';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.88a8.18 8.18 0 0 0 4.78 1.52V8.00a4.85 4.85 0 0 1-1.01-.11z"/>
  </svg>
);

export default function ContactPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      alert('Please sign in to send a message.');
      return;
    }

    try {
      // Save message to Firebase
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await addDoc(collection(db, 'messages'), {
        ...data,
        userId: user.uid,
        userName: user.displayName || data.name,
        userEmail: user.email || data.email,
        status: 'unread',
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Candid Canvas BD | Book a Session | Bogura, Bangladesh</title>
        <meta name="description" content="Get in touch with Candid Canvas BD. Call, WhatsApp, or email us to book a wedding, event, corporate or reels photography session in Bangladesh." />
        <meta name="keywords" content="contact photographer bangladesh, book photography session bogura, hire photographer bogura bangladesh, candid canvas bd contact, wedding photographer booking" />
        <link rel="canonical" href="https://candid-canvas.netlify.app/contact" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Candid Canvas" />
        <meta property="og:title" content="Contact Candid Canvas BD | Book a Photography Session" />
        <meta property="og:description" content="Ready to book? Contact Candid Canvas BD via phone, WhatsApp or our online form. We cover weddings, events, corporate and reels in Bangladesh." />
        <meta property="og:url" content="https://candid-canvas.netlify.app/contact" />
        <meta property="og:image" content="https://candid-canvas.netlify.app/logo.png" />
        <meta property="og:image:alt" content="Contact Candid Canvas BD Photography" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Candid Canvas BD" />
        <meta name="twitter:description" content="Book a photography or cinematography session in Bangladesh. Wedding, events, corporate & reels. Contact us today." />
        <meta name="twitter:image" content="https://candid-canvas.netlify.app/logo.png" />

        {/* Breadcrumb + ContactPage Schema */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Candid Canvas BD",
          "description": "Contact page for Candid Canvas BD photography and cinematography services.",
          "url": "https://candid-canvas.netlify.app/contact",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://candid-canvas.netlify.app/" },
              { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://candid-canvas.netlify.app/contact" }
            ]
          },
          "mainEntity": {
            "@type": "LocalBusiness",
            "@id": "https://candid-canvas.netlify.app/#business",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+8801849244610",
              "contactType": "customer service",
              "areaServed": "BD",
              "availableLanguage": ["Bengali", "English"]
            }
          }
        })}</script>
      </Helmet>

      {/* Header */}
      <div className="pt-32 pb-16 bg-[#F8F9FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="text-xs tracking-[0.4em] uppercase text-[#6B7280] font-mono">Say Hello</span>
          <h1 className="font-heading text-[#111827] mt-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Contact Us
          </h1>
          <p className="text-[#6B7280] mt-4 max-w-lg text-sm leading-relaxed">
            Have a project in mind? We'd love to hear your story. Reach out through any channel below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="font-heading text-xl text-[#111827] mb-5">Direct Contact</h2>
              <div className="space-y-4">
                <a href={`tel:${SOCIAL_LINKS.phone}`} className="flex items-center gap-3 text-sm text-[#374151] hover:text-[#111827] transition-colors group">
                  <div className="w-10 h-10 bg-[#F8F9FA] border border-[#E5E7EB] rounded flex items-center justify-center group-hover:border-[#111827] transition-colors flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  {SOCIAL_LINKS.phone}
                </a>
                <a href={`mailto:${SOCIAL_LINKS.email}`} className="flex items-center gap-3 text-sm text-[#374151] hover:text-[#111827] transition-colors group">
                  <div className="w-10 h-10 bg-[#F8F9FA] border border-[#E5E7EB] rounded flex items-center justify-center group-hover:border-[#111827] transition-colors flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  {SOCIAL_LINKS.email}
                </a>
                <div className="flex items-center gap-3 text-sm text-[#374151]">
                  <div className="w-10 h-10 bg-[#F8F9FA] border border-[#E5E7EB] rounded flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <a href={SOCIAL_LINKS.maps} target="_blank" rel="noopener noreferrer" className="hover:text-[#111827] transition-colors hover:underline">Gohail Rd, Bogura, Bangladesh</a></div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-[#374151] mb-4">Follow & Connect</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { href: SOCIAL_LINKS.facebook, Icon: FacebookIcon, label: 'Facebook' },
                  { href: SOCIAL_LINKS.instagram, Icon: InstagramIcon, label: 'Instagram' },
                  { href: SOCIAL_LINKS.youtube, Icon: YoutubeIcon, label: 'YouTube' },
                  { href: SOCIAL_LINKS.tiktok, Icon: TikTokIcon, label: 'TikTok' },
                  { href: SOCIAL_LINKS.whatsapp, Icon: WhatsAppIcon, label: 'WhatsApp' },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] text-xs text-[#374151] rounded hover:border-[#111827] hover:text-[#111827] transition-all"
                  >
                    <Icon />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white text-sm font-medium rounded hover:bg-green-600 transition-colors"
            >
              <WhatsAppIcon />
              Quick Chat on WhatsApp
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {!user ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-[#E5E7EB] rounded-xl">
                <div className="w-16 h-16 bg-[#F8F9FA] border border-[#E5E7EB] rounded-full flex items-center justify-center mx-auto mb-5">
                  <LogIn size={24} className="text-[#6B7280]" />
                </div>
                <h3 className="font-heading text-2xl text-[#111827] mb-3">Sign In Required</h3>
                <p className="text-[#6B7280] text-sm max-w-sm mb-6">
                  Please sign in to send us a message. This helps us keep track of our conversation and respond to you directly.
                </p>
                <Link
                  to="/sign-in"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#111827] text-white text-sm font-semibold rounded-xl hover:bg-[#374151] transition-colors"
                >
                  <LogIn size={16} />
                  Sign In to Contact Us
                </Link>
                <p className="text-xs text-[#9CA3AF] mt-4">
                  Or reach us directly via{' '}
                  <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-medium hover:underline">
                    WhatsApp
                  </a>
                </p>
              </div>
            ) : submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center py-16 border border-[#E5E7EB] rounded"
              >
                <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-5">
                  <Send size={24} className="text-white" />
                </div>
                <h3 className="font-heading text-2xl text-[#111827] mb-3">Message Sent!</h3>
                <p className="text-[#6B7280] text-sm max-w-sm">
                  Thank you for reaching out. We'll get back to you within 24 hours. Looking forward to hearing your story!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm text-[#374151] underline hover:text-[#111827]"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Your Name *"
                    placeholder="e.g. Tasnim Rahman"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Phone Number"
                    placeholder="+880 1xxx-xxxxxx"
                    {...register('phone')}
                  />
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Service Interest</label>
                    <select
                      {...register('service')}
                      className="w-full border border-[#E5E7EB] rounded bg-white px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#374151] transition-all"
                    >
                      <option value="">Select a service</option>
                      <option value="wedding">Wedding Photography</option>
                      <option value="cine">Cinematography</option>
                      <option value="reels">Social Media Reels</option>
                      <option value="events">Event Coverage</option>
                      <option value="birthday">Birthday Session</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="other">Other / Custom</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">Your Message *</label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    placeholder="Tell us about your event, your vision, or any questions you have..."
                    className="w-full border border-[#E5E7EB] rounded bg-white px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#374151] transition-all resize-none"
                  />
                  {errors.message && <p className="mt-1 text-xs text-[#EF4444]">{errors.message.message}</p>}
                </div>
                <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
                  <Send size={15} className="mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
