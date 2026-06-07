import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, CalendarCheck, CheckCircle, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Phone number required'),
  eventType: z.string().min(1, 'Please select an event type'),
  package: z.string().min(1, 'Please select a package'),
  eventDate: z.string().min(1, 'Event date required'),
  eventLocation: z.string().min(3, 'Location required'),
  additionalNotes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const BOOKING_STEPS = ['Your Details', 'Event Details', 'Confirmation'];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const { user } = useAuth();
  const { packages } = useSite();
  const activePackages = packages.filter(p => p.active);

  // Auth guard — must be logged in to book
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-12 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={28} className="text-white" />
          </div>
          <h2 className="font-heading text-2xl text-[#111827] mb-3">Sign In Required</h2>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
            Please sign in to book a session with Candid Canvas BD.
          </p>
          <Link
            to="/sign-in?redirect=/book"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111827] text-white text-sm font-semibold rounded-xl hover:bg-[#374151] transition-all duration-300"
          >
            Sign In to Continue
          </Link>
          <p className="mt-6 text-xs text-[#9CA3AF]">
            Don't have an account?{' '}
            <Link to="/contact" className="text-[#374151] font-medium hover:text-[#111827] transition-colors">
              Contact us
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  const { register, handleSubmit, trigger, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
    },
  });

  const nextStep = async () => {
    const fieldsToValidate: (keyof FormData)[][] = [
      ['name', 'email', 'phone'],
      ['eventType', 'package', 'eventDate', 'eventLocation'],
    ];
    const valid = await trigger(fieldsToValidate[step]);
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      const id = `CCB-${Date.now().toString(36).toUpperCase().substring(0, 7)}`;
      
      // Save to Firestore
      await addDoc(collection(db, 'bookings'), {
        id,
        client: data.name,
        email: data.email,
        phone: data.phone,
        package: data.package,
        event: data.eventType,
        date: data.eventDate,
        location: data.eventLocation,
        notes: data.additionalNotes || '',
        status: 'submitted',
        createdAt: new Date().toISOString(),
        userId: user?.uid || '',
      });
      
      setBookingId(id);
      setSubmitted(true);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl p-12 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h2 className="font-heading text-3xl text-[#111827] mb-3">Booking Submitted!</h2>
          <p className="text-[#6B7280] text-sm mb-4 leading-relaxed">
            Your booking request has been received. We'll review your details and contact you within 24 hours.
          </p>
          <div className="bg-[#F8F9FA] rounded-lg p-4 mb-6">
            <p className="text-xs text-[#6B7280]">Booking Reference</p>
            <p className="font-mono text-lg font-bold text-[#111827] mt-1">{bookingId}</p>
          </div>
          <div className="space-y-2 text-sm text-[#6B7280]">
            <p>?? We'll reach you via WhatsApp or email</p>
            <p>?? Session date confirmation within 24 hrs</p>
            <p>? Let's create something beautiful together</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Candid Canvas BD | Book a Photography Session | Bangladesh</title>
        <meta name="description" content="Book your wedding, event, corporate or reels photography session with Candid Canvas BD. Easy online booking in Bangladesh. Confirm in 24 hours." />
        <meta name="keywords" content="book photographer bangladesh, book wedding photographer bogura, photography booking online bangladesh, hire photographer bogura bangladesh" />
        <link rel="canonical" href="https://candidcanvas.pro.bd/book" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Candid Canvas" />
        <meta property="og:title" content="Book a Photography Session | Candid Canvas BD" />
        <meta property="og:description" content="Book your photography or cinematography session online. Wedding, events, corporate & reels. Confirmation within 24 hours." />
        <meta property="og:url" content="https://candidcanvas.pro.bd/book" />
        <meta property="og:image" content="https://candidcanvas.pro.bd/logo.png" />
        <meta property="og:image:alt" content="Book a Photography Session — Candid Canvas BD" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Book a Photography Session | Candid Canvas BD" />
        <meta name="twitter:description" content="Easy online photography booking in Bangladesh. Wedding, events, corporate & reels sessions." />
        <meta name="twitter:image" content="https://candidcanvas.pro.bd/logo.png" />

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Book a Photography Session",
          "description": "Online booking page for Candid Canvas BD photography and cinematography sessions.",
          "url": "https://candidcanvas.pro.bd/book",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://candidcanvas.pro.bd/" },
              { "@type": "ListItem", "position": 2, "name": "Book a Session", "item": "https://candidcanvas.pro.bd/book" }
            ]
          }
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-[#F8F9FA] py-32 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-12 h-12 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={20} className="text-white" />
            </div>
            <h1 className="font-heading text-4xl text-[#111827]">Book A Session</h1>
            <p className="text-[#6B7280] text-sm mt-3">Let's start telling your story.</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-0 mb-10">
            {BOOKING_STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex flex-col items-center ${i <= step ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono border-2 transition-all ${
                    i < step ? 'bg-[#111827] border-[#111827] text-white'
                    : i === step ? 'border-[#111827] text-[#111827]'
                    : 'border-[#E5E7EB] text-[#9CA3AF]'
                  }`}>
                    {i < step ? '?' : i + 1}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{s}</span>
                </div>
                {i < BOOKING_STEPS.length - 1 && (
                  <div className={`w-16 sm:w-24 h-px mx-2 transition-all ${i < step ? 'bg-[#111827]' : 'bg-[#E5E7EB]'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 0: Personal Details */}
              {step === 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 space-y-5">
                  <h2 className="font-heading text-xl text-[#111827] mb-1">Your Details</h2>
                  <p className="text-[#6B7280] text-sm mb-5">Tell us a bit about yourself.</p>
                  <Input label="Full Name *" placeholder="Your name" error={errors.name?.message} {...register('name')} />
                  <Input label="Email Address *" type="email" placeholder="you@email.com" error={errors.email?.message} {...register('email')} />
                  <Input label="Phone / WhatsApp *" placeholder="+880 1xxx-xxxxxx" error={errors.phone?.message} {...register('phone')} />
                </motion.div>
              )}

              {/* Step 1: Event Details */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 space-y-5">
                  <h2 className="font-heading text-xl text-[#111827] mb-1">Event Details</h2>
                  <p className="text-[#6B7280] text-sm mb-5">Tell us about your event.</p>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Event Type *</label>
                    <select {...register('eventType')} className="w-full border border-[#E5E7EB] rounded bg-white px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#374151]">
                      <option value="">Select event type</option>
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="festival">Festival</option>
                      <option value="outdoor">Outdoor Session</option>
                      <option value="reels">Social Media Reels</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.eventType && <p className="mt-1 text-xs text-[#EF4444]">{errors.eventType.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Package *</label>
                    <select {...register('package')} className="w-full border border-[#E5E7EB] rounded bg-white px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#374151]">
                      <option value="">Select a package</option>
                      {activePackages.length > 0 ? (
                        activePackages.map(pkg => (
                          <option key={pkg.id} value={pkg.name}>
                            {pkg.name} — ৳{pkg.price}{pkg.popular ? ' ⭐ Popular' : ''}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="essentials">Essentials — ৳15,000</option>
                          <option value="signature">Signature — ৳35,000 ⭐ Popular</option>
                          <option value="prestige">Prestige — ৳65,000</option>
                          <option value="reels">Reels Only — ৳8,000</option>
                          <option value="corporate">Corporate Event — ৳25,000</option>
                          <option value="birthday">Birthday Special — ৳12,000</option>
                          <option value="custom">Custom Package</option>
                        </>
                      )}
                    </select>
                    {errors.package && <p className="mt-1 text-xs text-[#EF4444]">{errors.package.message}</p>}
                  </div>
                  <Input label="Event Date *" type="date" error={errors.eventDate?.message} {...register('eventDate')} />
                  <Input label="Event Location *" placeholder="e.g. Gulshan, Dhaka" error={errors.eventLocation?.message} {...register('eventLocation')} />
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Additional Notes</label>
                    <textarea
                      {...register('additionalNotes')}
                      rows={3}
                      placeholder="Any special requests, vision, or details we should know..."
                      className="w-full border border-[#E5E7EB] rounded bg-white px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#374151] resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8">
                  <h2 className="font-heading text-xl text-[#111827] mb-1">Review & Confirm</h2>
                  <p className="text-[#6B7280] text-sm mb-6">Please review your booking details before submitting.</p>
                  <div className="bg-[#F8F9FA] rounded-lg p-5 space-y-3 text-sm">
                    {[
                      { label: 'Name', val: getValues('name') },
                      { label: 'Email', val: getValues('email') },
                      { label: 'Phone', val: getValues('phone') },
                      { label: 'Event Type', val: getValues('eventType') },
                      { label: 'Package', val: getValues('package') },
                      { label: 'Event Date', val: getValues('eventDate') },
                      { label: 'Location', val: getValues('eventLocation') },
                    ].map(({ label, val }) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-[#6B7280]">{label}</span>
                        <span className="text-[#111827] font-medium capitalize">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 border border-[#E5E7EB] rounded bg-white">
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      By submitting, you confirm your interest in a session. Our team will review and contact you within 24 hours to confirm availability and discuss details.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="px-8 pb-8 flex items-center justify-between gap-4">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="px-6 py-2.5 text-sm text-[#6B7280] border border-[#E5E7EB] rounded hover:border-[#374151] hover:text-[#111827] transition-all"
                  >
                    Back
                  </button>
                ) : <div />}

                {step < 2 ? (
                  <Button type="button" onClick={nextStep} size="lg">
                    Continue ?
                  </Button>
                ) : (
                  <Button type="submit" loading={isSubmitting} size="lg">
                    <CalendarCheck size={16} className="mr-2" />
                    Submit Booking
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
