export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'admin';
  phone?: string;
  createdAt: Date;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  coverImage: string;
  sampleGallery: string[];
  popular: boolean;
  category: 'PHOTO' | 'CINE' | 'REELS' | 'EVENTS';
  archived: boolean;
  createdAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  eventType: string;
  packageId: string;
  packageName: string;
  eventDate: string;
  eventLocation: string;
  additionalNotes?: string;
  status: BookingStatus;
  adminNotes?: string;
  promoCode?: string;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus =
  | 'submitted'
  | 'under_review'
  | 'contacted'
  | 'approved'
  | 'completed'
  | 'rejected';

export interface GalleryImage {
  id: string;
  url: string;
  category: GalleryCategory;
  title: string;
  alt: string;
  featured: boolean;
  order: number;
  createdAt: Date;
}

export type GalleryCategory =
  | 'all'
  | 'wedding'
  | 'birthday'
  | 'corporate'
  | 'festival'
  | 'outdoor'
  | 'cinematic';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  approved: boolean;
  featured: boolean;
  service: string;
  createdAt: Date;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: Date;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  expiryDate: string;
  active: boolean;
  usageCount: number;
  maxUsage: number;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'booking' | 'inquiry' | 'review' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface Availability {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface Stat {
  label: string;
  value: string;
  icon: string;
}
