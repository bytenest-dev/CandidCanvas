/**
 * UserAvatar — renders a Google profile photo or initial fallback.
 * Google profile photos require referrerPolicy="no-referrer" to load correctly
 * in cross-origin contexts (CORS restriction on lh3.googleusercontent.com).
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
  sm: 'w-8 h-8 text-sm',
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
  const initial = displayName?.[0]?.toUpperCase() || 'U';

  const showImage = photoURL && !imgError;

  return (
    <div className={`${sizeClass} ${shapeClass} flex-shrink-0 overflow-hidden ${className}`}>
      {showImage ? (
        <img
          src={photoURL}
          alt={displayName || 'User'}
          className={`w-full h-full object-cover ${shapeClass}`}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`w-full h-full ${shapeClass} bg-gradient-to-br from-[#111827] to-[#374151] flex items-center justify-center text-white font-bold ${sizeClass.split(' ').find(c => c.startsWith('text-')) || 'text-sm'}`}>
          {initial}
        </div>
      )}
    </div>
  );
}
