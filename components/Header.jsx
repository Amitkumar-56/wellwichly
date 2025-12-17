'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import Logo from './Logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      // Prevent scrolling when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="relative bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50 shadow-lg sticky top-0 z-50 backdrop-blur-lg overflow-hidden">
      {/* Background overlay for seamless blend */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50"></div>
      <nav className="container mx-auto px-4 py-2 relative z-10" ref={menuRef}>
        <div className="flex items-center justify-between min-h-[60px]">
          <div className="flex items-center relative z-20">
            <Logo />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-800 hover:text-indigo-600 font-bold transition transform hover:scale-110 text-lg py-2 px-3">Home</Link>
            <Link href="/about" className="text-gray-800 hover:text-indigo-600 font-bold transition transform hover:scale-110 text-lg py-2 px-3">About Us</Link>
            <Link href="/services" className="text-gray-800 hover:text-indigo-600 font-bold transition transform hover:scale-110 text-lg py-2 px-3">Menu</Link>
            <Link href="/franchising" className="text-gray-800 hover:text-indigo-600 font-bold transition transform hover:scale-110 text-lg py-2 px-3">Franchising</Link>
            <Link href="/contact" className="text-gray-800 hover:text-indigo-600 font-bold transition transform hover:scale-110 text-lg py-2 px-3">Contact Us</Link>
            <Link href="/track-order" className="text-gray-800 hover:text-indigo-600 font-bold transition transform hover:scale-110 text-lg py-2 px-3">Track Order</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 hover:text-indigo-600 transition p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-6 bg-white rounded-2xl p-6 shadow-2xl border-2 border-indigo-200 animate-slideDown">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-indigo-200">
              <h3 className="text-xl font-black text-indigo-600">Menu</h3>
              <button
                onClick={closeMenu}
                className="text-gray-800 hover:text-red-600 transition p-3 hover:bg-red-50 rounded-lg"
                aria-label="Close menu"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <Link href="/" onClick={closeMenu} className="block py-4 px-6 text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition text-lg">Home</Link>
              <Link href="/about" onClick={closeMenu} className="block py-4 px-6 text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition text-lg">About Us</Link>
              <Link href="/services" onClick={closeMenu} className="block py-4 px-6 text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition text-lg">Menu</Link>
              <Link href="/franchising" onClick={closeMenu} className="block py-4 px-6 text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition text-lg">Franchising</Link>
              <Link href="/contact" onClick={closeMenu} className="block py-4 px-6 text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition text-lg">Contact Us</Link>
              <Link href="/track-order" onClick={closeMenu} className="block py-4 px-6 text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition text-lg">Track Order</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
