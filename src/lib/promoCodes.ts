export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  active: boolean;
  createdAt: string;
}

export interface PromoValidationResult {
  valid: boolean;
  promo?: PromoCode;
  error?: string;
  discountDisplay?: string;
}

export function calculateDiscount(promo: PromoCode, basePrice: number): number {
  if (promo.discountType === 'percentage') {
    return Math.round(basePrice * (promo.discountValue / 100));
  }
  return Math.min(promo.discountValue, basePrice > 0 ? basePrice : promo.discountValue);
}

export async function validatePromoCode(code: string): Promise<PromoValidationResult> {
  try {
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    const { db } = await import('./firebase');

    const q = query(
      collection(db, 'promoCodes'),
      where('code', '==', code.trim().toUpperCase()),
      where('active', '==', true)
    );
    const snap = await getDocs(q);

    if (snap.empty) return { valid: false, error: 'Invalid promo code' };

    const promo = { id: snap.docs[0].id, ...snap.docs[0].data() } as PromoCode;
    const now = new Date();

    if (promo.expiryDate && new Date(promo.expiryDate) < now) {
      return { valid: false, error: 'This promo code has expired' };
    }
    if (promo.startDate && new Date(promo.startDate) > now) {
      return { valid: false, error: 'This promo code is not active yet' };
    }
    if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit) {
      return { valid: false, error: 'This promo code has reached its usage limit' };
    }

    const discountDisplay = promo.discountType === 'percentage'
      ? `${promo.discountValue}% off`
      : `৳${promo.discountValue.toLocaleString()} off`;

    return { valid: true, promo, discountDisplay };
  } catch {
    return { valid: false, error: 'Failed to validate promo code' };
  }
}

export async function generateBookingId(): Promise<string> {
  const { doc, runTransaction } = await import('firebase/firestore');
  const { db } = await import('./firebase');
  const year = new Date().getFullYear();
  const counterRef = doc(db, 'siteData', `bookingCounter_${year}`);

  const newNum = await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    const current = counterDoc.exists() ? (counterDoc.data()?.count || 0) : 0;
    const next = current + 1;
    transaction.set(counterRef, { count: next, year });
    return next;
  });

  return `CC-${year}-${String(newNum).padStart(4, '0')}`;
}
