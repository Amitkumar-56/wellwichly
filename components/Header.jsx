'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="relative bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50 shadow-lg sticky top-0 z-50 backdrop-blur-lg overflow-hidden">
      {/* Background overlay for seamless blend */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-50"></div>
      <nav className="container mx-auto px-4 py-3 relative z-10" ref={menuRef}>
        <div className="flex items-center justify-between">
          <div className="flex items-center relative z-20">
            <Logo />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-800 hover:text-indigo-600 font-bold transition transform hover:scale-110">Home</Link>
            <Link href="/about" className="text-gray-800 hover:text-indigo-600 font-bold transition transform hover:scale-110">About Us</Link>
            <Link href="/services" className="text-gray-800 hover:text-indigo-600 font-bold transition transform hover:scale-110">Menu</Link>
            <Link href="/franchising" className="text-gray-800 hover:text-indigo-600 font-bold transition transform hover:scale-110">Franchising</Link>
            <Link href="/contact" className="text-gray-800 hover:text-indigo-600 font-bold transition transform hover:scale-110">Contact Us</Link>
            <Link href="/admin" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-black hover:from-indigo-700 hover:to-purple-700 transition shadow-xl">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 hover:text-indigo-600 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-2xl p-4 shadow-xl border-2 border-indigo-200 animate-slideDown">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-indigo-200">
              <h3 className="text-lg font-black text-indigo-600">Menu</h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition">Home</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition">About Us</Link>
              <Link href="/services" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition">Menu</Link>
              <Link href="/franchising" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition">Franchising</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition">Contact Us</Link>
              <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="block py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-black text-center">Admin</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}