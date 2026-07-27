import React from 'react';

interface LohasLogoProps {
  className?: string;
  size?: number;
}

export function LohasLogo({ className = '', size = 32 }: LohasLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 128 128" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 hover:scale-105`}
    >
      {/* Dark orange-toned rounded square background */}
      <rect width="128" height="128" rx="28" fill="#1C0A00" />
      
      {/* Decorative background glow rings */}
      <circle cx="64" cy="64" r="54" stroke="#F97316" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      
      {/* Left Leaf/Wing Shape - Deep Vivid Orange */}
      <path 
        d="M24 64C24 40 40 28 64 28C64 28 44 48 44 64C44 80 64 100 64 100C40 100 24 88 24 64Z" 
        fill="#C2410C" 
        opacity="0.95"
      />
      
      {/* Right Leaf/Wing Shape - Bright Vibrant Orange #F97316 */}
      <path 
        d="M104 64C104 88 88 100 64 100C64 100 84 80 84 64C84 48 64 28 64 28C88 28 104 40 104 64Z" 
        fill="#FF6B00" 
        opacity="0.95"
      />

      {/* Leaf overlap seam / stem highlight */}
      <path 
        d="M44 64C48 58 60 52 64 28" 
        stroke="#120500" 
        strokeWidth="3.5" 
        strokeLinecap="round"
        opacity="0.4"
      />
      <path 
        d="M84 64C80 70 68 76 64 100" 
        stroke="#120500" 
        strokeWidth="3.5" 
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Organic Leaf details (small inner lines) */}
      <path 
        d="M33 50Q40 46 45 48" 
        stroke="#ffffff" 
        strokeWidth="2" 
        strokeLinecap="round" 
        opacity="0.5"
      />
      <path 
        d="M95 78Q88 82 83 80" 
        stroke="#ffffff" 
        strokeWidth="2" 
        strokeLinecap="round" 
        opacity="0.5"
      />

      {/* Stylized, bold, heavy sans-serif LOHAS text custom placement inside the leaves */}
      <text 
        x="64" 
        y="72" 
        fill="#FFFFFF" 
        fontSize="22" 
        fontWeight="900" 
        textAnchor="middle" 
        letterSpacing="0.8"
        style={{
          fontFamily: '"Outfit", "Inter", "system-ui", sans-serif',
          textShadow: '0 2px 4px rgba(28, 10, 0, 0.7)'
        }}
      >
        LOHAS
      </text>
    </svg>
  );
}
