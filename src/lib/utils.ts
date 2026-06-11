import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    contacted: 'bg-purple-100 text-purple-800',
    approved: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
    cancel_requested: 'bg-orange-100 text-orange-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    contacted: 'Contacted',
    approved: 'Approved',
    completed: 'Completed',
    rejected: 'Rejected',
    cancel_requested: 'Cancel Requested',
  };
  return labels[status] || status;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/share/17gEprkrqh/',
  instagram: 'https://www.instagram.com/candidcanvasbd',
  youtube: 'https://youtube.com/@candid.canvas_bd',
  tiktok: 'https://www.tiktok.com/@candidcanvasbd',
  whatsapp: 'https://wa.me/8801849244610',
  phone: '+8801849244610',
  email: 'team.candidcanvas.bd@gmail.com',
  maps: 'https://www.google.com/maps/place/Candid+Canvas+BD,+Gohail+Rd,+Bogura',
  location: 'Gohail Rd, Bogura, Bangladesh',
};

export const SERVICES = ['PHOTO', 'CINE', 'REELS', 'EVENTS'] as const;

export const GALLERY_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'festival', label: 'Festival' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'cinematic', label: 'Cinematic' },
] as const;

// Demo gallery images using Unsplash
export const DEMO_GALLERY = [
  { id: '1', url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80', category: 'wedding', title: 'Wedding Ceremony', alt: 'Beautiful wedding ceremony', featured: true, order: 1 },
  { id: '2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', category: 'wedding', title: 'Wedding Portrait', alt: 'Couple portrait', featured: true, order: 2 },
  { id: '3', url: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80', category: 'birthday', title: 'Birthday Celebration', alt: 'Birthday party', featured: false, order: 3 },
  { id: '4', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', category: 'corporate', title: 'Corporate Event', alt: 'Corporate gathering', featured: false, order: 4 },
  { id: '5', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', category: 'festival', title: 'Festival Vibes', alt: 'Festival celebration', featured: true, order: 5 },
  { id: '6', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80', category: 'outdoor', title: 'Outdoor Session', alt: 'Outdoor photography', featured: false, order: 6 },
  { id: '7', url: 'https://images.unsplash.com/photo-1552334823-5d1f0ff39a98?w=800&q=80', category: 'cinematic', title: 'Cinematic Portrait', alt: 'Cinematic style', featured: true, order: 7 },
  { id: '8', url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80', category: 'wedding', title: 'Reception Night', alt: 'Wedding reception', featured: false, order: 8 },
  { id: '9', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80', category: 'outdoor', title: 'Golden Hour', alt: 'Golden hour photography', featured: true, order: 9 },
  { id: '10', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', category: 'corporate', title: 'Business Conference', alt: 'Conference photography', featured: false, order: 10 },
  { id: '11', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', category: 'festival', title: 'Eid Celebration', alt: 'Festival moments', featured: false, order: 11 },
  { id: '12', url: 'https://images.unsplash.com/photo-1581373449483-37449f962b6c?w=800&q=80', category: 'birthday', title: 'Sweet Sixteen', alt: 'Birthday portrait', featured: false, order: 12 },
];

export const DEMO_TESTIMONIALS = [
  {
    id: '1',
    name: 'Tasnim Rahman',
    rating: 5,
    comment: 'Candid Canvas BD captured our wedding perfectly. Every emotion, every laugh, every tear — preserved forever. Truly world-class storytelling.',
    service: 'Wedding Photography',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    approved: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Rafiq Ahmed',
    rating: 5,
    comment: 'The cinematic reel they created for our brand launch was absolutely stunning. Our engagement tripled. Highly recommend!',
    service: 'Corporate Reels',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    approved: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Priya Chowdhury',
    rating: 5,
    comment: 'Every birthday deserves to be remembered. Candid Canvas made ours unforgettable. The photos are breathtaking art.',
    service: 'Birthday Photography',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    approved: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Karim Hassan',
    rating: 5,
    comment: 'Professional, punctual, and deeply passionate. The team understood exactly what we wanted and delivered beyond expectations.',
    service: 'Event Coverage',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    approved: true,
    featured: false,
  },
];
