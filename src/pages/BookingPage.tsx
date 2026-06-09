import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, CalendarCheck, CheckCircle, Lock, User, MapPin, Package, Calendar, FileText, ArrowRight, ArrowLeft, Edit } from 'lucide-react';
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

const STEPS = [
  { id: 0, label: 'Your Details', icon: User },
  { id: 1, label: 'Event Details', icon: Calendar },
  { id: 2, label: 'Review', icon: FileText },
];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const { user } = useAuth();
  const { packages } = useSite();
  const activePackages = packages.filter(p => p.active);

  // Auth guard
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#F0F2F5] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] p-12 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#111827] to-[#374151] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="font-heading text-3xl text-[#111827] mb-3">Sign In Required</h2>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
            Please sign in to book a session with Candid Canvas BD.
          </p>
          <Link to="/sign-in?redirect=/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#111827] text-white text-sm font-semibold rounded-2xl hover:bg-[#374151] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Sign In to Continue <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const { register, handleSubmit, trigger, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.displayName || '', email: user?.email || '' },
  });

  const nextStep = async () => {
    const fieldsMap: (keyof FormData)[][] = [
      ['name', 'email', 'phone'],
      ['eventType', 'package', 'eventDate', 'eventLocation'],
    ];
    const valid = await trigger(fieldsMap[step]);
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = async (data: FormData) => {
    setConfirming(true);
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const id = `CCB-${Date.now().toString(36).toUpperCase().substring(0, 7)}`;
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
        userPhone: data.phone,
      });
      setBookingId(id);
      setSubmitted(true);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] to-[#F8F9FA] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-green-100 p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, damping: 12 }}
            className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle size={36} className="text-white" />
          </motion.div>
          <h2 className="font-heading text-3xl text-[#111827] mb-2">Booking Submitted!</h2>
          <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">
            Your booking request has been received. We'll review your details and contact you within 24 hours.
          </p>
          <div className="bg-gradient-to-br from-[#F8F9FA] to-[#F0FDF4] rounded-2xl p-5 mb-6 border border-green-100">
            <p className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-2">Booking Reference</p>
            <p className="font-mono text-2xl font-bold text-[#111827]">{bookingId}</p>
          </div>
          <div className="space-y-3 text-left mb-6">
            {[
              { icon: '📱', bg: 'bg-green-50', text: "We'll reach you via WhatsApp or email" },
              { icon: '⏰', bg: 'bg-blue-50', text: 'Session date confirmation within 24 hrs' },
              { icon: '✨', bg: 'bg-purple-50', text: "Let's create something beautiful together" },
            ].map(({ icon, bg, text }) => (
              <div key={text} className={`flex items-center gap-3 ${bg} rounded-xl p-3`}>
                <span className="text-lg">{icon}</span>
                <p className="text-sm text-[#374151]">{text}</p>
              </div>
            ))}
          </div>
          <Link to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#111827] text-white text-sm font-semibold rounded-2xl hover:bg-[#374151] transition-all">
            View My Bookings <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const vals = getValues();

  return (
    <>
      <Helmet>
        <title>Book Candid Canvas BD | Online Photography Booking Bangladesh</title>
        <meta name="description" content="Book Candid Canvas BD online — Bangladesh's best photography studio. Easy booking, 24-hour confirmation." />
        <link rel="canonical" href="https://www.candidcanvas.pro.bd/book" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F0F4FF] pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-[#111827] to-[#374151] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Camera size={22} className="text-white" />
            </div>
            <h1 className="font-heading text-4xl text-[#111827]">Book A Session</h1>
            <p className="text-[#6B7280] text-sm mt-2">Let's start preserving your special moments.</p>
          </motion.div>

          {/* Step Progress */}
          <div className="flex items-center justify-center mb-8 px-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isDone ? 'bg-[#111827] shadow-md' :
                      isActive ? 'bg-white border-2 border-[#111827] shadow-md' :
                      'bg-white border-2 border-[#E5E7EB]'
                    }`}>
                      {isDone
                        ? <CheckCircle size={18} className="text-white" />
                        : <Icon size={16} className={isActive ? 'text-[#111827]' : 'text-[#9CA3AF]'} />
                      }
                    </div>
                    <span className={`text-[10px] font-medium hidden sm:block ${isActive ? 'text-[#111827]' : isDone ? 'text-[#374151]' : 'text-[#9CA3AF]'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-12 sm:w-20 h-0.5 mx-2 mb-4 transition-all duration-500 ${i < step ? 'bg-[#111827]' : 'bg-[#E5E7EB]'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-xl border border-[#E5E7EB] overflow-hidden"
          >
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* Step 0 — Your Details */}
              {step === 0 && (
                <div className="p-7 sm:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#F0F4FF] rounded-xl flex items-center justify-center">
                      <User size={18} className="text-[#4F46E5]" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl text-[#111827]">Your Details</h2>
                      <p className="text-[#9CA3AF] text-xs">Tell us a bit about yourself</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <Input label="Full Name *" placeholder="Your full name" error={errors.name?.message} {...register('name')} />
                    <Input label="Email Address *" type="email" placeholder="you@email.com" error={errors.email?.message} {...register('email')} />
                    <Input label="Phone / WhatsApp *" placeholder="+880 1xxx-xxxxxx" error={errors.phone?.message} {...register('phone')} />
                  </div>
                </div>
              )}

              {/* Step 1 — Event Details */}
              {step === 1 && (
                <div className="p-7 sm:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#FFF7ED] rounded-xl flex items-center justify-center">
                      <Calendar size={18} className="text-[#F59E0B]" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl text-[#111827]">Event Details</h2>
                      <p className="text-[#9CA3AF] text-xs">Tell us about your event</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">Event Type *</label>
                      <select {...register('eventType')} className="w-full border border-[#E5E7EB] rounded-xl bg-[#F8F9FA] focus:bg-white px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all">
                        <option value="">Select event type</option>
                        {['Wedding', 'Birthday', 'Corporate Event', 'Festival', 'Outdoor Session', 'Social Media Reels', 'Pre-Wedding', 'Other'].map(e => (
                          <option key={e} value={e.toLowerCase()}>{e}</option>
                        ))}
                      </select>
                      {errors.eventType && <p className="mt-1 text-xs text-red-500">{errors.eventType.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">Package *</label>
                      <select {...register('package')} className="w-full border border-[#E5E7EB] rounded-xl bg-[#F8F9FA] focus:bg-white px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all">
                        <option value="">Select a package</option>
                        {activePackages.length > 0 ? (
                          activePackages.map(pkg => (
                            <option key={pkg.id} value={pkg.name}>{pkg.name} — {pkg.price}{pkg.popular ? ' ⭐' : ''}</option>
                          ))
                        ) : (
                          <>
                            <option value="Essentials">Essentials — ৳15,000</option>
                            <option value="Signature">Signature — ৳35,000 ⭐</option>
                            <option value="Prestige">Prestige — ৳65,000</option>
                            <option value="Reels Only">Reels Only — ৳8,000</option>
                            <option value="Corporate">Corporate Event — ৳25,000</option>
                            <option value="Birthday Special">Birthday Special — ৳12,000</option>
                            <option value="Custom">Custom Package</option>
                          </>
                        )}
                      </select>
                      {errors.package && <p className="mt-1 text-xs text-red-500">{errors.package.message}</p>}
                    </div>
                    <Input label="Event Date *" type="date" error={errors.eventDate?.message} {...register('eventDate')} />
                    <Input label="Event Location *" placeholder="e.g. Gohail Rd, Bogura" error={errors.eventLocation?.message} {...register('eventLocation')} />
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">Additional Notes</label>
                      <textarea {...register('additionalNotes')} rows={3}
                        placeholder="Any special requests, vision, or details we should know..."
                        className="w-full border border-[#E5E7EB] rounded-xl bg-[#F8F9FA] focus:bg-white px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 — Review & Confirm */}
              {step === 2 && (
                <div className="p-7 sm:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center">
                      <FileText size={18} className="text-[#10B981]" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl text-[#111827]">Review & Confirm</h2>
                      <p className="text-[#9CA3AF] text-xs">Please check all details before placing your order</p>
                    </div>
                  </div>

                  {/* Review cards */}
                  <div className="space-y-4 mb-6">
                    {/* Personal info */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5"><User size={10} /> Personal Info</p>
                        <button type="button" onClick={() => setStep(0)} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                          <Edit size={10} /> Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {[['Name', vals.name], ['Email', vals.email], ['Phone', vals.phone]].map(([l, v]) => (
                          <div key={l} className="flex justify-between">
                            <span className="text-[#6B7280]">{l}</span>
                            <span className="text-[#111827] font-medium text-right truncate max-w-[60%]">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Event info */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5"><Calendar size={10} /> Event Info</p>
                        <button type="button" onClick={() => setStep(1)} className="text-xs text-amber-500 hover:text-amber-700 flex items-center gap-1">
                          <Edit size={10} /> Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {[
                          ['Event Type', vals.eventType],
                          ['Package', vals.package],
                          ['Date', vals.eventDate],
                          ['Location', vals.eventLocation],
                          ...(vals.additionalNotes ? [['Notes', vals.additionalNotes]] : []),
                        ].map(([l, v]) => (
                          <div key={l} className="flex justify-between gap-4">
                            <span className="text-[#6B7280] flex-shrink-0">{l}</span>
                            <span className="text-[#111827] font-medium capitalize text-right">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Terms note */}
                  <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-[#E5E7EB] mb-2">
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      ✅ By placing this order, you confirm all details above are correct. Our team will review and contact you within <strong>24 hours</strong> to confirm availability.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className={`px-7 sm:px-10 pb-8 flex items-center ${step > 0 ? 'justify-between' : 'justify-end'} gap-4`}>
                {step > 0 && (
                  <button type="button" onClick={() => setStep(s => s - 1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-2xl hover:border-[#374151] hover:text-[#111827] transition-all">
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
                {step < 2 ? (
                  <button type="button" onClick={nextStep}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-[#111827] text-white text-sm font-semibold rounded-2xl hover:bg-[#374151] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95">
                    Continue <ArrowRight size={14} />
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting || confirming}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-sm font-bold rounded-2xl hover:from-[#059669] hover:to-[#047857] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0">
                    {(isSubmitting || confirming) ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</>
                    ) : (
                      <><CalendarCheck size={16} /> Place Order</>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-8 flex-wrap"
          >
            {[
              { icon: '🔒', text: 'Secure Booking' },
              { icon: '⏱️', text: '24hr Response' },
              { icon: '⭐', text: '98% Satisfaction' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </>
  );
}
