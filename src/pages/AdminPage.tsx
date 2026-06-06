import { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Image, Package, Star,
  Settings, LogOut, Search, CheckCircle, XCircle,
  Eye, Camera, Trash2, Edit, TrendingUp, Bell, Menu, Plus,
  Upload, RefreshCw, Calendar, Wrench, Mail, Users, Globe, MessageSquare,
  Download, FileSpreadsheet, ChevronDown, CloudUpload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSite, type GalleryItem, type SliderItem, type PackageItem, type ReviewItem, type SiteSettings } from '../context/SiteContext';
import { getStatusColor, getStatusLabel, formatDate } from '../lib/utils';
import { type OrderEmailData } from '../lib/emailService';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../lib/cloudinary';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import UserAvatar from '../components/ui/UserAvatar';
import ToastContainer from '../components/ui/Toast';
import EmailPreviewModal from '../components/ui/EmailPreviewModal';
import Modal from '../components/ui/Modal';
import { useToast } from '../hooks/useToast';
import logoImg from '../assets/logo.png';

type OrderStatus = 'submitted' | 'under_review' | 'contacted' | 'approved' | 'completed' | 'rejected';

interface Order {
  id: string; client: string; email: string; package: string;
  event: string; date: string; location: string; notes?: string;
  status: OrderStatus; createdAt: string;
}

const ADMIN_NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'slider', label: 'Featured Slider', icon: Image },
  { id: 'gallery', label: 'Gallery', icon: Camera },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const GALLERY_CATS = ['Wedding', 'Birthday', 'Corporate', 'Festival', 'Outdoor', 'Cinematic', 'General'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// â”€â”€ Sidebar extracted outside AdminPage to prevent remount on every render â”€â”€
interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
  orders: Array<{ status: string }>;
  messages: Array<{ status: string }>;
  reviews: Array<{ approved: boolean }>;
  user: { displayName?: string; email?: string } | null;
  onLogout: () => void;
}

function AdminSidebar({
  activeTab, setActiveTab, setSidebarOpen,
  orders, messages, reviews, user, onLogout,
}: AdminSidebarProps) {
  return (
    <aside className="flex flex-col w-64 bg-[#111827] h-full overflow-hidden">
      <div className="p-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <img src={logoImg} alt="Candid Canvas BD" className="h-8 w-auto object-contain brightness-0 invert flex-shrink-0" />
            <div>
              <p className="font-heading font-bold text-sm tracking-wider text-white uppercase">Admin Panel</p>
              <p className="text-white/40 text-[10px]">Candid Canvas BD</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {ADMIN_NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              activeTab === id
                ? 'bg-white/15 text-white font-medium'
                : 'text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={16} />
            {label}
            {id === 'orders' && orders.filter(o => ['submitted', 'under_review'].includes(o.status)).length > 0 && (
              <span className="ml-auto bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {orders.filter(o => ['submitted', 'under_review'].includes(o.status)).length}
              </span>
            )}
            {id === 'messages' && messages.filter(m => m.status === 'unread').length > 0 && (
              <span className="ml-auto bg-blue-400 text-blue-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {messages.filter(m => m.status === 'unread').length}
              </span>
            )}
            {id === 'reviews' && reviews.filter(r => !r.approved).length > 0 && (
              <span className="ml-auto bg-purple-400 text-purple-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {reviews.filter(r => !r.approved).length}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2.5 mb-3">
          {/* Website logo as admin profile picture */}
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
            <img src={logoImg} alt="Candid Canvas BD" className="w-8 h-8 object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.displayName || 'Admin'}</p>
            <p className="text-white/40 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-400/10 text-xs transition-colors"
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function AdminPage() {
  const { user, logout, isAdmin } = useAuth();
  const { gallery, setGallery, slider, setSlider, packages, setPackages, settings, setSettings, reviews, setReviews, refreshSiteData } = useSite();
  const navigate = useNavigate();
  const { toasts, toast, dismiss } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Local settings state â€” only persisted on explicit "Save" click
  const [localSettings, setLocalSettings] = useState(settings);
  // Sync local settings when remote settings load/change
  useEffect(() => { setLocalSettings(settings); }, [settings]);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [orderTab, setOrderTab] = useState<'all' | OrderStatus>('all');
  const [emailModalData, setEmailModalData] = useState<OrderEmailData | null>(null);

  // Stats
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [chartData, setChartData] = useState<{ month: string; bookings: number; revenue: number }[]>([]);

  // Slider state
  const [sliderForm, setSliderForm] = useState({ title: '', subtitle: '' });
  const [sliderPreview, setSliderPreview] = useState('');
  const [isSliderUploading, setIsSliderUploading] = useState(false);
  const [editSlide, setEditSlide] = useState<SliderItem | null>(null);
  const sliderInputRef = useRef<HTMLInputElement>(null);

  // Gallery state
  const [editGallery, setEditGallery] = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCat, setEditCat] = useState('');
  const [replacePreview, setReplacePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Package state
  const [pkgModal, setPkgModal] = useState(false);
  const [editPkg, setEditPkg] = useState<PackageItem | null>(null);
  const [pkgForm, setPkgForm] = useState<Omit<PackageItem, 'id' | 'active' | 'popular'>>({
    name: '', category: 'PHOTO', price: '', description: '', features: '', imageUrl: '',
  });
  const [pkgPreview, setPkgPreview] = useState('');
  const pkgImgRef = useRef<HTMLInputElement>(null);
  const vacationImgRef = useRef<HTMLInputElement>(null);

  // Messages state
  interface Message {
    id: string;
    name: string;
    email: string;
    phone?: string;
    service?: string;
    message: string;
    status: 'unread' | 'read';
    createdAt: string;
    userId?: string;
    userName?: string;
    userEmail?: string;
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [viewMessage, setViewMessage] = useState<Message | null>(null);

  // â”€â”€ Load all data from Firebase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const loadOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const bookings: Order[] = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: d.id || doc.id,
          client: d.client || '',
          email: d.email || '',
          package: d.package || '',
          event: d.event || '',
          date: d.date || '',
          location: d.location || '',
          notes: d.notes || '',
          status: (d.status || 'submitted') as OrderStatus,
          createdAt: d.createdAt || '',
        };
      });
      setOrders(bookings);

      // Build chart data from real orders grouped by month
      const monthMap: Record<string, { bookings: number; revenue: number }> = {};
      MONTHS.forEach(m => { monthMap[m] = { bookings: 0, revenue: 0 }; });
      bookings.forEach(o => {
        if (!o.createdAt) return;
        const d = new Date(o.createdAt);
        if (isNaN(d.getTime())) return;
        const monthKey = MONTHS[d.getMonth()];
        if (monthMap[monthKey]) {
          monthMap[monthKey].bookings += 1;
        }
      });
      setChartData(MONTHS.map(m => ({ month: m, bookings: monthMap[m].bookings, revenue: monthMap[m].bookings * 25000 })));
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code !== 'permission-denied') {
        console.warn('Orders load error:', code || err);
      }
      // silent on permission â€” Firestore rules need to be configured
    } finally {
      setOrdersLoading(false);
    }
  }, [toast]);

  const loadStats = useCallback(async () => {
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      // Count registered users
      const usersSnap = await getDocs(collection(db, 'users'));
      setTotalUsers(usersSnap.size);
      // Visitor count: stored in siteData/visitors
      const { doc, getDoc, setDoc, increment, updateDoc } = await import('firebase/firestore');
      const visitorRef = doc(db, 'siteData', 'visitors');
      const visitorSnap = await getDoc(visitorRef);
      if (visitorSnap.exists()) {
        setTotalVisitors(visitorSnap.data().count || 0);
      } else {
        await setDoc(visitorRef, { count: 0 });
        setTotalVisitors(0);
      }
    } catch {
      // silent
    }
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      setMessagesLoading(true);
      const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      let msgs: Message[] = [];
      try {
        // Try with orderBy first (requires Firestore index)
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        msgs = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.name || d.userName || '',
            email: d.email || d.userEmail || '',
            phone: d.phone || '',
            service: d.service || '',
            message: d.message || '',
            status: d.status || 'unread',
            createdAt: d.createdAt || '',
            userId: d.userId || '',
            userName: d.userName || '',
            userEmail: d.userEmail || '',
          };
        });
      } catch {
        // Fallback: load without orderBy if index not ready
        const snapshot = await getDocs(collection(db, 'messages'));
        msgs = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.name || d.userName || '',
            email: d.email || d.userEmail || '',
            phone: d.phone || '',
            service: d.service || '',
            message: d.message || '',
            status: d.status || 'unread',
            createdAt: d.createdAt || '',
            userId: d.userId || '',
            userName: d.userName || '',
            userEmail: d.userEmail || '',
          };
        });
        // Sort client-side
        msgs.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
      }
      setMessages(msgs);
    } catch {
      // Silent â€” Firestore permission denied or index missing; will show empty messages
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadStats();
    loadMessages();
  }, [loadOrders, loadStats, loadMessages]);

  // â”€â”€ Auth guard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="text-center p-8">
          <XCircle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-[#111827] mb-2">Access Denied</h2>
          <p className="text-[#6B7280] text-sm mb-6">You need admin privileges to access this page.</p>
          <Link to="/sign-in" className="px-6 py-3 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  // â”€â”€ Order helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const updateStatusWithEmail = async (order: Order, status: OrderStatus) => {
    try {
      const { collection, query, where, getDocs, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const q = query(collection(db, 'bookings'), where('id', '==', order.id));
      const snap = await getDocs(q);
      if (!snap.empty) await updateDoc(snap.docs[0].ref, { status });
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status } : o));
      if (['approved', 'rejected', 'contacted', 'completed'].includes(status)) {
        setEmailModalData({
          clientName: order.client,
          clientEmail: order.email,
          orderId: order.id,
          packageName: order.package,
          eventType: order.event,
          eventDate: formatDate(order.date),
          eventLocation: order.location,
          status: status as OrderEmailData['status'],
        });
      } else {
        toast.success(`Order ${order.id} updated to ${getStatusLabel(status)}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update order status');
    }
  };

  // â”€â”€ Slider helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const addSlide = () => {
    if (slider.length >= 10) {
      toast.error('Maximum 10 slides allowed');
      return;
    }
    if (!sliderPreview) {
      toast.error('Please select an image first');
      return;
    }
    const newSlide: SliderItem = {
      id: `slide-${Date.now()}`,
      url: sliderPreview,
      title: sliderForm.title.trim(),
      subtitle: sliderForm.subtitle.trim(),
      enabled: true,
      order: slider.length,
    };
    setSlider([...slider, newSlide]);
    setSliderForm({ title: '', subtitle: '' });
    setSliderPreview('');
    toast.success('Slide added successfully');
  };

  const updateSlide = () => {
    if (!editSlide) return;
    setSlider(slider.map(s => s.id === editSlide.id
      ? { ...s, title: sliderForm.title.trim(), subtitle: sliderForm.subtitle.trim(), url: sliderPreview || s.url }
      : s
    ));
    setEditSlide(null);
    setSliderForm({ title: '', subtitle: '' });
    setSliderPreview('');
    toast.success('Slide updated');
  };

  const openEditSlide = (slide: SliderItem) => {
    setEditSlide(slide);
    setSliderForm({ title: slide.title, subtitle: slide.subtitle || '' });
    setSliderPreview(slide.url);
  };

  const cancelEditSlide = () => {
    setEditSlide(null);
    setSliderForm({ title: '', subtitle: '' });
    setSliderPreview('');
  };

  const deleteSlide = (id: string) => {
    if (!window.confirm('Delete this slide?')) return;
    const newSlides = slider.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i }));
    setSlider(newSlides);
    toast.success('Slide deleted');
  };

  const toggleSlideEnabled = (id: string) => {
    setSlider(slider.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const moveSlide = (id: string, dir: 'up' | 'down') => {
    const idx = slider.findIndex(s => s.id === id);
    if (idx === -1) return;
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === slider.length - 1) return;
    const newSlides = [...slider];
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    [newSlides[idx], newSlides[targetIdx]] = [newSlides[targetIdx], newSlides[idx]];
    // Reorder indices
    newSlides.forEach((s, i) => { s.order = i; });
    setSlider(newSlides);
  };

  // â”€â”€ Gallery helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = '';

    setIsUploading(true);
    setUploadProgress(new Array(files.length).fill(0));

    try {
      // Try Cloudinary upload first
      const results = await uploadMultipleToCloudinary(
        files,
        'candid-canvas/gallery',
        (fileIndex, pct) => {
          setUploadProgress(prev => {
            const next = [...prev];
            next[fileIndex] = pct;
            return next;
          });
        }
      );
      const newItems: GalleryItem[] = results.map((r, i) => ({
        id: `gu-${Date.now()}-${i}`,
        url: r.secureUrl,
        title: files[i].name.replace(/\.[^.]+$/, ''),
        category: 'General',
      }));
      setGallery([...gallery, ...newItems]);
      toast.success(`${files.length} image(s) uploaded to Cloudinary â˜ï¸`);
    } catch {
      // Fallback: use blob URLs if Cloudinary is not configured yet
      const newItems: GalleryItem[] = files.map((f, i) => ({
        id: `gu-${Date.now()}-${i}`,
        url: URL.createObjectURL(f),
        title: f.name.replace(/\.[^.]+$/, ''),
        category: 'General',
      }));
      setGallery([...gallery, ...newItems]);
      toast.success(`${files.length} image(s) added (local preview â€” set up Cloudinary for permanent storage)`);
    } finally {
      setIsUploading(false);
      setUploadProgress([]);
    }
  };

  const openEdit = (item: GalleryItem) => {
    setEditGallery(item);
    setEditTitle(item.title);
    setEditCat(item.category);
    setReplacePreview('');
  };

  const handleReplaceSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setReplacePreview(URL.createObjectURL(f));
    e.target.value = '';
  };

  const saveEdit = () => {
    if (!editGallery) return;
    setGallery(gallery.map(g => g.id === editGallery.id
      ? { ...g, title: editTitle, category: editCat, url: replacePreview || g.url }
      : g));
    setEditGallery(null);
    toast.success('Image updated.');
  };

  const deleteImg = (id: string) => {
    if (!window.confirm('Delete this image?')) return;
    setGallery(gallery.filter(g => g.id !== id));
    toast.success('Image deleted.');
  };

  // â”€â”€ Package helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openAdd = () => {
    setEditPkg(null);
    setPkgForm({ name: '', category: 'PHOTO', price: '', description: '', features: '', imageUrl: '' });
    setPkgPreview('');
    setPkgModal(true);
  };

  const openEditPkg = (p: PackageItem) => {
    setEditPkg(p);
    setPkgForm({ name: p.name, category: p.category, price: p.price, description: p.description, features: p.features, imageUrl: p.imageUrl || '' });
    setPkgPreview(p.imageUrl || '');
    setPkgModal(true);
  };

  const handlePkgImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    e.target.value = '';
    try {
      const result = await uploadToCloudinary(f, 'candid-canvas/packages');
      setPkgPreview(result.secureUrl);
      setPkgForm(prev => ({ ...prev, imageUrl: result.secureUrl }));
    } catch {
      // Fallback to blob URL
      const url = URL.createObjectURL(f);
      setPkgPreview(url);
      setPkgForm(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const savePkg = () => {
    if (!pkgForm.name.trim()) { toast.error('Package name is required.'); return; }
    if (editPkg) {
      setPackages(packages.map(pkg => pkg.id === editPkg.id ? { ...pkg, ...pkgForm } : pkg));
      toast.success('Package updated.');
    } else {
      setPackages([...packages, { id: `pkg-${Date.now()}`, ...pkgForm, active: true, popular: false }]);
      toast.success('Package added.');
    }
    setPkgModal(false);
  };

  const deletePkg = (id: string) => {
    if (!window.confirm('Delete this package?')) return;
    setPackages(packages.filter(pkg => pkg.id !== id));
    toast.success('Package deleted.');
  };

  const togglePkgActive = (id: string) => {
    setPackages(packages.map(pkg => pkg.id === id ? { ...pkg, active: !pkg.active } : pkg));
  };

  const togglePkgPopular = (id: string) => {
    setPackages(packages.map(pkg => pkg.id === id ? { ...pkg, popular: !pkg.popular } : pkg));
  };

  // â”€â”€ Review helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const approveReview = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: true } : r));
    toast.success('Review published on home page.');
  };

  const deleteReview = (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    setReviews(reviews.filter(r => r.id !== id));
    toast.success('Review deleted.');
  };

  const addReview = () => {
    const name = prompt('Client name:');
    if (!name?.trim()) return;
    const comment = prompt('Review comment:');
    if (!comment?.trim()) return;
    const service = prompt('Service (e.g. Wedding Photography):') || 'Photography';
    const ratingStr = prompt('Rating (1-5):') || '5';
    const rating = Math.min(5, Math.max(1, parseInt(ratingStr) || 5));
    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      rating,
      comment: comment.trim(),
      service,
      approved: true,
      createdAt: new Date().toISOString(),
    };
    setReviews([...reviews, newReview]);
    toast.success('Review added and published!');
  };

  // â”€â”€ Message helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const markAsRead = async (id: string) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await updateDoc(doc(db, 'messages', id), { status: 'read' });
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
      toast.success('Message marked as read');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await deleteDoc(doc(db, 'messages', id));
      setMessages(messages.filter(m => m.id !== id));
      setViewMessage(null);
      toast.success('Message deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete message');
    }
  };

  const handleLogout = async () => { await logout(); navigate('/sign-in'); };

  const handleRefresh = () => {
    refreshSiteData();
    loadOrders();
    loadStats();
    loadMessages();
    toast.success('Data refreshed!');
  };

  // â”€â”€ Export to Excel (CSV) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const exportOrdersToExcel = () => {
    const headers = ['Order ID', 'Client Name', 'Email', 'Package', 'Event Type', 'Event Date', 'Location', 'Status', 'Created At', 'Notes'];
    const rows = displayedOrders.map(o => [
      o.id, o.client, o.email, o.package, o.event,
      formatDate(o.date), o.location, getStatusLabel(o.status),
      o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
      o.notes || '',
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candid-canvas-orders-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Orders exported to CSV!');
  };

  // â”€â”€ Displayed orders based on filter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const displayedOrders = orders.filter(o => {
    const matchTab = orderTab === 'all' || o.status === orderTab;
    const q = orderSearch.toLowerCase();
    const matchSearch = !q || o.client.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.package.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  // â”€â”€ Stats for overview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const thisMonthBookings = orders.filter(o => {
    if (!o.createdAt) return false;
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <>
      <Helmet><title>Admin Panel â€” Candid Canvas BD</title></Helmet>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Hidden inputs */}
      <input ref={sliderInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        e.target.value = '';
        setIsSliderUploading(true);
        try {
          const result = await uploadToCloudinary(f, 'candid-canvas/slider');
          setSliderPreview(result.secureUrl);
        } catch {
          setSliderPreview(URL.createObjectURL(f));
        } finally {
          setIsSliderUploading(false);
        }
      }} />
      <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      <input ref={replaceInputRef} type="file" accept="image/*" className="hidden" onChange={handleReplaceSelect} />
      <input ref={pkgImgRef} type="file" accept="image/*" className="hidden" onChange={handlePkgImg} />
      <input ref={vacationImgRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setLocalSettings(s => ({ ...s, vacationImage: url }));
        e.target.value = '';
      }} />

      {/* Mobile Sidebar â€” rendered at root level, outside the flex layout */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 left-0 z-[201] w-64 shadow-2xl"
          >
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setSidebarOpen={setSidebarOpen}
              orders={orders}
              messages={messages}
              reviews={reviews}
              user={user}
              onLogout={handleLogout}
            />
          </motion.div>
        </>
      )}

      <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-col w-64 flex-shrink-0">
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSidebarOpen={setSidebarOpen}
            orders={orders}
            messages={messages}
            reviews={reviews}
            user={user}
            onLogout={handleLogout}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Top Bar */}
          <header className="flex-shrink-0 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-[#374151] hover:bg-[#F8F9FA] rounded-lg flex-shrink-0">
                <Menu size={20} />
              </button>
              {/* Logo visible on mobile only */}
              <img src={logoImg} alt="Candid Canvas BD" className="lg:hidden h-7 w-auto object-contain flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="font-semibold text-[#111827] text-base truncate">
                  {ADMIN_NAV.find(n => n.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs text-[#9CA3AF] hidden sm:block">Candid Canvas BD Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {(settings.maintenanceMode || settings.vacationMode) && (
                <span className={`hidden sm:inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${
                  settings.maintenanceMode ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {settings.maintenanceMode ? 'ðŸ”§ Maintenance ON' : 'âœ¨ Special Notice ON'}
                </span>
              )}
              <button onClick={handleRefresh} title="Refresh all data"
                className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA] rounded-lg transition-colors">
                <RefreshCw size={17} />
              </button>
              <button className="relative p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA] rounded-lg">
                <Bell size={17} />
                {orders.filter(o => o.status === 'submitted').length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <Link to="/" className="hidden sm:block text-xs text-[#6B7280] hover:text-[#111827] px-2 py-1 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                â† View Site
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-6">

            {/* â”€â”€ OVERVIEW â”€â”€ */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <p className="text-[#6B7280] text-sm mb-6">
                  Welcome back, <span className="font-semibold text-[#111827]">{user?.displayName || 'Admin'}</span>
                  <span className="text-[#9CA3AF] ml-2 text-xs">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </p>

                {/* Stats Grid - 6 cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
                  {[
                    { label: 'Total Orders', value: orders.length, color: 'bg-blue-50 text-blue-600', icon: ShoppingBag },
                    { label: 'Pending Review', value: orders.filter(o => ['submitted', 'under_review'].includes(o.status)).length, color: 'bg-yellow-50 text-yellow-600', icon: Eye },
                    { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: 'bg-green-50 text-green-600', icon: CheckCircle },
                    { label: 'This Month', value: thisMonthBookings, color: 'bg-indigo-50 text-indigo-600', icon: TrendingUp },
                    { label: 'Registered Users', value: totalUsers, color: 'bg-pink-50 text-pink-600', icon: Users },
                    { label: 'Total Visitors', value: totalVisitors, color: 'bg-orange-50 text-orange-600', icon: Globe },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="bg-white rounded-xl border border-[#E5E7EB] p-4">
                        <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                          <Icon size={16} />
                        </div>
                        <div className="font-heading text-2xl sm:text-3xl text-[#111827] leading-none">{s.value}</div>
                        <div className="text-xs text-[#6B7280] mt-1.5 leading-tight">{s.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Charts + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

                  {/* Bookings chart */}
                  <div className="lg:col-span-2 bg-white rounded-xl border border-[#E5E7EB] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="font-semibold text-[#111827] text-sm">Booking Trend</h2>
                        <p className="text-xs text-[#9CA3AF]">Orders per month this year</p>
                      </div>
                      <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                        <TrendingUp size={12} /> Live Data
                      </span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                        <defs>
                          <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#111827" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                          formatter={(v) => [v, 'Bookings']}
                        />
                        <Area type="monotone" dataKey="bookings" stroke="#111827" strokeWidth={2.5} fill="url(#bookGrad)" dot={{ fill: '#111827', r: 3 }} activeDot={{ r: 5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                    <h2 className="font-semibold text-[#111827] text-sm mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                      {[
                        { label: `${orders.filter(o => ['submitted', 'under_review'].includes(o.status)).length} Orders Pending`, border: 'border-l-yellow-400', tab: 'orders', badge: orders.filter(o => ['submitted', 'under_review'].includes(o.status)).length },
                        { label: `${reviews.filter(r => !r.approved).length} Reviews to Approve`, border: 'border-l-purple-400', tab: 'reviews', badge: reviews.filter(r => !r.approved).length },
                        { label: `${gallery.length} Gallery Images`, border: 'border-l-blue-400', tab: 'gallery', badge: 0 },
                        { label: `${packages.filter(p => p.active).length} Active Packages`, border: 'border-l-green-400', tab: 'packages', badge: 0 },
                        { label: `${orders.filter(o => o.status === 'completed').length} Completed Sessions`, border: 'border-l-gray-400', tab: 'orders', badge: 0 },
                      ].map(a => (
                        <button key={a.label} onClick={() => setActiveTab(a.tab)}
                          className={`w-full text-left px-3 py-2.5 bg-[#F8F9FA] rounded-lg text-xs text-[#374151] hover:bg-[#F0F0F0] border-l-4 ${a.border} transition-colors flex items-center justify-between`}>
                          <span>{a.label}</span>
                          {a.badge > 0 && (
                            <span className="bg-[#111827] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{a.badge}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order status breakdown bar chart */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-6">
                  <h2 className="font-semibold text-[#111827] text-sm mb-4">Order Status Breakdown</h2>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={[
                      { name: 'Submitted', count: orders.filter(o => o.status === 'submitted').length },
                      { name: 'Under Review', count: orders.filter(o => o.status === 'under_review').length },
                      { name: 'Contacted', count: orders.filter(o => o.status === 'contacted').length },
                      { name: 'Approved', count: orders.filter(o => o.status === 'approved').length },
                      { name: 'Completed', count: orders.filter(o => o.status === 'completed').length },
                      { name: 'Rejected', count: orders.filter(o => o.status === 'rejected').length },
                    ]} margin={{ top: 0, right: 5, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                      <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent orders table */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                    <h2 className="font-semibold text-[#111827] text-sm">Recent Orders</h2>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-[#6B7280] hover:text-[#111827] transition-colors">View all â†’</button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-[#9CA3AF] text-sm">No orders yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                          {['Client', 'Package', 'Date', 'Status'].map(h => (
                            <th key={h} className="text-left px-5 py-3 text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                          ))}
                        </tr></thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                          {orders.slice(0, 5).map(o => (
                            <tr key={o.id} className="hover:bg-[#F8F9FA] transition-colors cursor-pointer" onClick={() => setViewOrder(o)}>
                              <td className="px-5 py-3.5">
                                <p className="font-medium text-[#111827]">{o.client}</p>
                                <p className="text-xs text-[#9CA3AF] font-mono">{o.id}</p>
                              </td>
                              <td className="px-5 py-3.5 text-[#374151] capitalize">{o.package}</td>
                              <td className="px-5 py-3.5 text-[#6B7280] text-xs">{formatDate(o.date)}</td>
                              <td className="px-5 py-3.5">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(o.status)}`}>
                                  {getStatusLabel(o.status)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* â”€â”€ ORDERS â”€â”€ */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                {/* Status tabs */}
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                  {[
                    { key: 'all', label: 'All', count: orders.length },
                    { key: 'submitted', label: 'Submitted', count: orders.filter(o => o.status === 'submitted').length },
                    { key: 'under_review', label: 'Under Review', count: orders.filter(o => o.status === 'under_review').length },
                    { key: 'contacted', label: 'Contacted', count: orders.filter(o => o.status === 'contacted').length },
                    { key: 'approved', label: 'Approved', count: orders.filter(o => o.status === 'approved').length },
                    { key: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
                    { key: 'rejected', label: 'Rejected', count: orders.filter(o => o.status === 'rejected').length },
                  ].map(tab => (
                    <button key={tab.key}
                      onClick={() => setOrderTab(tab.key as typeof orderTab)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        orderTab === tab.key
                          ? 'bg-[#111827] text-white border-[#111827]'
                          : 'bg-white text-[#374151] border-[#E5E7EB] hover:border-[#374151]'
                      }`}>
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          orderTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
                        }`}>{tab.count}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Search + Export */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type="text" placeholder="Search by name, ID or package..."
                      value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827] bg-white" />
                  </div>
                  <button
                    onClick={() => { loadOrders(); loadStats(); toast.success('Orders refreshed!'); }}
                    title="Refresh orders"
                    className="flex items-center gap-1.5 px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] hover:border-[#374151] hover:bg-[#F8F9FA] transition-colors bg-white"
                  >
                    <RefreshCw size={14} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  <button
                    onClick={exportOrdersToExcel}
                    title="Export to Excel/CSV"
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                  >
                    <FileSpreadsheet size={14} />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>

                {/* Table */}
                {ordersLoading ? (
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
                    <div className="w-10 h-10 border-4 border-[#E5E7EB] border-t-[#111827] rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-[#9CA3AF]">Loading orders...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                          {['Order ID', 'Client', 'Package', 'Event Date', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr></thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                          {displayedOrders.map(o => (
                            <tr key={o.id} className="hover:bg-[#F8F9FA]">
                              <td className="px-4 py-4 font-mono text-xs text-[#374151] whitespace-nowrap">{o.id}</td>
                              <td className="px-4 py-4">
                                <p className="font-medium text-[#111827]">{o.client}</p>
                                <p className="text-xs text-[#9CA3AF]">{o.email}</p>
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-[#374151] capitalize">{o.package}</p>
                                <p className="text-xs text-[#9CA3AF] capitalize">{o.event}</p>
                              </td>
                              <td className="px-4 py-4 text-[#374151] text-xs whitespace-nowrap">{formatDate(o.date)}</td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(o.status)}`}>
                                  {getStatusLabel(o.status)}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-1 flex-wrap">
                                  <button onClick={() => updateStatusWithEmail(o, 'under_review')} title="Mark Under Review"
                                    className="p-1.5 text-[#9CA3AF] hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                                    <Eye size={14} />
                                  </button>
                                  <button onClick={() => updateStatusWithEmail(o, 'contacted')} title="Mark Contacted"
                                    className="p-1.5 text-[#9CA3AF] hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                    <Mail size={14} />
                                  </button>
                                  <button onClick={() => updateStatusWithEmail(o, 'approved')} title="Approve & Email"
                                    className="p-1.5 text-[#9CA3AF] hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                    <CheckCircle size={14} />
                                  </button>
                                  <button onClick={() => updateStatusWithEmail(o, 'completed')} title="Mark Complete"
                                    className="p-1.5 text-[#9CA3AF] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <Star size={14} />
                                  </button>
                                  <button onClick={() => updateStatusWithEmail(o, 'rejected')} title="Reject & Email"
                                    className="p-1.5 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <XCircle size={14} />
                                  </button>
                                  <button onClick={() => setViewOrder(o)} title="View Details"
                                    className="p-1.5 text-[#9CA3AF] hover:text-[#374151] hover:bg-gray-100 rounded-lg transition-colors">
                                    <ChevronDown size={14} />
                                  </button>
                                  <button onClick={async () => {
                                    if (!window.confirm('Delete this order permanently?')) return;
                                    try {
                                      const { doc, deleteDoc } = await import('firebase/firestore');
                                      const { db } = await import('../lib/firebase');
                                      await deleteDoc(doc(db, 'bookings', o.id));
                                      setOrders(prev => prev.filter(x => x.id !== o.id));
                                      toast.success('Order deleted');
                                    } catch { toast.error('Failed to delete order'); }
                                  }} title="Delete Order"
                                    className="p-1.5 text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {displayedOrders.length === 0 && (
                      <div className="text-center py-12 text-[#9CA3AF]">
                        <ShoppingBag size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No orders found.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Email log */}
                {(() => {
                  const logs = JSON.parse(sessionStorage.getItem('email_logs') || '[]');
                  if (!logs.length) return null;
                  return (
                    <div className="mt-5 bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                      <div className="px-5 py-3 border-b border-[#E5E7EB] flex items-center gap-2">
                        <Mail size={14} className="text-[#374151]" />
                        <h3 className="font-semibold text-[#111827] text-sm">Email Log</h3>
                        <span className="text-xs text-[#9CA3AF]">({logs.length} this session)</span>
                      </div>
                      <div className="divide-y divide-[#F3F4F6]">
                        {logs.slice(0, 5).map((log: { id: number; to: string; toName: string; subject: string; status: string; sentAt: string }) => (
                          <div key={log.id} className="px-5 py-3 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#111827] truncate">{log.toName} <span className="text-[#9CA3AF] font-normal text-xs">({log.to})</span></p>
                              <p className="text-xs text-[#6B7280] truncate">{log.subject}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(log.status)}`}>{getStatusLabel(log.status)}</span>
                              <p className="text-[10px] text-[#9CA3AF] mt-0.5">{new Date(log.sentAt).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* â”€â”€ MESSAGES â”€â”€ */}
            {activeTab === 'messages' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-semibold text-[#111827] text-lg">Contact Messages</h2>
                    <p className="text-xs text-[#9CA3AF] mt-1">Messages from registered users via contact form</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                      {messages.filter(m => m.status === 'unread').length} Unread
                    </span>
                  </div>
                </div>

                {messagesLoading ? (
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
                    <div className="w-10 h-10 border-4 border-[#E5E7EB] border-t-[#111827] rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-[#9CA3AF]">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
                    <MessageSquare size={40} className="text-[#D1D5DB] mx-auto mb-4" />
                    <p className="text-[#6B7280] font-medium">No messages yet</p>
                    <p className="text-xs text-[#9CA3AF] mt-2">Messages from the contact form will appear here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`bg-white rounded-xl border p-5 cursor-pointer hover:shadow-md transition-all ${
                          msg.status === 'unread' ? 'border-blue-300 bg-blue-50/30' : 'border-[#E5E7EB]'
                        }`}
                        onClick={() => setViewMessage(msg)}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-[#111827] text-sm">{msg.userName || msg.name}</h3>
                              {msg.status === 'unread' && (
                                <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                              )}
                            </div>
                            <p className="text-xs text-[#6B7280]">{msg.userEmail || msg.email}</p>
                            {msg.service && (
                              <p className="text-xs text-[#9CA3AF] mt-1">Service: <span className="font-medium">{msg.service}</span></p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-[#9CA3AF]">
                              {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-xs text-[#9CA3AF]">
                              {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-[#374151] line-clamp-2">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* â”€â”€ SLIDER â”€â”€ */}
            {activeTab === 'slider' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                {/* Info banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Image size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Auto-synced with Gallery</p>
                    <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
                      By default the homepage slider shows <strong>all gallery images</strong> automatically.
                      Use the controls below to create custom slider sections with your own title &amp; subtitle â€” these will override the auto mode.
                    </p>
                  </div>
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#6B7280]">
                      {slider.length === 0
                        ? `Auto mode â€” showing ${gallery.length} gallery image${gallery.length !== 1 ? 's' : ''}`
                        : `${slider.length} / 10 custom slides`}
                    </span>
                    {slider.length >= 10 && (
                      <span className="text-xs text-red-500 font-medium">âš  Max limit reached</span>
                    )}
                  </div>
                  {slider.length > 0 && (
                    <button
                      onClick={() => { if (window.confirm('Remove all custom slides and revert to auto gallery mode?')) setSlider([]); }}
                      className="text-xs text-red-500 hover:text-red-700 underline transition-colors"
                    >
                      Reset to Auto
                    </button>
                  )}
                </div>

                {/* â”€â”€ Add / Edit Form â”€â”€ */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-6 shadow-sm">
                  <h3 className="font-semibold text-[#111827] text-sm mb-4">
                    {editSlide ? 'âœï¸ Edit Slide' : '+ Add Custom Slide'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Image Upload */}
                    <div>
                      <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                        Slide Image <span className="text-[#9CA3AF]">(16:9 preferred)</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => sliderInputRef.current?.click()}
                          disabled={isSliderUploading}
                          className="flex items-center gap-2 px-3.5 py-2 bg-[#111827] text-white text-xs rounded-lg hover:bg-[#374151] transition-colors disabled:opacity-60"
                        >
                          {isSliderUploading ? (
                            <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploadingâ€¦</>
                          ) : (
                            <><CloudUpload size={13} />Choose Image</>
                          )}
                        </button>
                        {sliderPreview && (
                          <div className="relative w-24 h-14 rounded-lg border border-[#E5E7EB] overflow-hidden group">
                            <img src={sliderPreview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => setSliderPreview('')}
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                              <Trash2 size={14} className="text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Wedding Stories"
                        value={sliderForm.title}
                        onChange={e => setSliderForm(f => ({ ...f, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
                        Subtitle <span className="text-[#9CA3AF]">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Every moment, perfectly preserved"
                        value={sliderForm.subtitle}
                        onChange={e => setSliderForm(f => ({ ...f, subtitle: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    {editSlide ? (
                      <>
                        <button
                          onClick={updateSlide}
                          disabled={!sliderPreview}
                          className="px-4 py-2 bg-[#111827] text-white text-xs rounded-lg hover:bg-[#374151] transition-colors disabled:opacity-50"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={cancelEditSlide}
                          className="px-4 py-2 bg-[#F3F4F6] text-[#374151] text-xs rounded-lg hover:bg-[#E5E7EB] transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={addSlide}
                        disabled={!sliderPreview || slider.length >= 10}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#111827] text-white text-xs rounded-lg hover:bg-[#374151] transition-colors disabled:opacity-50"
                      >
                        <Plus size={13} /> Add Slide
                      </button>
                    )}
                  </div>
                </div>

                {/* â”€â”€ Gallery quick-add pool â”€â”€ */}
                {gallery.length > 0 && slider.length < 10 && !editSlide && (
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-6 shadow-sm">
                    <h3 className="font-semibold text-[#111827] text-sm mb-1">Pick from Gallery</h3>
                    <p className="text-xs text-[#9CA3AF] mb-4">Click an image to add it directly as a slide</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {gallery.map(img => {
                        const alreadyAdded = slider.some(s => s.url === img.url);
                        return (
                          <button
                            key={img.id}
                            disabled={alreadyAdded || slider.length >= 10}
                            onClick={() => {
                              if (alreadyAdded) return;
                              const newSlide: SliderItem = {
                                id: `slide-${Date.now()}`,
                                url: img.url,
                                title: img.title,
                                subtitle: img.category,
                                enabled: true,
                                order: slider.length,
                              };
                              setSlider([...slider, newSlide]);
                              toast.success(`"${img.title}" added to slider`);
                            }}
                            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                              alreadyAdded
                                ? 'border-green-400 opacity-60 cursor-not-allowed'
                                : 'border-transparent hover:border-[#111827] cursor-pointer hover:scale-105'
                            }`}
                            title={alreadyAdded ? 'Already in slider' : `Add "${img.title}"`}
                          >
                            <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                            {alreadyAdded && (
                              <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                                <CheckCircle size={16} className="text-green-700" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* â”€â”€ Custom Slides List â”€â”€ */}
                {slider.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-[#111827] text-sm">Custom Slides ({slider.length})</h3>
                    {slider.map((slide, idx) => (
                      <div key={slide.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center gap-4 shadow-sm">
                        {/* Thumbnail */}
                        <div className="w-28 h-16 rounded-lg overflow-hidden bg-[#F8F9FA] flex-shrink-0">
                          <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[#9CA3AF] text-xs font-mono">#{idx + 1}</span>
                            <h4 className="font-semibold text-[#111827] text-sm truncate">{slide.title || 'Untitled'}</h4>
                          </div>
                          {slide.subtitle && <p className="text-[#6B7280] text-xs truncate">{slide.subtitle}</p>}
                          <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            slide.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {slide.enabled ? 'Visible' : 'Hidden'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {idx > 0 && (
                            <button onClick={() => moveSlide(slide.id, 'up')} title="Move up"
                              className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA] rounded-lg transition-colors">
                              <ChevronDown size={14} className="rotate-180" />
                            </button>
                          )}
                          {idx < slider.length - 1 && (
                            <button onClick={() => moveSlide(slide.id, 'down')} title="Move down"
                              className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA] rounded-lg transition-colors">
                              <ChevronDown size={14} />
                            </button>
                          )}
                          <button onClick={() => toggleSlideEnabled(slide.id)} title={slide.enabled ? 'Hide' : 'Show'}
                            className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FA] rounded-lg transition-colors">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => openEditSlide(slide)}
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => deleteSlide(slide.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state for custom slides */}
                {slider.length === 0 && gallery.length === 0 && (
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-10 text-center">
                    <Image size={36} className="text-[#D1D5DB] mx-auto mb-3" />
                    <p className="text-[#374151] font-medium text-sm">No gallery images yet</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">Upload images to the Gallery tab first â€” they will automatically appear in the homepage slider</p>
                  </div>
                )}

              </motion.div>
            )}

            {/* â”€â”€ GALLERY â”€â”€ */}
            {activeTab === 'gallery' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[#6B7280] text-sm">{gallery.length} image{gallery.length !== 1 ? 's' : ''}</p>
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors disabled:opacity-60"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploadingâ€¦
                      </>
                    ) : (
                      <><Upload size={14} /> Upload Images</>
                    )}
                  </button>
                </div>

                {/* Upload Progress */}
                {isUploading && uploadProgress.length > 0 && (
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-5">
                    <p className="text-xs font-semibold text-[#374151] mb-3 flex items-center gap-2">
                      <CloudUpload size={14} className="text-blue-500" />
                      Uploading to Cloudinaryâ€¦
                    </p>
                    {uploadProgress.map((pct, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <div className="flex justify-between text-[10px] text-[#9CA3AF] mb-1">
                          <span>Image {i + 1}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-200"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {gallery.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-[#D1D5DB]">
                    <Image size={40} className="text-[#D1D5DB] mx-auto mb-4" />
                    <p className="text-[#374151] font-medium mb-1">No gallery images yet</p>
                    <p className="text-sm text-[#9CA3AF] mb-4">Upload images to display in your gallery</p>
                    <button onClick={() => galleryInputRef.current?.click()}
                      className="px-5 py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
                      Upload First Image
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {gallery.map(item => (
                      <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                          <p className="text-white text-[11px] font-medium truncate">{item.title}</p>
                          <p className="text-white/60 text-[10px]">{item.category}</p>
                          <div className="flex gap-1.5 mt-2">
                            <button onClick={() => openEdit(item)} className="p-1.5 bg-white/90 rounded-lg text-[#374151] hover:text-blue-600 transition-colors shadow-sm">
                              <Edit size={12} />
                            </button>
                            <button onClick={() => deleteImg(item.id)} className="p-1.5 bg-white/90 rounded-lg text-[#374151] hover:text-red-500 transition-colors shadow-sm">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => galleryInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-[#D1D5DB] flex flex-col items-center justify-center hover:border-[#374151] hover:bg-[#F8F9FA] transition-colors cursor-pointer">
                      <Plus size={20} className="text-[#9CA3AF] mb-1" />
                      <p className="text-xs text-[#9CA3AF]">Add More</p>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* â”€â”€ PACKAGES â”€â”€ */}
            {activeTab === 'packages' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                  <p className="text-[#6B7280] text-sm">{packages.length} package{packages.length !== 1 ? 's' : ''}</p>
                  <button onClick={openAdd}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
                    <Plus size={14} /> Add Package
                  </button>
                </div>
                {packages.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-[#D1D5DB]">
                    <Package size={40} className="text-[#D1D5DB] mx-auto mb-4" />
                    <p className="text-[#374151] font-medium mb-1">No packages yet</p>
                    <p className="text-sm text-[#9CA3AF] mb-4">Create your first photography package</p>
                    <button onClick={openAdd} className="px-5 py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
                      Create Package
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                          {['Image', 'Name', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">{h}</th>
                          ))}
                        </tr></thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                          {packages.map(pkg => (
                            <tr key={pkg.id} className="hover:bg-[#F8F9FA]">
                              <td className="px-4 py-4">
                                {pkg.imageUrl ? (
                                  <img src={pkg.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#E5E7EB]" />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center border border-[#E5E7EB]">
                                    <Image size={16} className="text-[#9CA3AF]" />
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-4">
                                <p className="font-medium text-[#111827]">{pkg.name}</p>
                                {pkg.popular && <span className="text-[10px] bg-[#111827] text-white px-1.5 py-0.5 rounded-full">â­ Popular</span>}
                              </td>
                              <td className="px-4 py-4 font-mono text-xs text-[#374151]">{pkg.category}</td>
                              <td className="px-4 py-4 font-semibold text-[#111827]">{pkg.price}</td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pkg.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                  {pkg.active ? 'Active' : 'Archived'}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-1">
                                  <button onClick={() => openEditPkg(pkg)} title="Edit" className="p-1.5 text-[#9CA3AF] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={14} /></button>
                                  <button onClick={() => togglePkgActive(pkg.id)} title="Toggle Active" className="p-1.5 text-[#9CA3AF] hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"><RefreshCw size={14} /></button>
                                  <button onClick={() => togglePkgPopular(pkg.id)} title="Toggle Popular" className="p-1.5 text-[#9CA3AF] hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"><Star size={14} /></button>
                                  <button onClick={() => deletePkg(pkg.id)} title="Delete" className="p-1.5 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* â”€â”€ REVIEWS â”€â”€ */}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[#6B7280] text-sm">
                    {reviews.filter(r => !r.approved).length} pending Â· {reviews.filter(r => r.approved).length} published
                  </p>
                  <button onClick={addReview}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
                    <Plus size={14} /> Add Review
                  </button>
                </div>
                <div className="space-y-3">
                  {reviews.map(r => (
                    <div key={r.id} className={`bg-white rounded-xl border p-5 ${!r.approved ? 'border-yellow-200 bg-yellow-50/20' : 'border-[#E5E7EB]'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="font-semibold text-sm text-[#111827]">{r.name}</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <span key={j} className={j < r.rating ? 'text-[#F59E0B] text-sm' : 'text-[#E5E7EB] text-sm'}>â˜…</span>
                              ))}
                            </div>
                            <span className="text-xs bg-[#F3F4F6] text-[#9CA3AF] px-2 py-0.5 rounded-full">{r.service}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {r.approved ? 'âœ… Published' : 'â³ Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-[#374151] italic">"{r.comment}"</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!r.approved && (
                            <button onClick={() => approveReview(r.id)} title="Approve & Publish"
                              className="p-1.5 text-[#9CA3AF] hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button onClick={() => deleteReview(r.id)} title="Delete"
                            className="p-1.5 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-[#E5E7EB]">
                      <Star size={36} className="text-[#D1D5DB] mx-auto mb-3" />
                      <p className="text-[#374151] font-medium mb-1">No reviews yet</p>
                      <p className="text-xs text-[#9CA3AF] mb-4">Add your first client review to display on the home page</p>
                      <button onClick={addReview} className="px-5 py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
                        Add First Review
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* â”€â”€ SETTINGS â”€â”€ */}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-2xl space-y-5">

                {/* Hero */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                  <h3 className="font-semibold text-[#111827] mb-4">Hero Section</h3>
                  <div className="space-y-3">
                    {(['heroTitle', 'heroSubtitle'] as const).map(key => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-[#6B7280] mb-1.5 uppercase tracking-wide">
                          {key === 'heroTitle' ? 'Hero Title' : 'Hero Subtitle'}
                        </label>
                        <input value={localSettings[key]}
                          onChange={e => setLocalSettings(s => ({ ...s, [key]: e.target.value }))}
                          className="w-full border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827]" />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setSettings(localSettings); toast.success('Hero settings saved âœ“'); }}
                    className="mt-4 px-5 py-2 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
                    Save
                  </button>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                  <h3 className="font-semibold text-[#111827] mb-4">Contact Info</h3>
                  <div className="space-y-3">
                    {([
                      { label: 'Phone / WhatsApp', key: 'phone' as const },
                      { label: 'Email', key: 'email' as const },
                    ]).map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-[#6B7280] mb-1.5 uppercase tracking-wide">{f.label}</label>
                        <input value={localSettings[f.key]}
                          onChange={e => setLocalSettings(s => ({ ...s, [f.key]: e.target.value }))}
                          className="w-full border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827]" />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setSettings(localSettings); toast.success('Contact info saved âœ“'); }}
                    className="mt-4 px-5 py-2 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
                    Save
                  </button>
                </div>

                {/* Maintenance Mode */}
                <div className={`bg-white rounded-xl border p-6 ${localSettings.maintenanceMode ? 'border-red-200' : 'border-[#E5E7EB]'}`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Wrench size={16} className="text-[#374151]" />
                        <h3 className="font-semibold text-[#111827]">Maintenance Mode</h3>
                      </div>
                      <p className="text-xs text-[#9CA3AF]">Visitors see a maintenance page. Admin can still access the site.</p>
                      {localSettings.maintenanceMode && <p className="text-xs text-red-600 font-medium mt-1">âš  Site is currently in maintenance mode</p>}
                    </div>
                    <button onClick={() => {
                      const next = !localSettings.maintenanceMode;
                      const updated: SiteSettings = { ...localSettings, maintenanceMode: next, vacationMode: next ? false : localSettings.vacationMode };
                      setLocalSettings(updated);
                      setSettings(updated);
                      toast.success(next ? 'ðŸ”§ Maintenance mode enabled' : 'Maintenance mode disabled');
                    }} className={`relative inline-flex h-6 w-11 rounded-full transition-colors flex-shrink-0 focus:outline-none ${localSettings.maintenanceMode ? 'bg-red-500' : 'bg-[#E5E7EB]'}`}>
                      <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${localSettings.maintenanceMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5 uppercase tracking-wide">Maintenance Message</label>
                    <textarea value={localSettings.maintenanceMessage}
                      onChange={e => setLocalSettings(s => ({ ...s, maintenanceMessage: e.target.value }))}
                      rows={2} className="w-full border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827] resize-none" />
                  </div>
                  <button onClick={() => { setSettings(localSettings); toast.success('Maintenance message saved âœ“'); }}
                    className="mt-4 px-5 py-2 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
                    Save Message
                  </button>
                </div>

                {/* Special Notice Mode (formerly Vacation Mode) */}
                <div className={`bg-white rounded-xl border p-6 ${localSettings.vacationMode ? 'border-amber-200' : 'border-[#E5E7EB]'}`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Bell size={16} className="text-[#374151]" />
                        <h3 className="font-semibold text-[#111827]">Special Notice Mode</h3>
                      </div>
                      <p className="text-xs text-[#9CA3AF]">Show a custom notice to visitors (Eid, event, closure, etc). New bookings are paused.</p>
                      {localSettings.vacationMode && <p className="text-xs text-amber-600 font-medium mt-1">âœ¨ Special notice is currently active</p>}
                    </div>
                    <button onClick={() => {
                      const next = !localSettings.vacationMode;
                      const updated: SiteSettings = { ...localSettings, vacationMode: next, maintenanceMode: next ? false : localSettings.maintenanceMode };
                      setLocalSettings(updated);
                      setSettings(updated);
                      toast.success(next ? 'âœ¨ Special notice enabled' : 'Special notice disabled');
                    }} className={`relative inline-flex h-6 w-11 rounded-full transition-colors flex-shrink-0 focus:outline-none ${localSettings.vacationMode ? 'bg-amber-500' : 'bg-[#E5E7EB]'}`}>
                      <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${localSettings.vacationMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#6B7280] mb-1.5 uppercase tracking-wide">Notice Title</label>
                      <input
                        value={localSettings.vacationTitle || ''}
                        onChange={e => setLocalSettings(s => ({ ...s, vacationTitle: e.target.value }))}
                        placeholder="e.g. Eid Mubarak! / Holiday Break / Studio Closed"
                        className="w-full border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6B7280] mb-1.5 uppercase tracking-wide">Notice Message</label>
                      <textarea value={localSettings.vacationMessage}
                        onChange={e => setLocalSettings(s => ({ ...s, vacationMessage: e.target.value }))}
                        rows={2} className="w-full border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827] resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6B7280] mb-1.5 uppercase tracking-wide flex items-center gap-1">
                        <Calendar size={11} /> Return Date (optional)
                      </label>
                      <input type="date" value={localSettings.vacationEndDate}
                        onChange={e => setLocalSettings(s => ({ ...s, vacationEndDate: e.target.value }))}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6B7280] mb-1.5 uppercase tracking-wide flex items-center gap-1">
                        <Image size={11} /> Background Image (optional)
                      </label>
                      <p className="text-[10px] text-[#9CA3AF] mb-2">Upload an Eid card, event banner, or any image as the background of the notice page.</p>
                      <div
                        onClick={() => vacationImgRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-[#D1D5DB] rounded-xl overflow-hidden hover:border-[#374151] transition-colors"
                      >
                        {localSettings.vacationImage ? (
                          <div className="relative">
                            <img src={localSettings.vacationImage} alt="Notice background" className="w-full h-32 object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-medium">Click to replace</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-24 flex flex-col items-center justify-center gap-2">
                            <Upload size={18} className="text-[#9CA3AF]" />
                            <p className="text-xs text-[#9CA3AF]">Click to upload background image</p>
                          </div>
                        )}
                      </div>
                      {localSettings.vacationImage && (
                        <button
                          onClick={() => setLocalSettings(s => ({ ...s, vacationImage: '' }))}
                          className="mt-2 text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          Remove image
                        </button>
                      )}
                    </div>
                  </div>
                  <button onClick={() => { setSettings(localSettings); toast.success('Special notice settings saved âœ“'); }}
                    className="mt-4 px-5 py-2 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
                    Save Settings
                  </button>

                {/* Change Password */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Settings size={16} className="text-[#374151]" />
                    <h3 className="font-semibold text-[#111827]">Change Password</h3>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mb-4">Update your admin account password.</p>
                  <div className="space-y-3 max-w-sm">
                    <input
                      id="new-password-input"
                      type="password"
                      placeholder="New password (min 6 characters)"
                      className="w-full border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                    <button
                      onClick={async () => {
                        const input = document.getElementById('new-password-input') as HTMLInputElement;
                        const newPwd = input?.value?.trim();
                        if (!newPwd || newPwd.length < 6) { toast.error('Password must be at least 6 characters'); return; }
                        try {
                          const { updatePassword } = await import('firebase/auth');
                          const { auth } = await import('../lib/firebase');
                          if (!auth.currentUser) { toast.error('Not authenticated'); return; }
                          await updatePassword(auth.currentUser, newPwd);
                          input.value = '';
                          toast.success('Password updated successfully');
                        } catch (e: unknown) {
                          const msg = (e as { message?: string })?.message || '';
                          if (msg.includes('requires-recent-login')) {
                            toast.error('Please sign out and sign in again before changing password');
                          } else {
                            toast.error('Failed to update password');
                          }
                        }
                      }}
                      className="w-full py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
                </div>

              </motion.div>
            )}

          </main>
        </div>
      </div>

      {/* â”€â”€ Mobile Bottom Nav Bar (like StarTech) â”€â”€ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#111827] border-t border-white/10 shadow-2xl">
        <div className="flex items-center justify-around px-1 py-1.5">
          {ADMIN_NAV.slice(0, 5).map(({ id, label, icon: Icon }) => {
            const pendingOrders = id === 'orders' ? orders.filter(o => ['submitted', 'under_review'].includes(o.status)).length : 0;
            const unreadMsgs = id === 'messages' ? messages.filter(m => m.status === 'unread').length : 0;
            const pendingReviews = id === 'reviews' ? reviews.filter(r => !r.approved).length : 0;
            const badge = pendingOrders || unreadMsgs || pendingReviews;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[48px] relative ${
                  activeTab === id ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {activeTab === id && (
                  <span className="absolute inset-0 bg-white/10 rounded-xl" />
                )}
                <div className="relative">
                  <Icon size={18} />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white leading-none">{badge > 9 ? '9+' : badge}</span>
                  )}
                </div>
                <span className="text-[9px] font-medium leading-none">{label}</span>
              </button>
            );
          })}
          {/* Settings button */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[48px] relative ${
              activeTab === 'settings' ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {activeTab === 'settings' && <span className="absolute inset-0 bg-white/10 rounded-xl" />}
            <Settings size={18} />
            <span className="text-[9px] font-medium leading-none">Settings</span>
          </button>
        </div>
      </div>

      <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title="Order Details" size="md">
        {viewOrder && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#374151] bg-[#F3F4F6] px-2.5 py-1 rounded-lg">{viewOrder.id}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewOrder.status)}`}>
                {getStatusLabel(viewOrder.status)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Client', v: viewOrder.client },
                { l: 'Email', v: viewOrder.email },
                { l: 'Package', v: viewOrder.package },
                { l: 'Event', v: viewOrder.event },
                { l: 'Date', v: formatDate(viewOrder.date) },
                { l: 'Location', v: viewOrder.location },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-0.5">{l}</p>
                  <p className="text-sm text-[#111827] font-medium capitalize">{v}</p>
                </div>
              ))}
            </div>
            {viewOrder.notes && (
              <div>
                <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-[#374151] bg-[#F8F9FA] rounded-lg p-3 italic">{viewOrder.notes}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2 border-t border-[#E5E7EB]">
              <button onClick={() => { updateStatusWithEmail(viewOrder, 'approved'); setViewOrder(null); }}
                className="flex-1 py-2.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors">
                <CheckCircle size={14} /> Approve + Email
              </button>
              <button onClick={() => { updateStatusWithEmail(viewOrder, 'rejected'); setViewOrder(null); }}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 flex items-center justify-center gap-2 transition-colors">
                <XCircle size={14} /> Reject + Email
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* â”€â”€ Email Preview Modal â”€â”€ */}
      <EmailPreviewModal
        isOpen={!!emailModalData}
        onClose={() => setEmailModalData(null)}
        data={emailModalData}
        onSend={() => toast.success('Email sent successfully!')}
      />

      {/* â”€â”€ Edit Gallery Modal â”€â”€ */}
      <Modal isOpen={!!editGallery} onClose={() => setEditGallery(null)} title="Edit Image" size="sm">
        <div className="p-6 space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-[#E5E7EB]">
            <img src={replacePreview || editGallery?.url || ''} alt="" className="w-full h-44 object-cover" />
            <button onClick={() => replaceInputRef.current?.click()}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white text-[#111827] text-xs font-medium px-3 py-2 rounded-lg shadow-lg hover:bg-[#F8F9FA] border border-[#E5E7EB] transition-colors">
              <RefreshCw size={11} /> Replace
            </button>
            {replacePreview && <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">New image selected</div>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">Title</label>
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">Category</label>
            <select value={editCat} onChange={e => setEditCat(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#111827]">
              {GALLERY_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={saveEdit} className="w-full py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
            Save Changes
          </button>
        </div>
      </Modal>

      {/* â”€â”€ Package Modal â”€â”€ */}
      <Modal isOpen={pkgModal} onClose={() => setPkgModal(false)} title={editPkg ? 'Edit Package' : 'New Package'} size="md">
        <div className="p-6 space-y-4">
          <div onClick={() => pkgImgRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-[#D1D5DB] rounded-xl overflow-hidden hover:border-[#374151] transition-colors">
            {pkgPreview ? (
              <img src={pkgPreview} alt="" className="w-full h-36 object-cover" />
            ) : (
              <div className="h-32 flex flex-col items-center justify-center gap-2">
                <Upload size={20} className="text-[#9CA3AF]" />
                <p className="text-sm text-[#9CA3AF]">Click to upload package image</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1 uppercase tracking-wide">Name *</label>
              <input value={pkgForm.name} onChange={e => setPkgForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Signature"
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1 uppercase tracking-wide">Category</label>
              <select value={pkgForm.category} onChange={e => setPkgForm(p => ({ ...p, category: e.target.value }))}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#111827]">
                {['PHOTO', 'CINE', 'REELS', 'EVENTS', 'PHOTO+CINE', 'FULL'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1 uppercase tracking-wide">Price</label>
            <input value={pkgForm.price} onChange={e => setPkgForm(p => ({ ...p, price: e.target.value }))}
              placeholder="e.g. à§³35,000"
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1 uppercase tracking-wide">Short Description</label>
            <input value={pkgForm.description} onChange={e => setPkgForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Brief description..."
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1 uppercase tracking-wide">Features (one per line)</label>
            <textarea value={pkgForm.features} onChange={e => setPkgForm(p => ({ ...p, features: e.target.value }))}
              rows={4} placeholder={'8 hours coverage\n300 edited photos\nCinematic video'}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827] resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPkgModal(false)}
              className="flex-1 py-2.5 border border-[#E5E7EB] text-[#374151] text-sm rounded-lg hover:border-[#374151] transition-colors">
              Cancel
            </button>
            <button onClick={savePkg}
              className="flex-1 py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
              {editPkg ? 'Save Changes' : 'Add Package'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Message Modal */}
      {viewMessage && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewMessage(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-[#111827]">{viewMessage.userName || viewMessage.name}</h2>
                <p className="text-xs text-[#6B7280] mt-0.5">{viewMessage.userEmail || viewMessage.email}</p>
                {viewMessage.phone && <p className="text-xs text-[#9CA3AF]">ðŸ“ž {viewMessage.phone}</p>}
              </div>
              <button onClick={() => setViewMessage(null)}
                className="p-1.5 text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors flex-shrink-0">
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {viewMessage.service && (
                <div className="bg-[#F8F9FA] rounded-xl px-4 py-3">
                  <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-1">Service Interest</p>
                  <p className="text-sm text-[#111827] font-medium capitalize">{viewMessage.service}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">Message</p>
                <p className="text-sm text-[#374151] leading-relaxed bg-[#F8F9FA] rounded-xl p-4">{viewMessage.message}</p>
              </div>
              <p className="text-xs text-[#9CA3AF]">
                Received: {new Date(viewMessage.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <div className="px-6 py-4 border-t border-[#E5E7EB] flex gap-3">
              {viewMessage.status === 'unread' && (
                <button
                  onClick={() => { markAsRead(viewMessage.id); setViewMessage({ ...viewMessage, status: 'read' }); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#111827] text-white text-sm font-medium rounded-xl hover:bg-[#374151] transition-colors"
                >
                  <CheckCircle size={14} /> Mark as Read
                </button>
              )}
              <a
                href={`mailto:${viewMessage.userEmail || viewMessage.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#E5E7EB] text-[#374151] text-sm font-medium rounded-xl hover:border-[#374151] transition-colors"
              >
                <Mail size={14} /> Reply via Email
              </a>
              <button
                onClick={() => deleteMessage(viewMessage.id)}
                className="p-2.5 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
