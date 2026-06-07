import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteProvider, useSite } from './context/SiteContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingContact from './components/layout/FloatingContact';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import PackagesPage from './pages/PackagesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import SignInPage from './pages/SignInPage';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Track visitor count in Firestore (once per session, with daily breakdown for graph)
function VisitorTracker() {
  useEffect(() => {
    const key = 'ccbd_visited';
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');

    async function track() {
      try {
        const { doc, updateDoc, increment, setDoc, getDoc } = await import('firebase/firestore');
        const { db } = await import('./lib/firebase');

        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
        const monthStr = dateStr.slice(0, 7); // YYYY-MM

        // 1. Increment total visitor counter
        const totalRef = doc(db, 'siteData', 'visitors');
        const totalSnap = await getDoc(totalRef);
        if (totalSnap.exists()) {
          await updateDoc(totalRef, { count: increment(1) });
        } else {
          await setDoc(totalRef, { count: 1 });
        }

        // 2. Increment today's daily counter
        const dailyRef = doc(db, 'siteData', `visitors_${dateStr}`);
        const dailySnap = await getDoc(dailyRef);
        if (dailySnap.exists()) {
          await updateDoc(dailyRef, { count: increment(1), date: dateStr, month: monthStr });
        } else {
          await setDoc(dailyRef, { count: 1, date: dateStr, month: monthStr });
        }

        // 3. Increment monthly counter (for month-over-month comparison)
        const monthRef = doc(db, 'siteData', `visitors_month_${monthStr}`);
        const monthSnap = await getDoc(monthRef);
        if (monthSnap.exists()) {
          await updateDoc(monthRef, { count: increment(1), month: monthStr });
        } else {
          await setDoc(monthRef, { count: 1, month: monthStr });
        }
      } catch { /* silent */ }
    }
    track();
  }, []);
  return null;
}

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

const BARE_PATHS = ['/sign-in'];
const NO_FOOTER_PATHS = ['/dashboard', '/admin'];

function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#111827] border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || !isAdmin) return <Navigate to="/sign-in" replace />;
  return <>{children}</>;
}

// Maintenance / Vacation gate — wraps public pages only
function SiteGate({ children }: { children: React.ReactNode }) {
  const { settings } = useSite();
  const location = useLocation();

  // Admin routes always bypass the gate
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/sign-in';
  if (isAdminRoute) return <>{children}</>;

  if (settings.maintenanceMode) {
    return (
      <div className="min-h-screen bg-[#111827] flex flex-col relative">
        {/* Sign In button — fixed top-right */}
        <div className="fixed top-5 right-5 z-50">
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#111827] text-sm font-semibold rounded-xl hover:bg-white/95 active:scale-95 transition-all duration-200 shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Sign In
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">🔧</div>
            <h1 className="font-heading text-5xl text-white mb-4">Under Maintenance</h1>
            <p className="text-white/60 text-sm leading-relaxed">{settings.maintenanceMessage}</p>
            <p className="text-white/30 text-xs mt-8">Candid Canvas BD — We'll be back soon.</p>
          </div>
        </div>
      </div>
    );
  }

  if (settings.vacationMode) {
    const hasImage = !!settings.vacationImage;
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Background */}
        {hasImage ? (
          <>
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${settings.vacationImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(0.45)',
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, #0f4c75 0%, #1b6ca8 100%)' }} />
        )}

        {/* Sign In button — fixed top-right, always visible */}
        <div className="fixed top-5 right-5 z-50">
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#111827] text-sm font-semibold rounded-xl hover:bg-white/95 active:scale-95 transition-all duration-200 shadow-xl border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Sign In
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-lg">
            {!hasImage && (
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">✨</div>
            )}
            <h1 className="font-heading text-5xl sm:text-6xl text-white mb-5 drop-shadow-lg">
              {settings.vacationTitle || 'Special Notice'}
            </h1>
            <p className="text-white/85 text-base leading-relaxed mb-6 drop-shadow">{settings.vacationMessage}</p>
            {settings.vacationEndDate && (
              <div className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1.5">We Return On</p>
                <p className="text-white font-bold text-xl">
                  {new Date(settings.vacationEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            )}
            <p className="text-white/30 text-xs mt-10">Candid Canvas BD — See you soon!</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function Layout() {
  const location = useLocation();
  const isBare = BARE_PATHS.some(p => location.pathname.startsWith(p));
  const showFooter = !NO_FOOTER_PATHS.some(p => location.pathname.startsWith(p)) && !isBare;

  if (isBare) {
    return (
      <>
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/sign-in" element={<PageTransition><SignInPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </>
    );
  }

  return (
    <SiteGate>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <VisitorTracker />
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
              <Route path="/gallery" element={<PageTransition><GalleryPage /></PageTransition>} />
              <Route path="/packages" element={<PageTransition><PackagesPage /></PageTransition>} />
              <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
              <Route path="/book" element={<PageTransition><BookingPage /></PageTransition>} />
              <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
              <Route path="/admin" element={
                <ProtectedAdmin>
                  <PageTransition><AdminPage /></PageTransition>
                </ProtectedAdmin>
              } />
              <Route path="*" element={
                <PageTransition>
                  <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                    <Helmet>
                      <title>Page Not Found | Candid Canvas BD</title>
                      <meta name="robots" content="noindex, nofollow" />
                    </Helmet>
                    <div className="text-center px-6">
                      <h1 className="font-heading text-7xl text-[#111827] mb-4">404</h1>
                      <p className="text-[#6B7280] mb-2 font-medium">Page not found</p>
                      <p className="text-[#9CA3AF] text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
                      <a href="/" className="px-6 py-3 bg-[#111827] text-white text-sm rounded hover:bg-[#374151] transition-colors">← Back to Home</a>
                    </div>
                  </div>
                </PageTransition>
              } />
            </Routes>
          </AnimatePresence>
        </main>
        {showFooter && <Footer />}
        <FloatingContact />
      </div>
    </SiteGate>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SiteProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </SiteProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
