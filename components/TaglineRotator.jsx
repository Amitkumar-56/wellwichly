'use client';

import { useState, useEffect } from 'react';

export default function TaglineRotator() {
  const taglines = [
    // Healthy & Tasty
    "Wellwichly — Crafted Fresh, Made Well.",
    "Where Wellness Meets Every Sandwich.",
    "Wellwichly — Taste the Fresh Difference.",
    "Made Well. Made Delicious.",
    "Wellwichly — Eat Well, Feel Well.",
    "Wellwichly — The Healthier Bite of Happiness.",
    "Fuel Your Day the Wellwichly Way.",
    
    // Trendy & Modern
    "Wellwichly — Fresh. Fast. Fantastic.",
    "Wellwichly — Goodness in Every Layer.",
    "Wellwichly — Bite Into Better.",
    
    // Fun & Memorable
    "Wellwichly — Wellness in Every Bite.",
    "Wellwichly — Your Daily Dose of Delicious.",
    "Wellwichly — Stacked with Smiles.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % taglines.length);
    }, 3000); // Change tagline every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-20 md:h-24 overflow-hidden">
      <div 
        className="transition-all duration-1000 ease-in-out transform"
        style={{
          transform: `translateY(-${currentIndex * 100}%)`,
        }}
      >
        {taglines.map((tagline, index) => (
          <p
            key={index}
            className="text-2xl md:text-4xl text-white font-bold drop-shadow-lg font-['Poppins'] py-2"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
            }}
          >
            {tagline}
          </p>
        ))}
      </div>
      
      {/* Tagline Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {taglines.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

