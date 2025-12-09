'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ size = 'default' }) {
  const sizes = {
    small: 'h-10 w-10',
    default: 'h-14 w-14 md:h-16 md:w-16',
    large: 'h-16 w-16 md:h-20 md:w-20'
  };

  return (
    <Link href="/" className="flex items-center group relative z-10">
      <div className="relative">
        {/* Logo Image - Blended with header background */}
        <div className={`${sizes[size]} relative transform group-hover:scale-105 transition-all duration-300 mix-blend-normal`}>
          <Image
            src="/wellwichly.png"
            alt="Wellwichly Logo - Eat Well, Feel Well"
            fill
            className="object-contain drop-shadow-sm"
            priority
            unoptimized
          />
        </div>
      </div>
    </Link>
  );
}