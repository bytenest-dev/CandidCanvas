// Referral system — each user gets a unique referral code
// When someone books using it, both referrer and referee get a discount promo

export interface ReferralData {
  uid: string;
  code: string;          // e.g. "REF-ABCD12"
  referredCount: number; // how many bookings used this code
  earnedDiscounts: number; // how many discounts the referrer has earned
  createdAt: string;
}

/** Generate a unique referral code for a user */
function generateCode(uid: string): string {
  // Take first 4 chars of uid + 4 random alphanum chars
  const base = uid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `REF-${base}${rand}`;
}

/** Get or create a referral record for the user */
export async function getOrCreateReferral(uid: string, displayName: string): Promise<ReferralData> {
  const { doc, getDoc, setDoc } = await import('firebase/firestore');
  const { db } = await import('./firebase');
  const ref = doc(db, 'referrals', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { uid, ...snap.data() } as ReferralData;
  }
  const newRef: ReferralData = {
    uid,
    code: generateCode(uid),
    referredCount: 0,
    earnedDiscounts: 0,
    createdAt: new Date().toISOString(),
  };
  await setDoc(ref, { code: newRef.code, referredCount: 0, earnedDiscounts: 0, createdAt: newRef.createdAt, displayName });
  return newRef;
}

/**
 * Validate a referral code — called during booking.
 * Returns the referrer UID if valid, or null.
 */
export async function validateReferralCode(code: string): Promise<{ valid: boolean; referrerUid?: string; error?: string }> {
  if (!code.trim().startsWith('REF-')) return { valid: false, error: 'Not a referral code' };
  try {
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    const { db } = await import('./firebase');
    const q = query(collection(db, 'referrals'), where('code', '==', code.trim().toUpperCase()));
    const snap = await getDocs(q);
    if (snap.empty) return { valid: false, error: 'Referral code not found' };
    return { valid: true, referrerUid: snap.docs[0].id };
  } catch {
    return { valid: false, error: 'Failed to validate' };
  }
}

/**
 * After a booking with a referral code is approved/completed,
 * increment referrer's count and create promo codes for both parties.
 * Call this from admin when marking a booking as approved.
 */
export async function rewardReferral(referrerUid: string, refereeEmail: string, refereeUid: string): Promise<void> {
  try {
    const { doc, updateDoc, increment, addDoc, collection, getDocs, query, where } = await import('firebase/firestore');
    const { db } = await import('./firebase');

    // Increment referrer count
    await updateDoc(doc(db, 'referrals', referrerUid), { referredCount: increment(1), earnedDiscounts: increment(1) });

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 3); // 3-month validity
    const expiryStr = expiry.toISOString().slice(0, 10);

    // Check if reward promos already created for this pair
    const existingQ = query(collection(db, 'promoCodes'), where('referralRewardFor', '==', refereeUid));
    const existing = await getDocs(existingQ);
    if (!existing.empty) return; // already rewarded

    // Create 10% off promo for referrer
    const referrerUserDoc = await import('firebase/firestore').then(({ doc: d, getDoc: g }) => g(d(db, 'referrals', referrerUid)));
    const referrerCode = `REFREWARD-${referrerUid.slice(0, 6).toUpperCase()}`;
    await addDoc(collection(db, 'promoCodes'), {
      code: referrerCode,
      discountType: 'percentage',
      discountValue: 10,
      startDate: new Date().toISOString().slice(0, 10),
      expiryDate: expiryStr,
      usageLimit: 1,
      usageCount: 0,
      active: true,
      createdAt: new Date().toISOString(),
      isReferralReward: true,
      referralRewardFor: referrerUid,
      description: 'Referral reward — 10% off your next booking',
    });

    // Create 5% off promo for referee
    const refereeCode = `REFWELCOME-${refereeUid.slice(0, 6).toUpperCase()}`;
    await addDoc(collection(db, 'promoCodes'), {
      code: refereeCode,
      discountType: 'percentage',
      discountValue: 5,
      startDate: new Date().toISOString().slice(0, 10),
      expiryDate: expiryStr,
      usageLimit: 1,
      usageCount: 0,
      active: true,
      createdAt: new Date().toISOString(),
      isReferralReward: true,
      referralRewardFor: refereeUid,
      description: 'Welcome discount — 5% off your first booking',
    });

    // Create notification for referrer
    await addDoc(collection(db, 'notifications'), {
      userId: referrerUid,
      type: 'referral_reward',
      title: 'Referral Reward Earned! 🎉',
      message: `Someone used your referral code and booked! You earned a 10% discount on your next booking. Code: ${referrerCode}`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    // Create notification for referee
    if (refereeUid) {
      await addDoc(collection(db, 'notifications'), {
        userId: refereeUid,
        type: 'referral_welcome',
        title: 'Welcome Discount! 🎁',
        message: `Your referral discount is ready. Use code ${refereeCode} for 5% off your next booking.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error('Referral reward error:', err);
  }
}
