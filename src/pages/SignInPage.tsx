import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function SignInPage() {
  const { signInWithEmail, signInWithGoogle, user, isAdmin, suspendedInfo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || (location.state as { from?: string })?.from || '/dashboard';

  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const dest = isAdmin ? '/admin' : redirectTo;
      navigate(dest, { replace: true });
    }
  }, [user, isAdmin, navigate, redirectTo]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (user) return null;

  // ── Suspended account screen ──────────────────────────────────────────
  if (suspendedInfo) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden">
            <div className="bg-red-50 px-8 pt-8 pb-6 text-center border-b border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚫</span>
              </div>
              <h1 className="font-heading text-2xl text-red-700 mb-1">Account Suspended</h1>
              <p className="text-red-500 text-sm">Your account has been suspended by the admin.</p>
            </div>
            <div className="px-8 py-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Reason</p>
                <p className="text-sm text-red-800 leading-relaxed">{suspendedInfo.reason}</p>
              </div>
              {suspendedInfo.until && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Suspended Until</p>
                  <p className="text-sm text-amber-800 font-medium">
                    {new Date(suspendedInfo.until).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              )}
              {!suspendedInfo.until && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-sm text-gray-700">Permanent suspension</p>
                </div>
              )}
              <p className="text-xs text-[#9CA3AF] text-center pt-2">
                If you believe this is a mistake, please contact us at{' '}
                <a href="mailto:team.candidcanvas.bd@gmail.com" className="text-[#374151] font-medium hover:underline">
                  team.candidcanvas.bd@gmail.com
                </a>
              </p>
            </div>
          </div>
          <p className="text-center text-[#9CA3AF] text-xs mt-6">
            <Link to="/" className="hover:text-[#374151] transition-colors">← Back to Candid Canvas BD</Link>
          </p>
        </motion.div>
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    setAuthError('');
    const result = await signInWithEmail(data.email, data.password);
    if (result.error) {
      setAuthError(result.error);
    }
    // Navigation is handled by the useEffect above when user state updates
  };

  const handleGoogle = async () => {
    setAuthError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Navigation handled by useEffect above
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/network-request-failed') {
        setAuthError('Network error. Please check your connection and try again.');
      } else if (code === 'auth/popup-blocked') {
        setAuthError('Popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setAuthError('Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In | Candid Canvas BD</title>
        <meta name="description" content="Sign in to your Candid Canvas BD account to manage bookings and messages." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.candidcanvas.pro.bd/sign-in" />
      </Helmet>
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-[#E5E7EB]">
            <Link to="/">
              <img src={logoImg} alt="Candid Canvas BD" className="h-14 w-auto object-contain mx-auto mb-4" />
            </Link>
            <h1 className="font-heading text-2xl text-[#111827]">Welcome Back</h1>
            <p className="text-[#6B7280] text-sm mt-1">Sign in to your account</p>
          </div>

          <div className="px-8 py-7 space-y-5">
            {/* Error banner */}
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle size={15} className="flex-shrink-0" />
                {authError}
              </motion.div>
            )}

            {/* Email / Password form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all bg-[#F8F9FA] focus:bg-white"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all bg-[#F8F9FA] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Sign In button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#111827] text-white text-sm font-semibold rounded-xl hover:bg-[#374151] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <span className="text-xs text-[#9CA3AF] font-medium">or</span>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full py-3.5 border-2 border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#374151] hover:border-[#9CA3AF] hover:bg-[#F8F9FA] transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                <svg className="animate-spin h-4 w-4 text-[#374151]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>

            <p className="text-center text-xs text-[#9CA3AF] pt-1">
              Don't have an account?{' '}
              <Link to="/contact" className="text-[#374151] font-semibold hover:text-[#111827] transition-colors">
                Contact us
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[#9CA3AF] text-xs mt-6">
          <Link to="/" className="hover:text-[#374151] transition-colors">
            ← Back to Candid Canvas BD
          </Link>
        </p>
      </motion.div>
    </div>
    </>
  );
}
