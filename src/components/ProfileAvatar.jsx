import React, { useEffect, useState } from 'react';
import { getProxiedProfileImageUrl } from '../utils/profileImage';

export default function ProfileAvatar({
  src,
  alt = '',
  size = 80,
  fallbackLetter = '?',
  style,
  className,
}) {
  const [failed, setFailed] = useState(false);
  const displaySrc = getProxiedProfileImageUrl(src);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const boxStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    ...style,
  };

  if (!displaySrc || failed) {
    return (
      <div
        className={className}
        style={{
          ...boxStyle,
          backgroundColor: '#363636',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.4,
          border: '2px solid #000',
          color: '#fff',
          fontWeight: 600,
        }}
        aria-hidden={!alt}
      >
        {fallbackLetter}
      </div>
    );
  }

  return (
    <img
      className={className}
      src={displaySrc}
      alt={alt}
      width={size}
      height={size}
      referrerPolicy="no-referrer"
      decoding="async"
      onError={() => setFailed(true)}
      style={{
        ...boxStyle,
        objectFit: 'cover',
        display: 'block',
      }}
    />
  );
}
