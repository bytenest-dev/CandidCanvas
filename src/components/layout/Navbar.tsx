import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
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
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
            ) : (
              <Link to="/sign-in" className="text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors px-3 py-2 rounded-lg hover:bg-[#F3F4F6]">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="flex lg:hidden items-center gap-2">
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
