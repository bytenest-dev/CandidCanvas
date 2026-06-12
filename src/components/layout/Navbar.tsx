import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';
import UserAvatar from '../ui/UserAvatar';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/packages', label: 'Packages' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; title: string; message: string; read: boolean; createdAt: string; type: string }[]>([]);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); setBellOpen(false); }, [location.pathname]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Real-time notifications for logged-in non-admin users
  useEffect(() => {
    if (!user || isAdmin) return;
    let unsub: (() => void) | null = null;
    const setup = async () => {
      try {
        const { collection, query, where, orderBy, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('../../lib/firebase');
        // Try with orderBy first (requires composite index)
        const q = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        unsub = onSnapshot(q, snap => {
          setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
        }, async () => {
          // Fallback without orderBy if index not ready
          try {
            const q2 = query(collection(db, 'notifications'), where('userId', '==', user.uid));
            unsub = onSnapshot(q2, snap => {
              const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
              items.sort((a: any, b: any) => (b.createdAt > a.createdAt ? 1 : -1));
              setNotifications(items);
            });
          } catch { /* silent */ }
        });
      } catch { /* silent */ }
    };
    setup();
    return () => { if (unsub) unsub(); };
  }, [user, isAdmin]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (!unread.length) return;
    try {
      const { doc, writeBatch } = await import('firebase/firestore');
      const { db } = await import('../../lib/firebase');
      const batch = writeBatch(db);
      unread.forEach(n => batch.update(doc(db, 'notifications', n.id), { read: true }));
      await batch.commit();
    } catch { /* silent */ }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`navbar-glass ${scrolled ? 'scrolled' : ''}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src={logoImg} alt="Candid Canvas BD" className="h-9 lg:h-11 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link ${location.pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA + Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                {/* Notification Bell (non-admin only) */}
                {!isAdmin && (
                  <div className="relative" ref={bellRef}>
                    <button
                      onClick={() => { setBellOpen(v => !v); if (!bellOpen) markAllRead(); }}
                      className="relative p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                    >
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>
                    <AnimatePresence>
                      {bellOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-[#E5E7EB] overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F8F9FA] flex items-center justify-between">
                            <span className="text-sm font-semibold text-[#111827]">Notifications</span>
                            {unreadCount > 0 && (
                              <span className="text-xs text-[#6B7280] bg-white px-2 py-0.5 rounded-full border border-[#E5E7EB]">{unreadCount} new</span>
                            )}
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <div className="px-4 py-8 text-center">
                                <Bell size={24} className="text-[#D1D5DB] mx-auto mb-2" />
                                <p className="text-sm text-[#9CA3AF]">No notifications yet</p>
                              </div>
                            ) : notifications.map(n => (
                              <div key={n.id} className={`px-4 py-3 border-b border-[#F3F4F6] last:border-0 ${!n.read ? 'bg-blue-50/40' : ''}`}>
                                <div className="flex items-start gap-2.5">
                                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                    n.type === 'referral_reward' ? 'bg-emerald-500' :
                                    n.type === 'referral_welcome' ? 'bg-purple-500' :
                                    n.type?.includes('booking') ? 'bg-blue-500' : 'bg-[#9CA3AF]'
                                  }`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-[#111827] leading-snug">{n.title}</p>
                                    <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{n.message}</p>
                                    <p className="text-[10px] text-[#9CA3AF] mt-1">
                                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="px-4 py-2.5 border-t border-[#E5E7EB] bg-[#F8F9FA]">
                            <Link to="/dashboard" onClick={() => setBellOpen(false)}
                              className="text-xs text-[#6B7280] hover:text-[#111827] transition-colors">
                              View all in Dashboard →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                  >
                    <UserAvatar
                      photoURL={user.photoURL}
                      displayName={user.displayName}
                      size="sm"
                    />
                    <ChevronDown size={14} className={`text-[#6B7280] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-[#E5E7EB] overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F8F9FA]">
                          <p className="text-sm font-semibold text-[#111827] truncate">{user.displayName}</p>
                          <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
                        </div>
                        {!isAdmin && (
                          <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F8F9FA] transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <User size={15} className="text-[#6B7280]" /> My Dashboard
                          </Link>
                        )}
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F8F9FA] transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <LayoutDashboard size={15} className="text-[#6B7280]" /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-[#E5E7EB]">
                          <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link to="/sign-in" className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors px-3 py-2 rounded-lg hover:bg-[#F3F4F6]">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile bell */}
            {user && !isAdmin && (
              <button
                onClick={() => { setBellOpen(v => !v); markAllRead(); }}
                className="relative p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}
            {/* Mobile user avatar */}
            {user && (
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center">
                <UserAvatar
                  photoURL={user.photoURL}
                  displayName={user.displayName}
                  size="sm"
                />
              </Link>
            )}
            <button
              className="p-2 text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Notification Panel — full-width slide-down */}
      <AnimatePresence>
        {bellOpen && user && !isAdmin && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setBellOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute left-0 right-0 top-16 bg-white shadow-2xl border-b border-[#E5E7EB] z-50 max-h-[70vh] overflow-y-auto"
            >
              <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F8F9FA] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#111827]">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && <span className="text-xs text-[#6B7280] bg-white px-2 py-0.5 rounded-full border border-[#E5E7EB]">{unreadCount} new</span>}
                  <button onClick={() => setBellOpen(false)} className="p-1 text-[#9CA3AF] hover:text-[#111827]">
                    <X size={16} />
                  </button>
                </div>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell size={28} className="text-[#D1D5DB] mx-auto mb-2" />
                  <p className="text-sm text-[#9CA3AF]">No notifications yet</p>
                </div>
              ) : notifications.map(n => (
                <div key={n.id} className={`px-4 py-3.5 border-b border-[#F3F4F6] last:border-0 ${!n.read ? 'bg-blue-50/40' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                      n.type === 'referral_reward' ? 'bg-emerald-500' :
                      n.type === 'referral_welcome' ? 'bg-purple-500' :
                      n.type?.includes('booking') ? 'bg-blue-500' : 'bg-[#9CA3AF]'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111827] leading-snug">{n.title}</p>
                      <p className="text-sm text-[#6B7280] mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-[#E5E7EB] bg-[#F8F9FA]">
                <Link to="/dashboard" onClick={() => setBellOpen(false)}
                  className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">
                  View all in Dashboard →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-[#E5E7EB] overflow-hidden shadow-lg"
          >
            <div className="px-4 py-5 flex flex-col gap-1">
              {/* User info at top of mobile menu */}
              {user && (
                <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-[#F8F9FA] rounded-xl">
                  <UserAvatar
                    photoURL={user.photoURL}
                    displayName={user.displayName}
                    size="md"
                    className="flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111827] truncate">{user.displayName}</p>
                    <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Nav links */}
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    location.pathname === link.href
                      ? 'bg-[#111827] text-white font-medium'
                      : 'text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-[#E5E7EB] mt-2 pt-3 space-y-1">

                {user ? (
                  <>
                    {!isAdmin && (
                      <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors">
                        <User size={15} className="text-[#6B7280]" /> My Dashboard
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors">
                        <LayoutDashboard size={15} className="text-[#6B7280]" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/sign-in" className="block px-3 py-2.5 text-center text-sm text-[#6B7280] hover:text-[#111827] transition-colors">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
