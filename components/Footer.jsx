import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800 mt-20 border-t-4 border-indigo-200">
      <div className="container mx-auto px-4 py-12">
        {/* Social Media Section */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border-4 border-indigo-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Join our Social Media Family!</h3>
              <p className="text-2xl font-bold text-indigo-600 mb-4">Let's Create Something Fun :D</p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/wellwichly" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-br from-[#F56040] via-[#E1306C] to-[#C13584] rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg" title="Follow @WELLWICHLY">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
            <div className="text-center"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">🥪 Wellwichly</h3>
            <p className="text-gray-700 leading-relaxed font-semibold">
              <span className="text-indigo-600 font-black">"Wellwichly — Eat Well, Feel Well."</span>
              <br /><br />
              Fresh, healthy, and delicious sandwiches made with care. 
              Order online and enjoy fast delivery to your doorstep.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-indigo-600">Quick Links</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link href="/" className="hover:text-indigo-600 transition font-semibold">Home</Link></li>
              <li><Link href="/about" className="hover:text-indigo-600 transition font-semibold">About Us</Link></li>
              <li><Link href="/services" className="hover:text-indigo-600 transition font-semibold">Menu</Link></li>
              <li><Link href="/franchising" className="hover:text-indigo-600 transition font-semibold">Franchising</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-600 transition font-semibold">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-indigo-600">Contact Info</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+918881917644" className="hover:text-indigo-600 transition font-semibold">+91 8881917644</a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:Wellwichly@gmail.com" className="hover:text-indigo-600 transition font-semibold">Wellwichly@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Corporate Office: 212/184, Swaraj Bhawan, Uttar Pradesh 211003, India</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-indigo-600">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/wellwichly" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gradient-to-br from-[#F56040] via-[#E1306C] to-[#C13584] rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg" title="Follow @WELLWICHLY">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center text-white hover:scale-110 transition shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-indigo-200 mt-8 pt-8 text-center">
          <p className="text-gray-700 font-bold">All Rights Reserved by Wellwichly Pvt. Ltd. ®</p>
        </div>
      </div>
    </footer>
  );
}
