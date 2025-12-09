'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GoogleMap from '../../components/GoogleMap';
import InstagramQR from '../../components/InstagramQR';
import { useState, useEffect, useRef } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const timeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitted(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        
        // Clear previous timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set new timeout
        timeoutRef.current = setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        setError(data.message || 'Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError('Error submitting form. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-black text-center mb-4 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">Get in touch with us. We'd love to hear from you!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-indigo-200">
              <h2 className="text-3xl font-black mb-6 text-gray-800">Send us a Message</h2>
              
              {submitted && (
                <div key="success-message" className="bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-400 text-green-800 px-6 py-4 rounded-2xl mb-6 font-bold animate-fadeIn">
                  ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
                  <br />
                  <span className="text-sm font-normal">Your request will appear in the admin panel.</span>
                </div>
              )}

              {error && (
                <div key="error-message" className="bg-red-100 border-4 border-red-400 text-red-800 px-6 py-4 rounded-2xl mb-6 font-bold animate-fadeIn">
                  ❌ {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6" key="contact-form">
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-800">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-gray-800 font-semibold"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-800">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-gray-800 font-semibold"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-800">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-gray-800 font-semibold"
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-800">Message *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    placeholder="Enter your message here..."
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-gray-800 font-semibold"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-black text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-2xl p-8 border-4 border-indigo-200">
                <h2 className="text-3xl font-black mb-6 text-gray-800">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-xl">
                    <h3 className="font-bold mb-2 text-gray-800">📞 Phone</h3>
                    <a href="tel:+918881917644" className="text-indigo-600 font-bold hover:text-purple-600 transition text-lg">
                      +91 8881917644
                    </a>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl">
                    <h3 className="font-bold mb-2 text-gray-800">✉️ Email</h3>
                    <a href="mailto:Wellwichly@gmail.com" className="text-indigo-600 font-bold hover:text-purple-600 transition text-lg">
                      Wellwichly@gmail.com
                    </a>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl">
                    <h3 className="font-bold mb-2 text-gray-800">📍 Address</h3>
                    <p className="text-gray-700 font-semibold">
                      123 Food Street<br />
                      City, State - 123456<br />
                      India
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl">
                    <h3 className="font-bold mb-2 text-gray-800">🕒 Business Hours</h3>
                    <p className="text-gray-700 font-semibold">
                      Monday - Sunday<br />
                      9:00 AM - 10:00 PM
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl">
                    <h3 className="font-bold mb-4 text-gray-800">📱 Follow Us on Instagram</h3>
                    <InstagramQR />
                  </div>
                </div>
              </div>

              {/* Google Map Embed */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl p-6 border-4 border-indigo-200">
                <h2 className="text-3xl font-black mb-4 text-gray-800">Find Our Stores</h2>
                <p className="text-gray-600 mb-4 text-sm">
                  <span className="font-bold text-blue-600">Blue marker</span> = Your Location, <span className="font-bold text-red-600">Red markers</span> = Franchise Stores
                </p>
                <div className="w-full h-80 rounded-xl overflow-hidden">
                  {typeof window !== 'undefined' && <GoogleMap />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

