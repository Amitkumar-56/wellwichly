'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import GoogleMap from '../components/GoogleMap';
import Header from '../components/Header';
import ImageSlider from '../components/ImageSlider';
import SocialSidebar from '../components/SocialSidebar';
import TaglineRotator from '../components/TaglineRotator';

export default function Home() {
  const [contentMap, setContentMap] = useState({});
  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/content`);
        if (res.ok) {
          const items = await res.json();
          const map = {};
          items.forEach((c) => {
            map[c.key] = c.value;
          });
          setContentMap(map);
        }
      } catch (e) {}
    };
    loadContent();
  }, []);
  const getContent = (key, fallback) => contentMap[key] || fallback;
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <SocialSidebar />
      
      {/* Hero Section 1 - Branding Banner with Slider */}
      <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Image Slider Background */}
        <div className="absolute inset-0">
          <ImageSlider />
        </div>
        
        {/* Content Overlay */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="text-7xl md:text-9xl mb-6 animate-bounce drop-shadow-2xl">🥪</div>
          <h1 className="text-5xl md:text-9xl font-black text-white mb-4 tracking-tight drop-shadow-2xl font-['Poppins']">
            {getContent('home_welcome_title', 'Wellwichly')}
          </h1>
          <TaglineRotator />
        </div>
      </section>

      {/* Hero Section 2 - CTA Banner */}
      <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-0">
        {/* Full Banner Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-7xl font-black mb-4 text-gray-800 leading-tight font-['Poppins']">
            {getContent('home_cta_title_start', 'Start your own')}
          </h2>
          <div className="mb-6">
            <span className="text-5xl md:text-8xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-['Poppins']">
              {getContent('home_cta_brand', 'Wellwichly')}
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black mb-8 text-gray-800 leading-tight font-['Poppins']">
            {getContent('home_cta_title_end', 'Outlet today!')}
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 font-medium max-w-3xl mx-auto font-['Poppins']">
            {getContent('home_cta_subtext', 'Join our franchise network and serve delicious sandwiches to your community')}
          </p>
          <div className="flex justify-center">
            <Link 
              href="/franchising" 
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-black text-xl md:text-2xl hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 shadow-2xl"
            >
              Book Your Store Now
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - Modern Cards */}
      <section className="py-12 -mt-8 relative z-10 animate-fadeIn">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { number: '80+', label: 'Outlets' },
              { number: '70+', label: 'Franchise Partners' },
              { number: '50+', label: 'Cities' },
              { number: '3.5L+', label: 'Orders Monthly' },
            ].map((stat, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 transform hover:scale-105 text-center animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-3 font-['Poppins']">
                  {stat.number}
                </div>
                <div className="text-lg md:text-xl font-bold text-gray-800 font-['Poppins']">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20 bg-white animate-fadeIn">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-7xl font-black mb-8 text-gray-800 leading-tight text-center font-['Poppins']">
              <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Wellwichly</span>
              <br />
              <span className="text-2xl md:text-4xl">— Eat Well, Feel Well</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
              <div className="animate-slideUp">
                <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed font-semibold">
                  <span className="text-indigo-600 font-black">"Wellwichly — Crafted Fresh, Made Well."</span> This is our promise in every sandwich. 
                  We start with fresh ingredients and perfect every bite with careful preparation.
                </p>
                <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                  <span className="text-purple-600 font-black">"Where Wellness Meets Every Sandwich."</span> Our mission is to give you both healthy and tasty. 
                  Every sandwich has goodness, every layer has freshness, and every moment brings happiness.
                </p>
                <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                  <span className="text-pink-600 font-black">"Made Well. Made Delicious."</span> This is our commitment — quality ingredients, 
                  perfect preparation, and your satisfaction. Our dedication shows in every sandwich.
                </p>
                <Link 
                  href="/about" 
                  className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Know More
                </Link>
              </div>
              <div className="text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-12 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-7xl md:text-9xl mb-4">🛍️</div>
                  <div className="text-5xl md:text-6xl">📱</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50 animate-fadeIn">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-7xl font-black mb-12 text-gray-800 text-center font-['Poppins']">
            {getContent('home_menu_title', 'Sandwich Menu — Kya Khaoge?')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
            {[
              { name: 'VEG GRILLED SANDWICH', image: '/Veg grilled sandwich.png', price: '₹60' },
              { name: 'CHEESE CORN SANDWICH', image: '/Cheese corn sandwich.png', price: '₹80' },
              { name: 'CHEESE PANEER SANDWICH', image: '/Cheese paneer sandwich.png', price: '₹90' },
              { name: 'TANDOORI PANEER SANDWICH', image: '/tandoori paneer sandwich.png', price: '₹100' },
              { name: 'ALOO GRILLED SANDWICH', image: '/Alloo grilled sandwich.png', price: '₹70' },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-3xl text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-4 border-indigo-200 hover:border-indigo-500 overflow-hidden animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-full h-40 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-all duration-500 transform hover:scale-110" loading="lazy" />
                </div>
              <div className="p-4">
                <h3 className="font-black text-base md:text-lg text-gray-800 mb-2 font-['Poppins']">{item.name}</h3>
              </div>
            </div>
          ))}
          </div>
          <div className="text-center">
            <Link 
              href="/services" 
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-black text-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-xl"
            >
              View All Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Taglines Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-fadeIn">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-6xl font-black mb-6 text-gray-800 font-['Poppins']">
              <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Wellwichly
              </span>
              {' '}— More Than Just Sandwiches
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed font-semibold">
              <span className="text-indigo-600 font-black text-2xl">"Wellwichly — Eat Well, Feel Well."</span>
              <br /><br />
              This is our core philosophy. We believe that good food keeps you healthy both physically and mentally. 
              Our commitment in every sandwich is — fresh ingredients, perfect taste, and your wellness.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Healthy & Tasty */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-green-200 hover:border-green-400 transition-all duration-300 transform hover:scale-105">
                <div className="text-6xl mb-4">🥗</div>
                <h3 className="text-2xl font-black text-gray-800 mb-4 font-['Poppins']">Healthy & Tasty</h3>
                <div className="space-y-3 text-left">
                  <p className="text-gray-700 font-semibold">"Crafted Fresh, Made Well."</p>
                  <p className="text-gray-700 font-semibold">"Where Wellness Meets Every Sandwich."</p>
                  <p className="text-gray-700 font-semibold">"Eat Well, Feel Well."</p>
                  <p className="text-gray-700 font-semibold">"The Healthier Bite of Happiness."</p>
                </div>
              </div>

              {/* Trendy & Modern */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:scale-105">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-black text-gray-800 mb-4 font-['Poppins']">Trendy & Modern</h3>
                <div className="space-y-3 text-left">
                  <p className="text-gray-700 font-semibold">"Fresh. Fast. Fantastic."</p>
                  <p className="text-gray-700 font-semibold">"Goodness in Every Layer."</p>
                  <p className="text-gray-700 font-semibold">"Bite Into Better."</p>
                  <p className="text-gray-700 font-semibold">"Taste the Fresh Difference."</p>
                </div>
              </div>

              {/* Fun & Memorable */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-pink-200 hover:border-pink-400 transition-all duration-300 transform hover:scale-105">
                <div className="text-6xl mb-4">😊</div>
                <h3 className="text-2xl font-black text-gray-800 mb-4 font-['Poppins']">Fun & Memorable</h3>
                <div className="space-y-3 text-left">
                  <p className="text-gray-700 font-semibold">"Wellness in Every Bite."</p>
                  <p className="text-gray-700 font-semibold">"Your Daily Dose of Delicious."</p>
                  <p className="text-gray-700 font-semibold">"Stacked with Smiles."</p>
                  <p className="text-gray-700 font-semibold">"Fuel Your Day the Wellwichly Way."</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-2xl text-white">
              <p className="text-2xl md:text-4xl font-black mb-4 font-['Poppins']">
                Made Well. Made Delicious.
              </p>
              <p className="text-lg md:text-xl opacity-90 font-['Poppins']">
                Our commitment in every sandwich — quality, freshness, and your satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-purple-50 to-pink-50 animate-fadeIn">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-7xl font-black mb-12 md:mb-16 text-gray-800 text-center font-['Poppins']">
            Why Choose Wellwichly?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
            {[
              { icon: '🥬', title: 'Fresh Ingredients', desc: 'We use premium spices, fresh ingredients, and authentic recipes for that rich, delicious taste in every bite.' },
              { icon: '💡', title: 'Smart System', desc: 'Our automated kitchens ensure perfect preparation, hygienic prep, and zero guesswork. Easy ordering system.' },
              { icon: '💰', title: 'Affordable Outlet', desc: 'Quality food at market rates. Great value for money. Low investment franchise model.' },
            ].map((feature, index) => (
              <div key={index} className="text-center bg-white p-8 md:p-10 rounded-3xl shadow-2xl border-4 border-indigo-200 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105 animate-slideUp" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="text-7xl md:text-9xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl md:text-3xl font-black mb-4 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent font-['Poppins']">{feature.title}</h3>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed font-['Poppins']">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section - Franchise Locations with Live Location */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-white to-indigo-50 animate-fadeIn">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-7xl font-black mb-6 text-gray-800 text-center font-['Poppins']">
            {getContent('home_find_stores_title', 'Find Our Stores')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Discover Wellwichly outlets near you. <span className="font-bold text-red-600">Red markers</span> show franchise locations, <span className="font-bold text-blue-600">Blue marker</span> shows your location.
          </p>
          
          <div className="animate-slideUp">
            <GoogleMap />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
