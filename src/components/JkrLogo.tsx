import React from 'react';

interface JkrLogoProps {
  district?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onDarkBg?: boolean;
}

export const JkrLogo: React.FC<JkrLogoProps> = ({
  district = 'PORT DICKSON',
  size = 'md',
  className = '',
  onDarkBg = false,
}) => {
  // Use the cleanly trimmed transparent PNG with outer white background completely removed
  const logoSrc = '/assets/aistudio/jkrpd_transparent.png';

  const sizeClasses = {
    sm: 'h-9 sm:h-10 w-auto',
    md: 'h-16 sm:h-20 w-auto',
    lg: 'h-24 w-auto',
    xl: 'h-28 w-auto',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative inline-flex items-center justify-center transition-transform hover:scale-102">
        <img
          src={logoSrc}
          alt={`Logo Rasmi JKR ${district}`}
          className={`${sizeClasses} object-contain ${
            onDarkBg
              ? 'drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]'
              : 'drop-shadow-[0_3px_8px_rgba(0,0,0,0.18)]'
          }`}
          loading="eager"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
};
