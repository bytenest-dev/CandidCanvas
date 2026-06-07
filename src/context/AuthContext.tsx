import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import type { User } from '../types';

// ─── DEMO admin credentials (change after Firebase is configured) ───
const DEMO_ADMIN_EMAIL = 'admin@candidcanvas.com';
const DEMO_ADMIN_PASSWORD = '1234567890';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  /** Sign in with email + password. Works for both admin and regular customers. */
  signInAsAdmin: (email: string, password: string) => Promise<{ error?: string }>;
  /** Alias for signInAsAdmin — handles both admin and customer login */
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInAsAdmin: async () => ({}),
  signInWithEmail: async () => ({}),
  logout: async () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result from Google sign-in
    getRedirectResult(auth).catch(() => { /* ignore */ });

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            setUser({ ...userDoc.data(), uid: fbUser.uid } as User);
          } else {
            // Determine role and provider
            const role = fbUser.email === DEMO_ADMIN_EMAIL ? 'admin' : 'customer';
            const provider = fbUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email';
            const newUser = {
              email: fbUser.email || '',
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              photoURL: fbUser.photoURL || undefined,
              role,
              provider,
              createdAt: new Date(),
            };
            await setDoc(doc(db, 'users', fbUser.uid), {
              ...newUser,
              createdAt: serverTimestamp(),
            });
            setUser({ uid: fbUser.uid, ...newUser } as User);
          }
        } catch {
          // Firebase not configured – demo mode
          const role = fbUser.email === DEMO_ADMIN_EMAIL ? 'admin' : 'customer';
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            photoURL: fbUser.photoURL || undefined,
            role: role as 'admin' | 'customer',
            createdAt: new Date(),
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Use redirect instead of popup to avoid COOP/cross-origin warnings
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Google sign-in error:', error);
      // Fallback to popup if redirect fails
      try {
        await signInWithPopup(auth, googleProvider);
      } catch { /* ignore */ }
    }
  };

  const signInAsAdmin = async (email: string, password: string): Promise<{ error?: string }> => {
    // Demo mode: check hardcoded credentials when Firebase isn't configured
    if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return {};
      } catch {
        // Firebase not configured — set user directly in demo mode
        const demoAdmin: User = {
          uid: 'demo-admin-uid',
          email: DEMO_ADMIN_EMAIL,
          displayName: 'Admin',
          role: 'admin',
          createdAt: new Date(),
        };
        setUser(demoAdmin);
        setFirebaseUser(null);
        setLoading(false);
        return {};
      }
    }

    // Try Firebase email/password auth
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return {};
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        return { error: 'Invalid email or password.' };
      }
      return { error: 'Sign in failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will fire and set user/firebaseUser to null automatically
    } catch { /* ignore */ }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signInWithGoogle, signInAsAdmin, signInWithEmail: signInAsAdmin, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
