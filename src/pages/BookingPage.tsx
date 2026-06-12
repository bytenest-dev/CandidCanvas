import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Camera, CalendarCheck, CheckCircle, Lock, User,
  Calendar, FileText, ArrowRight, ArrowLeft, Edit, Tag,
} from 'lucide-react';
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
  { id: 2, label: 'Check Dates', icon: CalendarCheck },
  { id: 3, label: 'Confirm', icon: FileText },
];

async function generateBookingId(): Promise<string> {
  const { doc, runTransaction } = await import('firebase/firestore');
  const { db } = await import('../lib/firebase');
  // Global counter — format: CCB-001, CCB-002, ...
  const counterRef = doc(db, 'siteData', 'bookingCounterGlobal');
  const newNum = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    const current = counterDoc.exists() ? (counterDoc.data()?.count || 0) : 0;
    const next = current + 1;
    transaction.set(counterRef, { count: next });
    return next;
  });
  return `CCB-${String(newNum).padStart(3, '0')}`;
}

// ── Availability Calendar Component ──────────────────────────────────────────
interface AvailabilityCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

function AvailabilityCalendar({ selectedDate, onSelectDate }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [loadingDates, setLoadingDates] = useState(true);

  // Real-time listener — picks up new bookings instantly
  useEffect(() => {
    let unsub: (() => void) | null = null;
    const setup = async () => {
      setLoadingDates(true);
      try {
        const { collection, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        unsub = onSnapshot(collection(db, 'bookings'), snap => {
          const dates = new Set<string>();
          snap.docs.forEach(d => {
            const data = d.data();
            const date = data.date || data.eventDate;
            const status = data.status;
            if (date && status !== 'rejected') {
              dates.add(date);
            }
          });
          setBookedDates(dates);
          setLoadingDates(false);
        }, () => setLoadingDates(false));
      } catch {
        setLoadingDates(false);
      }
    };
    setup();
    return () => { if (unsub) unsub(); };
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      {/* Calendar header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#F8F9FA] border-b border-[#E5E7EB]">
        <button type="button" onClick={prevMonth}
          className="w-8 h-8 rounded-lg hover:bg-[#E5E7EB] flex items-center justify-center transition-colors text-[#374151]">
          ‹
        </button>
        <span className="font-semibold text-[#111827] text-sm">{monthName}</span>
        <button type="button" onClick={nextMonth}
          className="w-8 h-8 rounded-lg hover:bg-[#E5E7EB] flex items-center justify-center transition-colors text-[#374151]">
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#E5E7EB]">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-[#9CA3AF] py-2 uppercase tracking-wide">{d}</div>
        ))}
      </div>

      {/* Calendar days */}
      {loadingDates ? (
        <div className="p-8 text-center">
          <div className="w-6 h-6 border-2 border-[#E5E7EB] border-t-[#111827] rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#9CA3AF] mt-2">Loading availability...</p>
        </div>
      ) : (
        <div className="grid grid-cols-7 p-2 gap-1">
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dateObj = new Date(year, month, day);
            const isPast = dateObj < today;
            const isBooked = bookedDates.has(dateStr);
            const isSelected = dateStr === selectedDate;
            const isToday = dateObj.getTime() === today.getTime();

            return (
              <button
                type="button"
                key={dateStr}
                disabled={isPast || isBooked}
                onClick={() => onSelectDate(dateStr)}
                className={`relative h-9 w-full rounded-xl text-xs font-medium transition-all flex flex-col items-center justify-center gap-0 ${
                  isSelected
                    ? 'bg-[#111827] text-white shadow-md scale-105'
                    : isBooked
                    ? 'bg-red-50 text-red-400 cursor-not-allowed'
                    : isPast
                    ? 'text-[#D1D5DB] cursor-not-allowed'
                    : isToday
                    ? 'border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white'
                    : 'text-[#374151] hover:bg-[#F3F4F6] active:scale-95'
                }`}
                title={isBooked ? 'Already booked' : isPast ? 'Past date' : 'Available'}
              >
                {day}
                {isBooked && !isPast && (
                  <div className="w-1 h-1 rounded-full bg-red-400 absolute bottom-1" />
                )}
                {!isBooked && !isPast && (
                  <div className="w-1 h-1 rounded-full bg-green-400 absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 px-4 py-3 border-t border-[#E5E7EB] bg-[#F8F9FA]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="text-[10px] text-[#6B7280]">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-[10px] text-[#6B7280]">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111827]" />
          <span className="text-[10px] text-[#6B7280]">Selected</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const { user } = useAuth();
  const { packages } = useSite();
  const activePackages = packages.filter(p => p.active);
  const [searchParams] = useSearchParams();

  // Promo code state — auto-fill from ?ref= URL param
  const refFromUrl = searchParams.get('ref') || '';
  const pkgFromUrl = searchParams.get('pkg') || '';   // e.g. /book?pkg=Birthday
  const eventFromUrl = searchParams.get('event') || ''; // e.g. /book?event=birthday

  const [promoCode, setPromoCode] = useState(refFromUrl);
  const [referralCode, setReferralCode] = useState(refFromUrl);
  const [promoState, setPromoState] = useState<{
    loading: boolean; valid: boolean | null; error: string; discount: number; promoData: any | null;
  }>({ loading: false, valid: null, error: '', discount: 0, promoData: null });

  // Auto-validate referral code from URL on mount
  useEffect(() => {
    if (refFromUrl && refFromUrl.startsWith('REF-')) {
      setReferralCode(refFromUrl);
    }
  }, [refFromUrl]);

  const [calendarDate, setCalendarDate] = useState('');

  const { register, handleSubmit, trigger, getValues, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      package: pkgFromUrl || '',
      eventType: eventFromUrl || '',
    },
  });

  // Auto-select package and event from URL params — runs after form is initialized
  useEffect(() => {
    if (pkgFromUrl) setValue('package', pkgFromUrl.trim());
    if (eventFromUrl) setValue('eventType', eventFromUrl.trim().toLowerCase());
  }, [pkgFromUrl, eventFromUrl, setValue]);

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoState(s => ({ ...s, loading: true, valid: null, error: '' }));
    try {
      const { validatePromoCode } = await import('../lib/promoCodes');
      const result = await validatePromoCode(promoCode.trim());
      if (result.valid && result.promo) {
        setPromoState({ loading: false, valid: true, error: '', discount: result.promo.discountValue, promoData: result.promo });
      } else {
        setPromoState({ loading: false, valid: false, error: result.error || 'Invalid code', discount: 0, promoData: null });
      }
    } catch {
      setPromoState({ loading: false, valid: false, error: 'Failed to validate', discount: 0, promoData: null });
    }
  };

  // Auth guard — hooks must come before this
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#F0F2F5] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#111827] to-[#374151] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="font-heading text-3xl text-[#111827] mb-3">Sign In Required</h2>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-8">Please sign in to book a session with Candid Canvas BD.</p>
          <Link to="/sign-in?redirect=/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#111827] text-white text-sm font-semibold rounded-2xl hover:bg-[#374151] transition-all shadow-lg">
            Sign In to Continue <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const nextStep = async () => {
    const fieldsMap: (keyof FormData)[][] = [
      ['name', 'email', 'phone'],
      ['eventType', 'package', 'eventLocation', 'additionalNotes'],
    ];
    if (step < 2) {
      const valid = await trigger(fieldsMap[step] as (keyof FormData)[]);
      if (valid) setStep(s => s + 1);
    } else {
      setStep(s => s + 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setConfirming(true);
    try {
      const { addDoc, collection, getDocs, query, where } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');

      // ── SERVER-SIDE date conflict check ────────────────────────────────
      const chosenDate = calendarDate || data.eventDate;
      if (chosenDate) {
        const conflictQ = query(
          collection(db, 'bookings'),
          where('date', '==', chosenDate)
        );
        const conflictSnap = await getDocs(conflictQ);
        const hasConflict = conflictSnap.docs.some(d => {
          const s = d.data().status;
          return s !== 'rejected'; // any active booking blocks the date
        });
        if (hasConflict) {
          alert(`Sorry, ${new Date(chosenDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} is no longer available. Please go back and choose a different date.`);
          setStep(2); // send them back to calendar
          setCalendarDate('');
          setValue('eventDate', '');
          setConfirming(false);
          return;
        }
      }
      // ───────────────────────────────────────────────────────────────────

      const id = await generateBookingId();

      // Validate referral code if provided
      let referrerUid: string | null = null;
      const activeReferral = referralCode.trim().toUpperCase();
      if (activeReferral.startsWith('REF-')) {
        try {
          const { validateReferralCode } = await import('../lib/referrals');
          const refResult = await validateReferralCode(activeReferral);
          if (refResult.valid && refResult.referrerUid && refResult.referrerUid !== user?.uid) {
            referrerUid = refResult.referrerUid;
          }
        } catch { /* silent */ }
      }

      await addDoc(collection(db, 'bookings'), {
        id,
        client: data.name,
        email: data.email,
        phone: data.phone,
        package: data.package,
        event: data.eventType,
        date: calendarDate || data.eventDate,
        location: data.eventLocation,
        notes: data.additionalNotes || '',
        status: 'submitted',
        createdAt: new Date().toISOString(),
        userId: user?.uid || '',
        userPhone: data.phone,
        statusTimeline: [{
          status: 'submitted',
          timestamp: new Date().toISOString(),
          note: 'Booking submitted by client',
        }],
        paymentStatus: 'not_paid',
        promoCode: promoState.valid ? promoCode : '',
        discount: promoState.discount || 0,
        promoApplied: promoState.valid ? (promoState.promoData?.code || '') : '',
        referralCode: referrerUid ? activeReferral : '',
        referrerUid: referrerUid || '',
      });

      // Increment referrer's count and create reward notifications
      if (referrerUid && user) {
        try {
          const { doc, updateDoc, increment, addDoc: addNotif } = await import('firebase/firestore');
          // Increment referredCount on referrer's doc
          await updateDoc(doc(db, 'referrals', referrerUid), {
            referredCount: increment(1),
            earnedDiscounts: increment(1),
          });
          // Notify the referrer
          await addNotif(collection(db, 'notifications'), {
            userId: referrerUid,
            type: 'referral_reward',
            title: '🎉 Someone used your referral!',
            message: `${data.name} booked using your referral code ${activeReferral}. You'll earn a 10% discount reward once their booking is approved.`,
            read: false,
            createdAt: new Date().toISOString(),
          });
          // Notify the referee (current user)
          await addNotif(collection(db, 'notifications'), {
            userId: user.uid,
            type: 'referral_welcome',
            title: '🎁 Referral discount pending',
            message: `Your referral discount will be activated once your booking is approved. Stay tuned!`,
            read: false,
            createdAt: new Date().toISOString(),
          });
        } catch { /* silent */ }
      }

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
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-green-100 p-10 max-w-md w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, damping: 12 }}
            className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle size={36} className="text-white" />
          </motion.div>
          <h2 className="font-heading text-3xl text-[#111827] mb-2">Booking Submitted!</h2>
          <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">
            Your booking request has been received. We'll review and contact you within 24 hours.
          </p>
          <div className="bg-gradient-to-br from-[#F8F9FA] to-[#F0FDF4] rounded-2xl p-5 mb-6 border border-green-100">
            <p className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-2">Booking Reference</p>
            <p className="font-mono text-2xl font-bold text-[#111827]">{bookingId}</p>
          </div>
          <div className="space-y-3 text-left mb-6">
            {[
              { icon: '📱', bg: 'bg-green-50', text: "We'll reach you via WhatsApp or email" },
              { icon: '⏰', bg: 'bg-blue-50', text: 'Confirmation within 24 hrs' },
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
        <meta name="description" content="Book Candid Canvas BD — check availability, apply promo codes, easy 4-step booking." />
        <link rel="canonical" href="https://www.candidcanvas.pro.bd/book" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F0F4FF] pt-24 pb-16 px-4">
        <div className="max-w-xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
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
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isDone ? 'bg-[#111827] shadow-md' : isActive ? 'bg-white border-2 border-[#111827] shadow-md' : 'bg-white border-2 border-[#E5E7EB]'
                    }`}>
                      {isDone ? <CheckCircle size={16} className="text-white" /> : <Icon size={14} className={isActive ? 'text-[#111827]' : 'text-[#9CA3AF]'} />}
                    </div>
                    <span className={`text-[9px] font-medium hidden sm:block ${isActive ? 'text-[#111827]' : isDone ? 'text-[#374151]' : 'text-[#9CA3AF]'}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-8 sm:w-14 h-0.5 mx-1 mb-4 transition-all duration-500 ${i < step ? 'bg-[#111827]' : 'bg-[#E5E7EB]'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Card */}
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-xl border border-[#E5E7EB] overflow-hidden">
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

                    {/* Referral banner — shown when arriving via ref link */}
                    {referralCode.startsWith('REF-') && (
                      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                        <span className="text-xl">🎁</span>
                        <div>
                          <p className="text-sm font-semibold text-emerald-800">Referral code applied!</p>
                          <p className="text-xs text-emerald-600">You're booking via a friend's referral. You'll both get a discount once approved.</p>
                        </div>
                      </div>
                    )}

                    {/* Promo Code */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
                        <Tag size={11} /> Promo Code (Optional)
                      </label>
                      <div className="flex gap-2">
                        <input value={promoCode}
                          onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoState(s => ({ ...s, valid: null, error: '' })); }}
                          placeholder="e.g. EID25"
                          className="flex-1 border border-[#E5E7EB] rounded-xl bg-[#F8F9FA] focus:bg-white px-4 py-3 text-sm text-[#111827] uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all font-mono" />
                        <button type="button" onClick={applyPromo} disabled={promoState.loading || !promoCode.trim()}
                          className="px-4 py-3 bg-[#111827] text-white text-xs font-semibold rounded-xl hover:bg-[#374151] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                          {promoState.loading ? '...' : 'Apply'}
                        </button>
                      </div>
                      {promoState.valid === true && (
                        <p className="mt-1.5 text-xs text-green-600 font-medium flex items-center gap-1">
                          ✅ Applied! {promoState.promoData?.discountType === 'percentage' ? `${promoState.promoData.discountValue}% off` : `৳${promoState.promoData?.discountValue} off`}
                        </p>
                      )}
                      {promoState.valid === false && (
                        <p className="mt-1.5 text-xs text-red-500">❌ {promoState.error}</p>
                      )}
                    </div>
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
                      {pkgFromUrl && (
                        <div className="mb-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                          <CheckCircle size={13} className="text-blue-500 flex-shrink-0" />
                          <p className="text-xs text-blue-700 font-medium">
                            Pre-selected: <span className="font-bold">{pkgFromUrl}</span> — you can change it below
                          </p>
                        </div>
                      )}
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
                            <option value="Corporate">Corporate — ৳25,000</option>
                            <option value="Birthday Special">Birthday Special — ৳12,000</option>
                            <option value="Custom">Custom Package</option>
                          </>
                        )}
                      </select>
                      {errors.package && <p className="mt-1 text-xs text-red-500">{errors.package.message}</p>}
                    </div>
                    <Input label="Event Location *" placeholder="e.g. Gohail Rd, Bogura" error={errors.eventLocation?.message} {...register('eventLocation')} />
                    {/* Hidden eventDate — will be set from calendar */}
                    <input type="hidden" {...register('eventDate')} />
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">Additional Notes</label>
                      <textarea {...register('additionalNotes')} rows={3}
                        placeholder="Any special requests, vision, or details we should know..."
                        className="w-full border border-[#E5E7EB] rounded-xl bg-[#F8F9FA] focus:bg-white px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 — Availability Calendar */}
              {step === 2 && (
                <div className="p-7 sm:p-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center">
                      <CalendarCheck size={18} className="text-[#10B981]" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl text-[#111827]">Check Availability</h2>
                      <p className="text-[#9CA3AF] text-xs">Select your preferred event date</p>
                    </div>
                  </div>

                  <AvailabilityCalendar
                    key={`cal-step2-${step}`}
                    selectedDate={calendarDate}
                    onSelectDate={(date) => {
                      setCalendarDate(date);
                      setValue('eventDate', date);
                    }}
                  />

                  {calendarDate && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="text-sm font-semibold text-green-700">Date Selected!</p>
                        <p className="text-xs text-green-600">
                          {new Date(calendarDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {!calendarDate && (
                    <p className="mt-3 text-xs text-[#9CA3AF] text-center">Please select a date from the calendar above</p>
                  )}
                </div>
              )}

              {/* Step 3 — Review & Confirm */}
              {step === 3 && (
                <div className="p-7 sm:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#FFF7ED] rounded-xl flex items-center justify-center">
                      <FileText size={18} className="text-[#F59E0B]" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl text-[#111827]">Review & Confirm</h2>
                      <p className="text-[#9CA3AF] text-xs">Please check all details before placing your order</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Personal info */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5"><User size={10} /> Personal Info</p>
                        <button type="button" onClick={() => setStep(0)} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"><Edit size={10} /> Edit</button>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        {[['Name', vals.name], ['Email', vals.email], ['Phone', vals.phone]].map(([l, v]) => (
                          <div key={l} className="flex justify-between">
                            <span className="text-[#6B7280]">{l}</span>
                            <span className="text-[#111827] font-medium text-right truncate max-w-[60%]">{v}</span>
                          </div>
                        ))}
                        {promoState.valid === true && (
                          <div className="flex justify-between">
                            <span className="text-[#6B7280]">Promo</span>
                            <span className="text-green-600 font-semibold">{promoCode} ✅</span>
                          </div>
                        )}
                        {referralCode.startsWith('REF-') && (
                          <div className="flex justify-between">
                            <span className="text-[#6B7280]">Referral</span>
                            <span className="text-emerald-600 font-semibold">{referralCode} 🎁</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Event info */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5"><Calendar size={10} /> Event Info</p>
                        <button type="button" onClick={() => setStep(1)} className="text-xs text-amber-500 hover:text-amber-700 flex items-center gap-1"><Edit size={10} /> Edit</button>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        {[
                          ['Event Type', vals.eventType],
                          ['Package', vals.package],
                          ['Date', calendarDate ? new Date(calendarDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'],
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

                  <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      ✅ By placing this order, you confirm all details above are correct. Our team will review and contact you within <strong>24 hours</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className={`px-7 sm:px-10 pb-8 flex items-center ${step > 0 ? 'justify-between' : 'justify-end'} gap-4`}>
                {step > 0 && (
                  <button type="button" onClick={() => {
                    setStep(s => s - 1);
                    // Clear selected date when going back to calendar so it re-validates
                    if (step === 3) {
                      setCalendarDate('');
                      setValue('eventDate', '');
                    }
                  }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-2xl hover:border-[#374151] hover:text-[#111827] transition-all">
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
                {step < 3 ? (
                  <button type="button"
                    onClick={() => {
                      if (step === 2 && !calendarDate) {
                        alert('Please select a date from the calendar');
                        return;
                      }
                      nextStep();
                    }}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-8 flex-wrap">
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
