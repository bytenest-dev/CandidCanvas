import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
}

export interface SliderItem {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
}

export interface PackageItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  features: string;
  active: boolean;
  popular: boolean;
  imageUrl?: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;
  phone: string;
  email: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  vacationMode: boolean;
  vacationTitle: string;
  vacationMessage: string;
  vacationEndDate: string;
  vacationImage: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service: string;
  approved: boolean;
  createdAt?: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: 'Candid Canvas BD',
  heroSubtitle: 'Preserving Special Moments',
  metaTitle: 'Candid Canvas BD — Premium Photography & Cinematography',
  metaDescription: 'Premium photography & cinematography in Dhaka, Bangladesh.',
  phone: '+8801849244610',
  email: 'candidcanvasbd@gmail.com',
  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing maintenance. We will be back shortly.',
  vacationMode: false,
  vacationTitle: 'Special Notice',
  vacationMessage: 'We are currently unavailable. Bookings will resume soon!',
  vacationEndDate: '',
  vacationImage: '',
};

interface SiteContextType {
  gallery: GalleryItem[];
  setGallery: (items: GalleryItem[]) => void;
  slider: SliderItem[];
  setSlider: (items: SliderItem[]) => void;
  packages: PackageItem[];
  setPackages: (items: PackageItem[]) => void;
  settings: SiteSettings;
  setSettings: (s: SiteSettings | ((prev: SiteSettings) => SiteSettings)) => void;
  reviews: ReviewItem[];
  setReviews: (items: ReviewItem[]) => void;
  siteLoading: boolean;
  refreshSiteData: () => void;
}

const SiteContext = createContext<SiteContextType>({
  gallery: [],
  setGallery: () => {},
  slider: [],
  setSlider: () => {},
  packages: [],
  setPackages: () => {},
  settings: DEFAULT_SETTINGS,
  setSettings: () => {},
  reviews: [],
  setReviews: () => {},
  siteLoading: true,
  refreshSiteData: () => {},
});

// Helper: save to Firestore
async function saveToFirestore(collection: string, id: string, data: object) {
  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const { db } = await import('../lib/firebase');
    await setDoc(doc(db, collection, id), data);
  } catch {
    // silent
  }
}

// Helper: load from Firestore
async function loadFromFirestore(collectionName: string) {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await import('../lib/firebase');
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    return null;
  }
}

async function loadSettingsFromFirestore(): Promise<SiteSettings | null> {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('../lib/firebase');
    const snap = await getDoc(doc(db, 'siteData', 'settings'));
    if (snap.exists()) return snap.data() as SiteSettings;
    return null;
  } catch {
    return null;
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [gallery, setGalleryState] = useState<GalleryItem[]>([]);
  const [slider, setSliderState] = useState<SliderItem[]>([]);
  const [packages, setPackagesState] = useState<PackageItem[]>([]);
  const [settings, setSettingsState] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [reviews, setReviewsState] = useState<ReviewItem[]>([]);
  const [siteLoading, setSiteLoading] = useState(true);

  const loadData = async () => {
    setSiteLoading(true);
    try {
      // Load all data from Firestore in parallel
      const [galleryData, sliderData, packagesData, settingsData, reviewsData] = await Promise.all([
        loadFromFirestore('siteGallery'),
        loadFromFirestore('siteSlider'),
        loadFromFirestore('sitePackages'),
        loadSettingsFromFirestore(),
        loadFromFirestore('siteReviews'),
      ]);

      if (galleryData && galleryData.length > 0) {
        setGalleryState(galleryData as GalleryItem[]);
      } else {
        setGalleryState([]);
      }

      if (sliderData && sliderData.length > 0) {
        const sorted = (sliderData as SliderItem[]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setSliderState(sorted);
      } else {
        setSliderState([]);
      }

      if (packagesData && packagesData.length > 0) {
        setPackagesState(packagesData as PackageItem[]);
      } else {
        setPackagesState([]);
      }

      if (settingsData) {
        setSettingsState({ ...DEFAULT_SETTINGS, ...settingsData });
      }

      if (reviewsData) {
        setReviewsState(reviewsData as ReviewItem[]);
      }
    } catch (e) {
      console.error('Failed to load site data:', e);
    } finally {
      setSiteLoading(false);
    }
  };

  // Increment visitor count on initial mount (homepage tracking)
  useEffect(() => {
    const incrementVisitor = async () => {
      try {
        const { doc, getDoc, setDoc, updateDoc, increment } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        const visitorRef = doc(db, 'siteData', 'visitors');
        const visitorSnap = await getDoc(visitorRef);
        
        if (visitorSnap.exists()) {
          await updateDoc(visitorRef, { count: increment(1) });
        } else {
          await setDoc(visitorRef, { count: 1 });
        }
      } catch {
        // Silent - visitor tracking is non-critical
      }
    };

    // Only increment once per session
    const hasTracked = sessionStorage.getItem('visitor_tracked');
    if (!hasTracked) {
      incrementVisitor();
      sessionStorage.setItem('visitor_tracked', 'true');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  // Gallery: persist changes to Firestore
  const setGallery = async (items: GalleryItem[]) => {
    setGalleryState(items);
    try {
      const { collection, writeBatch, doc, getDocs } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const snap = await getDocs(collection(db, 'siteGallery'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      items.forEach(item => { batch.set(doc(db, 'siteGallery', item.id), item); });
      await batch.commit();
    } catch { /* silent */ }
  };

  // Slider: persist changes to Firestore
  const setSlider = async (items: SliderItem[]) => {
    setSliderState(items);
    try {
      const { collection, writeBatch, doc, getDocs } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const snap = await getDocs(collection(db, 'siteSlider'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      items.forEach(item => { batch.set(doc(db, 'siteSlider', item.id), item); });
      await batch.commit();
    } catch { /* silent */ }
  };

  // Packages: persist changes to Firestore
  const setPackages = async (items: PackageItem[]) => {
    setPackagesState(items);
    try {
      const { collection, writeBatch, doc, getDocs } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const snap = await getDocs(collection(db, 'sitePackages'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      items.forEach(item => {
        batch.set(doc(db, 'sitePackages', item.id), item);
      });
      await batch.commit();
    } catch {
      // silent - may not have permission
    }
  };

  // Settings: persist changes to Firestore
  const setSettings = async (s: SiteSettings | ((prev: SiteSettings) => SiteSettings)) => {
    const newSettings = typeof s === 'function' ? s(settings) : s;
    setSettingsState(newSettings);
    await saveToFirestore('siteData', 'settings', newSettings);
  };

  // Reviews: persist changes to Firestore
  const setReviews = async (items: ReviewItem[]) => {
    setReviewsState(items);
    try {
      const { collection, writeBatch, doc, getDocs } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const snap = await getDocs(collection(db, 'siteReviews'));
      const batch = writeBatch(db);
      snap.docs.forEach(d => batch.delete(d.ref));
      items.forEach(item => {
        batch.set(doc(db, 'siteReviews', item.id), item);
      });
      await batch.commit();
    } catch {
      // silent - may not have permission
    }
  };

  return (
    <SiteContext.Provider value={{
      gallery, setGallery,
      slider, setSlider,
      packages, setPackages,
      settings, setSettings,
      reviews, setReviews,
      siteLoading,
      refreshSiteData: loadData,
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
