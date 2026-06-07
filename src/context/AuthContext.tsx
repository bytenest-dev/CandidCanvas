import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import type { User } from '../types';

const ADMIN_EMAILS = ['admin@candidcanvas.com', 'team.candidcanvas.bd@gmail.com'];
const DEMO_ADMIN_EMAIL = 'admin@candidcanvas.com';
const DEMO_ADMIN_PASSWORD = '1234567890';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsAdmin: (email: string, password: string) => Promise<{ error?: string }>;
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
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Always reflect latest Google profile photo
            const updatedUser = {
              ...data,
              uid: fbUser.uid,
              photoURL: fbUser.photoURL || data.photoURL || undefined,
              displayName: fbUser.displayName || data.displayName || 'User',
            } as User;
            setUser(updatedUser);
          } else {
            const isAdminEmail = ADMIN_EMAILS.includes(fbUser.email || '');
            const role = isAdminEmail ? 'admin' : 'customer';
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
          // Firebase not configured or permission denied — fallback
          const isAdminEmail = ADMIN_EMAILS.includes(fbUser.email || '');
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            photoURL: fbUser.photoURL || undefined,
            role: isAdminEmail ? 'admin' : 'customer',
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
      // Popup works reliably once candidcanvas.pro.bd is added to Firebase authorized domains
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      // User closed the popup — not a real error
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
      console.error('Google sign-in error:', code || error);
    }
  };

  const signInAsAdmin = async (email: string, password: string): Promise<{ error?: string }> => {
    if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return {};
      } catch {
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
    } catch { /* ignore */ }
  };

  const isAdmin = user?.role === 'admin' || ADMIN_EMAILS.includes(user?.email || '');

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signInWithGoogle, signInAsAdmin, signInWithEmail: signInAsAdmin, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
