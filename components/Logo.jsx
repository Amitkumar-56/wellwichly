'use client';

import Link from 'next/link';

export default function Logo({ size = 'default' }) {
  const sizes = {
    small: 'text-2xl',
    default: 'text-3xl md:text-4xl',
    large: 'text-5xl md:text-6xl'
  };

  return (
    <Link href="/" className="flex items-center space-x-3 group">
      <div className="relative">
        {/* Main Logo Container */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl px-4 py-3 shadow-2xl transform group-hover:scale-105 transition-all duration-300 flex items-center gap-2 border-4 border-white/20">
          {/* Sandwich Icon */}
          <div className="relative">
            <div className="text-3xl md:text-4xl animate-bounce">🥪</div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Text */}
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-black text-white leading-tight font-['Poppins'] drop-shadow-lg">
              Wellwichly
            </span>
            <span className="text-xs text-white/90 font-bold font-['Poppins']">
              Fresh & Delicious
            </span>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-80 animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400 rounded-full opacity-60"></div>
      </div>
    </Link>
  );
}

