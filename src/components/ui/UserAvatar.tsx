/**
 * UserAvatar — renders a Google profile photo or initial fallback.
 * Google profile photos require referrerPolicy="no-referrer" to load correctly.
 * Do NOT add crossOrigin="anonymous" — it forces a CORS preflight that Google blocks.
 */

import { useState } from 'react';

interface UserAvatarProps {
  photoURL?: string | null;
  displayName?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shape?: 'circle' | 'rounded';
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-2xl',
};

const SHAPE_MAP = {
  circle: 'rounded-full',
  rounded: 'rounded-xl',
};

export default function UserAvatar({
  photoURL,
  displayName,
  size = 'sm',
  className = '',
  shape = 'circle',
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = SIZE_MAP[size];
  const shapeClass = SHAPE_MAP[shape];
  const initial = displayName?.[0]?.toUpperCase() || 'A';

  // Attempt to load photo — if photoURL is null/undefined or errors, show initial
  const showImage = !!(photoURL && !imgError);

  return (
    <div className={`${sizeClass} ${shapeClass} flex-shrink-0 overflow-hidden ${className}`}>
      {showImage ? (
        <img
          src={photoURL!}
          alt={displayName || 'User'}
          className={`w-full h-full object-cover ${shapeClass}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`w-full h-full ${shapeClass} bg-gradient-to-br from-[#111827] to-[#374151] flex items-center justify-center text-white font-bold`}
          style={{ fontSize: size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'md' ? 14 : size === 'lg' ? 16 : 24 }}
        >
          {initial}
        </div>
      )}
    </div>
  );
}
