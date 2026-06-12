import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Camera, CalendarCheck, Star, Bell, User, LogOut, Clock, CheckCircle,
  Menu, X, Send, MessageSquare, Package, ChevronRight, RefreshCw,
  MapPin, Calendar, FileText, AlertCircle, Sparkles, Gift, Copy, Share2, XCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { getStatusColor, getStatusLabel, formatDate } from '../lib/utils';
import UserAvatar from '../components/ui/UserAvatar';

interface Booking {
  id: string;
  packageName: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  status: string;
  createdAt: string;
  notes?: string;
}

const STATUS_STEPS = ['submitted', 'under_review', 'contacted', 'approved', 'completed'];

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Review',
  contacted: 'Contacted',
  approved: 'Approved',
  completed: 'Done',
};

function StatusTimeline({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  const isRejected = status === 'rejected';
  return (
    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
      {STATUS_STEPS.map((s, i) => {
        const passed = !isRejected && i <= currentIdx;
        const isCurrent = !isRejected && i === currentIdx;
        return (
          <div key={s} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ring-2 ${
                  isCurrent
                    ? 'bg-[#111827] text-white ring-[#111827]/20 scale-110'
                    : passed
                    ? 'bg-[#111827] text-white ring-transparent'
                    : 'bg-[#F3F4F6] text-[#9CA3AF] ring-transparent'
                }`}
              >
                {passed && !isCurrent ? (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className={`text-[9px] font-medium whitespace-nowrap hidden sm:block ${passed ? 'text-[#374151]' : 'text-[#9CA3AF]'}`}>
                {STATUS_LABELS[s]}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-0.5 w-5 sm:w-8 rounded-full mb-3 ${passed && i < currentIdx ? 'bg-[#111827]' : 'bg-[#E5E7EB]'}`} />
            )}
          </div>
        );
      })}
      {isRejected && (
        <span className="ml-2 inline-flex items-center gap-1 text-xs text-red-600 font-semibold bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
          <X size={10} /> Rejected
        </span>
      )}
      {status === 'cancel_requested' && (
        <span className="ml-2 inline-flex items-center gap-1 text-xs text-orange-600 font-semibold bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
          ⏳ Cancellation Pending Admin Review
        </span>
      )}
    </div>
  );
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Camera },
  { id: 'bookings', label: 'My Bookings', icon: CalendarCheck },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'referral', label: 'Referral', icon: Gift },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
];

// ── Sidebar extracted outside to avoid remount ──────────────────────────────
interface SidebarProps {
  user: { displayName?: string; email?: string; photoURL?: string } | null;
  activeTab: string;
  setActiveTab: (t: string) => void;
  setMobileNavOpen: (v: boolean) => void;
  onLogout: () => void;
  unreadMessages: number;
  unreadNotifications: number;
}

function DashSidebar({ user, activeTab, setActiveTab, setMobileNavOpen, onLogout, unreadMessages, unreadNotifications }: SidebarProps) {
  return (
    <>
      <div className="p-5 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-3">
          <UserAvatar
            photoURL={user?.photoURL}
            displayName={user?.displayName}
            size="lg"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#111827] truncate">{user?.displayName || 'User'}</p>
            <p className="text-xs text-[#9CA3AF] truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setMobileNavOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all font-medium ${
              activeTab === id
                ? 'bg-[#111827] text-white shadow-sm'
                : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <Icon size={15} />
            <span className="flex-1 text-left">{label}</span>
            {id === 'messages' && unreadMessages > 0 && (
              <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center">
                {unreadMessages}
              </span>
            )}
            {id === 'notifications' && unreadNotifications > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center">
                {unreadNotifications}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-[#F0F0F0]">
        <Link
          to="/book"
          onClick={() => setMobileNavOpen(false)}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[#111827] text-white hover:bg-[#1f2937] transition-colors mb-1.5 justify-center"
        >
          <Package size={14} /> Book a Session
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { reviews, setReviews, packages } = useSite();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Review modal state
  const [reviewModal, setReviewModal] = useState<{ bookingId: string; packageName: string; eventType: string } | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedBookings, setReviewedBookings] = useState<Set<string>>(new Set());
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Message state
  interface UserMessage {
    id: string;
    subject: string;
    message: string;
    status: 'unread' | 'read';
    createdAt: string;
    service?: string;
    reply?: string;
  }
  const [userMessages, setUserMessages] = useState<UserMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ subject: '', message: '', service: '' });
  const [contactSending, setContactSending] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [viewMessage, setViewMessage] = useState<UserMessage | null>(null);

  // Notifications state
  interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
  }
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notiLoading, setNotiLoading] = useState(true);

  // Referral state
  const [referral, setReferral] = useState<{ code: string; referredCount: number; earnedDiscounts: number } | null>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Cancellation state
  const [cancelModal, setCancelModal] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  // ── Load bookings ────────────────────────────────────────────────────────
  const loadBookings = useCallback(async () => {
    if (!user) return;
    try {
      const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      let data: Booking[] = [];
      const mapDoc = (doc: { id: string; data: () => Record<string, string> }): Booking => {
        const d = doc.data();
        return {
          id: d.id || doc.id,
          packageName: d.package || d.packageName || '',
          eventType: d.event || d.eventType || '',
          eventDate: d.date || d.eventDate || '',
          eventLocation: d.location || d.eventLocation || '',
          status: d.status || 'submitted',
          createdAt: d.createdAt || '',
          notes: d.notes || '',
        };
      };
      try {
        // Try with composite index (userId + orderBy createdAt)
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        data = snapshot.docs.map(mapDoc);
      } catch {
        // Fallback: filter without orderBy (no index needed)
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        data = snapshot.docs.map(mapDoc);
        data.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
      }
      setBookings(data);
    } catch {
      // Silent — permission denied or network error
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ── Load user messages ───────────────────────────────────────────────────
  const loadMessages = useCallback(async () => {
    if (!user) return;
    try {
      setMessagesLoading(true);
      const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      let msgs: UserMessage[] = [];
      const mapMsg = (doc: { id: string; data: () => Record<string, string> }): UserMessage => {
        const d = doc.data();
        return {
          id: doc.id,
          subject: d.service || d.subject || 'General Inquiry',
          message: d.message || '',
          status: (d.status as 'unread' | 'read') || 'unread',
          createdAt: d.createdAt || '',
          service: d.service || '',
          reply: d.reply || '',
        };
      };
      try {
        const q = query(
          collection(db, 'messages'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        msgs = snapshot.docs.map(mapMsg);
      } catch {
        // Fallback without orderBy
        const q = query(collection(db, 'messages'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        msgs = snapshot.docs.map(mapMsg);
        msgs.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
      }
      setUserMessages(msgs);
    } catch {
      // Silent — permission denied
    } finally {
      setMessagesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadBookings();
    loadMessages();
  }, [loadBookings, loadMessages]);

  // ── Real-time notifications ──────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    let unsub: (() => void) | null = null;
    const setup = async () => {
      setNotiLoading(true);
      try {
        const { collection, query, where, orderBy, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        const q = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        unsub = onSnapshot(q, snap => {
          setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notification)));
          setNotiLoading(false);
        }, () => setNotiLoading(false));
      } catch { setNotiLoading(false); }
    };
    setup();
    return () => { if (unsub) unsub(); };
  }, [user]);

  // ── Load referral code ───────────────────────────────────────────────────
  const loadReferral = useCallback(async () => {
    if (!user) return;
    setReferralLoading(true);
    try {
      const { getOrCreateReferral } = await import('../lib/referrals');
      const data = await getOrCreateReferral(user.uid, user.displayName || 'User');
      setReferral({ code: data.code, referredCount: data.referredCount, earnedDiscounts: data.earnedDiscounts });
    } catch { /* silent */ }
    finally { setReferralLoading(false); }
  }, [user]);

  useEffect(() => { loadReferral(); }, [loadReferral]);

  const markNotificationsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (!unread.length) return;
    try {
      const { doc, writeBatch } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const batch = writeBatch(db);
      unread.forEach(n => batch.update(doc(db, 'notifications', n.id), { read: true }));
      await batch.commit();
    } catch { /* silent */ }
  };

  const cancelBooking = async () => {
    if (!cancelModal || !user) return;
    setCancelSubmitting(true);
    try {
      const { collection, query, where, getDocs, updateDoc, addDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const q = query(collection(db, 'bookings'), where('id', '==', cancelModal.id));
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(snap.docs[0].ref, {
          status: 'cancel_requested',
          cancelledByClient: true,
          cancelReason: cancelReason.trim() || 'Cancelled by client',
          cancelledAt: new Date().toISOString(),
        });
      }
      setBookings(prev => prev.map(b => b.id === cancelModal.id ? { ...b, status: 'cancel_requested' } : b));
      // Notify client
      await addDoc(collection(db, 'notifications'), {
        userId: user.uid,
        type: 'cancel_requested',
        title: '⏳ Cancellation Request Sent',
        message: `Your cancellation request for booking ${cancelModal.id} has been sent to our team. We will contact you to confirm. Do not worry — your booking is still active until we respond.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
      setCancelModal(null);
      setCancelReason('');
    } catch { /* silent */ }
    finally { setCancelSubmitting(false); }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadBookings(), loadMessages()]);
    setRefreshing(false);
  };

  // ── Submit review ────────────────────────────────────────────────────────
  const submitReview = async () => {
    if (!reviewModal || !reviewComment.trim() || !user) return;
    try {
      setReviewSubmitting(true);
      const newReview = {
        id: `rev-${Date.now()}-${user.uid.slice(0, 6)}`,
        name: user.displayName || 'Anonymous',
        rating: reviewRating,
        comment: reviewComment.trim(),
        service: `${reviewModal.packageName} — ${reviewModal.eventType}`,
        approved: false,
        createdAt: new Date().toISOString(),
      };
      await setReviews([...reviews, newReview]);
      setReviewedBookings(prev => new Set([...prev, reviewModal.bookingId]));
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewModal(null);
        setReviewComment('');
        setReviewRating(5);
        setReviewSuccess(false);
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // ── Send contact message ─────────────────────────────────────────────────
  const sendContactMessage = async () => {
    if (!contactForm.message.trim() || !user) return;
    try {
      setContactSending(true);
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await addDoc(collection(db, 'messages'), {
        userId: user.uid,
        userName: user.displayName || '',
        userEmail: user.email || '',
        name: user.displayName || '',
        email: user.email || '',
        service: contactForm.service || contactForm.subject || 'General Inquiry',
        message: contactForm.message.trim(),
        status: 'unread',
        createdAt: new Date().toISOString(),
        createdAtTimestamp: serverTimestamp(),
      });
      setContactSuccess(true);
      setContactForm({ subject: '', message: '', service: '' });
      setTimeout(() => setContactSuccess(false), 4000);
      // Reload messages to show the new one
      await loadMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setContactSending(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 bg-[#111827] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <User size={32} className="text-white" />
          </div>
          <h2 className="font-heading text-3xl text-[#111827] mb-3">Please Sign In</h2>
          <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">You need to be logged in to view your dashboard.</p>
          <Link to="/sign-in" className="btn-primary">
            Sign In to Continue
          </Link>
        </motion.div>
      </div>
    );
  }

  const unreadMessages = userMessages.filter(m => m.status === 'unread').length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <>
      <Helmet>
        <title>My Dashboard | Candid Canvas BD</title>
        <meta name="description" content="Manage your photography bookings and messages with Candid Canvas BD." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#F8F9FA] flex">

        {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#EBEBEB] fixed h-full pt-20 z-30 shadow-sm">
          <DashSidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setMobileNavOpen={setMobileNavOpen}
            onLogout={logout}
            unreadMessages={unreadMessages}
            unreadNotifications={unreadNotifications}
          />
        </aside>

        {/* ── Mobile Sidebar ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileNavOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileNavOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="relative flex flex-col w-72 bg-white h-full pt-4 shadow-2xl"
              >
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="absolute top-4 right-4 p-1.5 text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
                <DashSidebar
                  user={user}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  setMobileNavOpen={setMobileNavOpen}
                  onLogout={logout}
                  unreadMessages={unreadMessages}
                  unreadNotifications={unreadNotifications}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Main Content ────────────────────────────────────────────────── */}
        <main className="flex-1 lg:ml-64 pt-20 pb-20 lg:pb-0">

          {/* Mobile top bar */}
          <div className="lg:hidden sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="p-1.5 text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
              <h2 className="font-semibold text-[#111827] text-sm">
                {NAV_ITEMS.find(n => n.id === activeTab)?.label}
              </h2>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">

            {/* ── OVERVIEW ──────────────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                {/* Welcome banner */}
                <div className="relative bg-[#111827] rounded-2xl p-6 sm:p-8 mb-6 overflow-hidden">
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #ffffff 0%, transparent 60%)' }} />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-yellow-400" />
                      <span className="text-white/60 text-xs font-medium uppercase tracking-widest">Welcome back</span>
                    </div>
                    <h1 className="font-heading text-3xl sm:text-4xl text-white mb-1">
                      {user.displayName} 👋
                    </h1>
                    <p className="text-white/50 text-sm">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                  {[
                    { label: 'Total Bookings', value: bookings.length, icon: CalendarCheck, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
                    { label: 'Approved', value: bookings.filter(o => o.status === 'approved').length, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
                    { label: 'Completed', value: bookings.filter(o => o.status === 'completed').length, icon: Star, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
                    { label: 'Pending', value: bookings.filter(o => ['submitted', 'under_review'].includes(o.status)).length, icon: Clock, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-4 sm:p-5 hover:shadow-md transition-shadow`}>
                        <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                          <Icon size={17} />
                        </div>
                        <div className="font-heading text-3xl text-[#111827] leading-none mb-1">{s.value}</div>
                        <div className="text-xs text-[#6B7280] font-medium">{s.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Bookings */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl text-[#111827]">Recent Bookings</h2>
                  {bookings.length > 3 && (
                    <button onClick={() => setActiveTab('bookings')} className="text-xs text-[#6B7280] hover:text-[#111827] flex items-center gap-1 transition-colors">
                      View all <ChevronRight size={12} />
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 h-24 shimmer" />
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-[#E5E7EB] p-12 text-center">
                    <CalendarCheck size={36} className="text-[#D1D5DB] mx-auto mb-3" />
                    <p className="text-sm font-medium text-[#374151] mb-1">No bookings yet</p>
                    <p className="text-xs text-[#9CA3AF] mb-5">Start by booking your first session</p>
                    <Link to="/book" className="btn-primary text-xs px-5 py-2.5">
                      Book a Session
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 3).map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setActiveTab('bookings')}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="font-semibold text-[#111827] text-sm capitalize">
                              {order.packageName} — {order.eventType}
                            </h3>
                            <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1.5">
                              <MapPin size={10} />
                              {order.eventLocation}
                              <span className="text-[#D1D5DB]">·</span>
                              <Calendar size={10} />
                              {formatDate(order.eventDate)}
                            </p>
                          </div>
                          <span className={`status-pill flex-shrink-0 ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <StatusTimeline status={order.status} />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Quick links */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Browse Packages', icon: Package, to: '/packages', desc: 'View all options' },
                    { label: 'View Gallery', icon: Camera, to: '/gallery', desc: 'See our work' },
                    { label: 'Contact Us', icon: MessageSquare, action: () => setActiveTab('messages'), desc: 'Send a message' },
                  ].map((item) => (
                    item.to ? (
                      <Link key={item.label} to={item.to}
                        className="bg-white rounded-2xl border border-[#E5E7EB] p-4 hover:border-[#111827] hover:shadow-md transition-all group text-left">
                        <item.icon size={18} className="text-[#6B7280] group-hover:text-[#111827] mb-2 transition-colors" />
                        <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                        <p className="text-xs text-[#9CA3AF]">{item.desc}</p>
                      </Link>
                    ) : (
                      <button key={item.label} onClick={item.action}
                        className="bg-white rounded-2xl border border-[#E5E7EB] p-4 hover:border-[#111827] hover:shadow-md transition-all group text-left">
                        <item.icon size={18} className="text-[#6B7280] group-hover:text-[#111827] mb-2 transition-colors" />
                        <p className="text-sm font-semibold text-[#111827]">{item.label}</p>
                        <p className="text-xs text-[#9CA3AF]">{item.desc}</p>
                      </button>
                    )
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── BOOKINGS ──────────────────────────────────────────────── */}
            {activeTab === 'bookings' && (
              <motion.div key="bookings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="font-heading text-3xl text-[#111827]">My Bookings</h1>
                    <p className="text-sm text-[#6B7280] mt-0.5">{bookings.length} total · {bookings.filter(b => b.status === 'completed').length} completed</p>
                  </div>
                  <button onClick={handleRefresh} disabled={refreshing} className="icon-btn">
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-6 h-32 shimmer" />
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-[#E5E7EB] p-16 text-center">
                    <CalendarCheck size={44} className="text-[#D1D5DB] mx-auto mb-4" />
                    <p className="text-[#374151] font-semibold mb-1">No bookings yet</p>
                    <p className="text-sm text-[#9CA3AF] mb-6">Your bookings will appear here once submitted</p>
                    <Link to="/book" className="btn-primary">Book a Session</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                          <div>
                            <span className="font-mono text-[11px] text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-md">{order.id}</span>
                            <h3 className="font-semibold text-[#111827] mt-1.5 text-base capitalize">
                              {order.packageName} — {order.eventType}
                            </h3>
                          </div>
                          <span className={`status-pill ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#6B7280] mb-4 bg-[#F8F9FA] rounded-xl p-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-[#9CA3AF]" />
                            <span className="font-medium text-[#374151]">{formatDate(order.eventDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-[#9CA3AF]" />
                            <span className="font-medium text-[#374151]">{order.eventLocation || 'TBD'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-[#9CA3AF]" />
                            <span className="font-medium text-[#374151]">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                            </span>
                          </div>
                        </div>

                        {order.notes && (
                          <p className="text-xs text-[#6B7280] italic bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3 flex items-start gap-1.5">
                            <FileText size={11} className="text-amber-500 mt-0.5 flex-shrink-0" />
                            {order.notes}
                          </p>
                        )}

                        <div>
                          <p className="text-[10px] font-semibold text-[#9CA3AF] mb-2 uppercase tracking-wider">Booking Progress</p>
                          <StatusTimeline status={order.status} />
                        </div>

                        {order.status === 'completed' && (
                          <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                            {reviewedBookings.has(order.id) ? (
                              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
                                <CheckCircle size={14} /> Review submitted — pending admin approval
                              </span>
                            ) : (
                              <button
                                onClick={() => setReviewModal({ bookingId: order.id, packageName: order.packageName, eventType: order.eventType })}
                                className="flex items-center gap-2 text-sm text-[#374151] font-semibold hover:text-[#111827] transition-colors group bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl border border-amber-200"
                              >
                                <Star size={14} className="text-amber-500 fill-amber-400" />
                                Leave a Review
                              </button>
                            )}
                          </div>
                        )}

                        {/* Cancel button — only for cancellable statuses */}
                        {['submitted', 'under_review'].includes(order.status) && (
                          <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                            <button
                              onClick={() => { setCancelModal(order); setCancelReason(''); }}
                              className="flex items-center gap-2 text-sm text-red-500 font-medium hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl border border-red-200"
                            >
                              <XCircle size={14} /> Cancel Booking
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── MESSAGES ──────────────────────────────────────────────── */}
            {activeTab === 'messages' && (
              <motion.div key="messages" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="font-heading text-3xl text-[#111827]">Messages</h1>
                    <p className="text-sm text-[#6B7280] mt-0.5">Contact us or view your conversations</p>
                  </div>
                </div>

                {/* Send message form */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 mb-6 shadow-sm">
                  <h3 className="font-semibold text-[#111827] mb-4 flex items-center gap-2">
                    <Send size={15} className="text-[#6B7280]" /> Send a Message
                  </h3>

                  {contactSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4 text-sm text-emerald-700 font-medium"
                    >
                      <CheckCircle size={15} /> Message sent! We'll get back to you soon.
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="form-label">Service Interest</label>
                      <select
                        value={contactForm.service}
                        onChange={e => setContactForm(f => ({ ...f, service: e.target.value }))}
                        className="input-base"
                      >
                        <option value="">Select a service (optional)</option>
                        {packages.filter(p => p.active).map(p => (
                          <option key={p.id} value={p.name}>{p.name} — {p.category}</option>
                        ))}
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Pricing">Pricing Question</option>
                        <option value="Custom Package">Custom Package</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Message <span className="text-red-400">*</span></label>
                      <textarea
                        value={contactForm.message}
                        onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                        rows={4}
                        placeholder="How can we help you? Ask about availability, packages, pricing..."
                        className="input-base resize-none"
                      />
                    </div>
                    <button
                      onClick={sendContactMessage}
                      disabled={contactSending || !contactForm.message.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {contactSending ? (
                        <><span className="spinner-sm" /> Sending...</>
                      ) : (
                        <><Send size={14} /> Send Message</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Message history */}
                <h3 className="font-semibold text-[#111827] mb-3 flex items-center gap-2">
                  <MessageSquare size={15} className="text-[#6B7280]" /> Your Conversations
                  {unreadMessages > 0 && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadMessages} new
                    </span>
                  )}
                </h3>

                {messagesLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map(i => <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] h-20 shimmer" />)}
                  </div>
                ) : userMessages.length === 0 ? (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-[#E5E7EB] p-10 text-center">
                    <MessageSquare size={36} className="text-[#D1D5DB] mx-auto mb-3" />
                    <p className="text-sm text-[#9CA3AF]">No messages yet — send us one above!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userMessages.map(msg => (
                      <div
                        key={msg.id}
                        onClick={() => setViewMessage(msg)}
                        className={`bg-white rounded-2xl border p-4 sm:p-5 cursor-pointer hover:shadow-md transition-all ${
                          msg.status === 'unread' ? 'border-blue-300 bg-blue-50/30' : 'border-[#E5E7EB]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-[#111827]">{msg.service || 'General Inquiry'}</span>
                              {msg.status === 'unread' && (
                                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                              )}
                            </div>
                            <p className="text-xs text-[#6B7280] line-clamp-2">{msg.message}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-[11px] text-[#9CA3AF]">
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                            </p>
                            {msg.reply && (
                              <span className="text-[10px] text-emerald-600 font-semibold">Replied ✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── PROFILE ───────────────────────────────────────────────── */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-lg space-y-5">
                <h1 className="font-heading text-3xl text-[#111827]">My Profile</h1>

                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                  <div className="flex items-center gap-5 mb-6">
                    <UserAvatar
                      photoURL={user.photoURL}
                      displayName={user.displayName}
                      size="xl"
                      shape="rounded"
                      className="shadow-md ring-2 ring-[#E5E7EB]"
                    />
                    <div>
                      <h2 className="font-heading text-2xl text-[#111827]">{user.displayName}</h2>
                      <p className="text-sm text-[#6B7280]">{user.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1.5 text-xs bg-[#F3F4F6] text-[#374151] px-3 py-1 rounded-full font-semibold capitalize">
                        <User size={10} /> {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="divide-y divide-[#F3F4F6]">
                    {[
                      { label: 'Display Name', value: user.displayName },
                      { label: 'Email Address', value: (user.email || '').toLowerCase() },
                      { label: 'Account Type', value: user.role },
                      { label: 'Total Bookings', value: String(bookings.length) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center py-3 text-sm">
                        <span className="text-[#9CA3AF] font-medium">{label}</span>
                        <span className="text-[#111827] font-semibold capitalize">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Set Password */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                  <h3 className="font-semibold text-[#111827] mb-1 flex items-center gap-2">
                    <AlertCircle size={15} className="text-amber-500" />
                    Set Email & Password Login
                  </h3>
                  <p className="text-xs text-[#6B7280] mb-5 leading-relaxed bg-amber-50 border border-amber-100 rounded-xl p-3">
                    Signed in with Google? Set a password to also log in with email directly.
                  </p>
                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const pw = (form.elements.namedItem('newpw') as HTMLInputElement).value;
                    const cpw = (form.elements.namedItem('confirmpw') as HTMLInputElement).value;
                    if (pw !== cpw) { alert('Passwords do not match.'); return; }
                    if (pw.length < 6) { alert('Password must be at least 6 characters.'); return; }
                    try {
                      const { updatePassword } = await import('firebase/auth');
                      const { auth } = await import('../lib/firebase');
                      if (auth.currentUser) {
                        await updatePassword(auth.currentUser, pw);
                        alert('Password set successfully!');
                        form.reset();
                      }
                    } catch {
                      alert('Failed to set password. Please sign out and sign in again first.');
                    }
                  }}>
                    <div>
                      <label className="form-label">New Password</label>
                      <input name="newpw" type="password" placeholder="At least 6 characters" className="input-base" />
                    </div>
                    <div>
                      <label className="form-label">Confirm Password</label>
                      <input name="confirmpw" type="password" placeholder="Repeat password" className="input-base" />
                    </div>
                    <button type="submit" className="btn-primary w-full">Set Password</button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ── NOTIFICATIONS ─────────────────────────────────────────── */}
            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="font-heading text-3xl text-[#111827]">Notifications</h1>
                    <p className="text-sm text-[#6B7280] mt-0.5">Your booking updates and rewards</p>
                  </div>
                  {unreadNotifications > 0 && (
                    <button
                      onClick={markNotificationsRead}
                      className="text-xs text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] px-3 py-1.5 rounded-lg hover:border-[#374151] transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {notiLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] h-20 shimmer" />)}
                  </div>
                ) : notifications.length === 0 && bookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-[#E5E7EB] p-12 text-center">
                    <Bell size={36} className="text-[#D1D5DB] mx-auto mb-3" />
                    <p className="text-sm text-[#9CA3AF]">No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Real Firestore notifications */}
                    {notifications.map(n => (
                      <div key={n.id} className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all ${
                        !n.read ? 'border-blue-200 bg-blue-50/20' : 'border-[#E5E7EB]'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                            n.type === 'referral_reward' ? 'bg-emerald-100' :
                            n.type === 'referral_welcome' ? 'bg-purple-100' :
                            'bg-blue-100'
                          }`}>
                            {n.type === 'referral_reward' ? '🎉' : n.type === 'referral_welcome' ? '🎁' : '📋'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-sm text-[#111827]">{n.title}</p>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                            </div>
                            <p className="text-sm text-[#6B7280] mt-0.5 leading-relaxed">{n.message}</p>
                            <p className="text-xs text-[#9CA3AF] mt-1.5">
                              {n.createdAt ? new Date(n.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Booking status notifications (always shown) */}
                    {bookings.map(order => {
                      const isGood = ['approved', 'completed'].includes(order.status);
                      const isBad = order.status === 'rejected';
                      const isNew = order.status === 'submitted';
                      return (
                        <div key={order.id} className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-sm ${
                          isGood ? 'border-emerald-200 bg-emerald-50/20' :
                          isBad ? 'border-red-200 bg-red-50/20' :
                          isNew ? 'border-[#111827]/20 bg-[#111827]/[0.02]' :
                          'border-[#E5E7EB]'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                              isGood ? 'bg-emerald-100' : isBad ? 'bg-red-100' : 'bg-gray-100'
                            }`}>
                              {isGood ? '✅' : isBad ? '❌' : '📸'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-[#111827]">
                                Booking {getStatusLabel(order.status)}
                              </p>
                              <p className="text-sm text-[#6B7280] mt-0.5 capitalize">
                                {order.packageName} · {order.eventType}
                              </p>
                              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
                                  <Calendar size={10} /> {formatDate(order.eventDate)}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                  {getStatusLabel(order.status)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── REFERRAL ──────────────────────────────────────────────── */}
            {activeTab === 'referral' && (
              <motion.div key="referral" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="mb-6">
                  <h1 className="font-heading text-3xl text-[#111827]">Referral Program</h1>
                  <p className="text-sm text-[#6B7280] mt-0.5">Share your code — earn discounts when friends book</p>
                </div>

                {/* Hero card */}
                <div className="relative bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-2xl p-6 sm:p-8 mb-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                        <Gift size={18} className="text-white" />
                      </div>
                      <span className="text-white/60 text-sm font-medium">Your Referral Code</span>
                    </div>

                    {referralLoading ? (
                      <div className="h-12 bg-white/10 rounded-xl animate-pulse w-48 mb-4" />
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-widest">
                            {referral?.code || '—'}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(referral?.code || '');
                              setCopySuccess(true);
                              setTimeout(() => setCopySuccess(false), 2000);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            {copySuccess ? <CheckCircle size={13} /> : <Copy size={13} />}
                            {copySuccess ? 'Copied!' : 'Copy'}
                          </button>
                          <button
                            onClick={() => {
                              const url = `${window.location.origin}/book?ref=${referral?.code}`;
                              if (navigator.share) {
                                navigator.share({ title: 'Book Candid Canvas BD', text: `Use my referral code ${referral?.code} for a discount!`, url });
                              } else {
                                navigator.clipboard.writeText(url);
                                setCopySuccess(true);
                                setTimeout(() => setCopySuccess(false), 2000);
                              }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            <Share2 size={13} /> Share Link
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-2xl font-bold text-white">{referral?.referredCount ?? 0}</p>
                            <p className="text-white/50 text-xs mt-0.5">Friends Referred</p>
                          </div>
                          <div className="bg-white/10 rounded-xl p-4">
                            <p className="text-2xl font-bold text-emerald-400">{referral?.earnedDiscounts ?? 0}</p>
                            <p className="text-white/50 text-xs mt-0.5">Rewards Earned</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* How it works */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-6 shadow-sm">
                  <h3 className="font-semibold text-[#111827] mb-5 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" /> How it works
                  </h3>
                  <div className="space-y-4">
                    {[
                      { step: '1', icon: '📤', title: 'Share your code', desc: 'Send your unique referral code to friends and family planning events.' },
                      { step: '2', icon: '📝', title: 'They book using it', desc: 'When they book a session and apply your code, both of you get a discount.' },
                      { step: '3', icon: '🎁', title: 'You both win', desc: 'You get 10% off your next booking. They get 5% off theirs. Codes are auto-created.' },
                    ].map(({ step, icon, title, desc }) => (
                      <div key={step} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#F8F9FA] rounded-xl flex items-center justify-center text-xl flex-shrink-0 border border-[#E5E7EB]">
                          {icon}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#111827]">{title}</p>
                          <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Referral link for easy sharing */}
                <div className="bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] p-5">
                  <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-2">Your referral link</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5 truncate font-mono">
                      {window.location.origin}/book?ref={referral?.code || '...'}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/book?ref=${referral?.code}`);
                        setCopySuccess(true);
                        setTimeout(() => setCopySuccess(false), 2000);
                      }}
                      className="px-4 py-2.5 bg-[#111827] text-white text-xs font-semibold rounded-lg hover:bg-[#374151] transition-colors flex-shrink-0"
                    >
                      {copySuccess ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Nav Bar ─────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#EBEBEB] shadow-xl">
        <div className="flex items-center justify-around px-2 py-1.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setMobileNavOpen(false); }}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[52px] relative ${
                activeTab === id ? 'text-[#111827]' : 'text-[#9CA3AF] hover:text-[#374151]'
              }`}
            >
              {activeTab === id && (
                <span className="absolute inset-0 bg-[#111827]/5 rounded-xl" />
              )}
              <div className="relative">
                <Icon size={19} />
                {id === 'messages' && unreadMessages > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white leading-none">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
                {id === 'notifications' && unreadNotifications > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white leading-none">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-semibold leading-none ${activeTab === id ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>
                {label}
              </span>
            </button>
          ))}
          {/* Book button */}
          <Link
            to="/book"
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[52px] text-[#9CA3AF] hover:text-[#374151]"
          >
            <Package size={19} />
            <span className="text-[9px] font-semibold leading-none">Book</span>
          </Link>
        </div>
      </div>

      {/* ── Review Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {reviewModal && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setReviewModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="modal-card"
            >
              {reviewSuccess ? (
                <div className="p-12 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-emerald-600" />
                    </div>
                    <h3 className="font-heading text-2xl text-[#111827] mb-2">Review Submitted!</h3>
                    <p className="text-sm text-[#6B7280]">Thank you! Your review is pending admin approval.</p>
                  </motion.div>
                </div>
              ) : (
                <>
                  <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-[#111827]">Leave a Review</h2>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{reviewModal.packageName} — {reviewModal.eventType}</p>
                    </div>
                    <button onClick={() => setReviewModal(null)} className="icon-btn-sm">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="form-label">Your Rating</label>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => setReviewRating(s)} className="transition-transform hover:scale-110 active:scale-95">
                            <Star
                              size={34}
                              className={s <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-[#D1D5DB]'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Your Experience</label>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        rows={4}
                        placeholder="Tell us about your experience with Candid Canvas BD..."
                        className="input-base resize-none mt-1.5"
                      />
                    </div>
                    <p className="text-xs text-[#9CA3AF] bg-[#F8F9FA] rounded-xl p-3 border border-[#E5E7EB]">
                      ℹ️ Your review will be published after admin approval.
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => setReviewModal(null)}
                        className="flex-1 py-3 border-2 border-[#E5E7EB] text-[#374151] text-sm font-medium rounded-xl hover:border-[#374151] transition-colors">
                        Cancel
                      </button>
                      <button
                        onClick={submitReview}
                        disabled={reviewSubmitting || !reviewComment.trim()}
                        className="flex-1 py-3 bg-[#111827] text-white text-sm font-semibold rounded-xl hover:bg-[#1f2937] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {reviewSubmitting ? <><span className="spinner-sm" /> Submitting...</> : <><Send size={14} /> Submit Review</>}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── View Message Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {viewMessage && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setViewMessage(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="modal-card"
            >
              <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[#111827]">{viewMessage.service || 'General Inquiry'}</h2>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {viewMessage.createdAt ? new Date(viewMessage.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <button onClick={() => setViewMessage(null)} className="icon-btn-sm">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Your Message</p>
                  <p className="text-sm text-[#374151] leading-relaxed bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E7EB]">
                    {viewMessage.message}
                  </p>
                </div>
                {viewMessage.reply ? (
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <CheckCircle size={11} /> Admin Reply
                    </p>
                    <p className="text-sm text-[#374151] leading-relaxed bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      {viewMessage.reply}
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                    <span className="font-medium">Awaiting reply</span> — we'll get back to you soon!
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-[#E5E7EB]">
                <button onClick={() => setViewMessage(null)} className="w-full py-3 border border-[#E5E7EB] text-[#374151] text-sm font-medium rounded-xl hover:bg-[#F8F9FA] transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Cancel Booking Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {cancelModal && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setCancelModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-md overflow-hidden z-10"
            >
              <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[#111827]">Cancel Booking</h2>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 font-mono">{cancelModal.id}</p>
                </div>
                <button onClick={() => setCancelModal(null)} className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                  <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">This action cannot be undone</p>
                    <p className="text-xs text-red-600 mt-0.5 leading-relaxed">
                      Cancelling will mark your booking as rejected. Contact us if you'd like to rebook.
                    </p>
                  </div>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-3 border border-[#E5E7EB]">
                  <p className="font-semibold text-[#111827] text-sm capitalize">{cancelModal.packageName} — {cancelModal.eventType}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 flex items-center gap-1.5">
                    <Calendar size={10} /> {formatDate(cancelModal.eventDate)}
                    <span className="text-[#D1D5DB]">·</span>
                    <MapPin size={10} /> {cancelModal.eventLocation}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
                    Reason for cancellation <span className="text-[#9CA3AF] normal-case font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    rows={3}
                    placeholder="Let us know why you're cancelling..."
                    className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setCancelModal(null)}
                    className="flex-1 py-3 border border-[#E5E7EB] text-[#374151] text-sm font-medium rounded-xl hover:border-[#374151] transition-colors"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={cancelBooking}
                    disabled={cancelSubmitting}
                    className="flex-1 py-3 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {cancelSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Cancelling...</>
                    ) : (
                      <><XCircle size={14} /> Yes, Cancel</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
