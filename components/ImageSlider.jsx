'use client';

import { useEffect, useMemo, useState } from 'react';

export default function ImageSlider({ images: inputImages = [], intervalMs = 6000, caption, effect = 'zoom' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const images = useMemo(() => {
    const defaults = [
      { url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1600&h=900&fit=crop', alt: 'Delicious Sandwich' },
      { url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=1600&h=900&fit=crop', alt: 'Fresh Sandwich' },
      { url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=1600&h=900&fit=crop', alt: 'Grilled Sandwich' },
      { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&h=900&fit=crop', alt: 'Chicken Sandwich' },
    ];
    const valid = (inputImages || []).filter(i => i && i.url).map(i => ({ url: i.url, alt: i.alt || 'Sandwich' }));
    return valid.length ? valid : defaults;
  }, [inputImages]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, Math.max(3000, intervalMs));
    return () => clearInterval(interval);
  }, [images.length, intervalMs, paused]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEndX(e.changedTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta > 0) {
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        } else {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div key={currentIndex} className="h-full bg-white animate-slider-progress"></div>
      </div>
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="w-full h-full">
              <img
                src={image.url}
                alt={image.alt}
                className={`w-full h-full object-cover will-change-transform ${effect === 'kenburns' ? 'animate-kenburns' : 'animate-zoomSlow'} scale-105`}
                loading="lazy"
                style={{ backfaceVisibility: 'hidden' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div className="hidden w-full h-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
            {caption && (
              <div className="absolute inset-x-0 bottom-10 text-center z-20">
                <div className="inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/30">
                  <span className="text-white font-black text-xl md:text-2xl">{caption}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-8' : 'bg-white/60 w-2 hover:bg-white/80'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition z-20"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition z-20"
        aria-label="Next image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
