import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// NOTE: If you see "Missing or insufficient permissions" errors,
// update your Firestore Security Rules in Firebase Console to allow reads:
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /siteGallery/{doc} { allow read: if true; allow write: if request.auth != null; }
//     match /sitePackages/{doc} { allow read: if true; allow write: if request.auth != null; }
//     match /siteReviews/{doc} { allow read: if true; allow write: if request.auth != null; }
//     match /siteData/{doc} { allow read: if true; allow write: if request.auth != null; }
//     match /bookings/{doc} { allow read, write: if request.auth != null; }
//     match /messages/{doc} { allow read, write: if request.auth != null; }
//     match /users/{doc} { allow read, write: if request.auth != null && request.auth.uid == doc; }
//   }
// }

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "candid-canvas-bd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "candid-canvas-bd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "candid-canvas-bd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "484324062684",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:484324062684:web:0a3903141829eac6db0b19",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-P7YZNJ53GJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
