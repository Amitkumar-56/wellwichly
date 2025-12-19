'use client';

import { useEffect, useRef, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import SocialSidebar from '../../components/SocialSidebar';

export default function Franchising() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobilePhone: '',
    emailAddress: '',
    companyAddress: '',
    companyName: '',
    liquidCapital: '',
    agreeToTerms: false,
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.emailAddress,
          phone: formData.mobilePhone,
          message: `Franchise Enquiry:\n\nCompany Name: ${formData.companyName}\nCompany Address: ${formData.companyAddress}\nLiquid Capital: ${formData.liquidCapital}\n\nContact Details:\nName: ${formData.firstName} ${formData.lastName}\nPhone: ${formData.mobilePhone}\nEmail: ${formData.emailAddress}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          mobilePhone: '',
          emailAddress: '',
          companyAddress: '',
          companyName: '',
          liquidCapital: '',
          agreeToTerms: false,
        });
        
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
      console.error('Error submitting franchise form:', error);
      setError('Error submitting form. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <SocialSidebar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-indigo-700 font-['Poppins']">
              Start your own<br />
              <span className="text-indigo-600">Wellwichly</span><br />
              Outlet today!
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto font-['Poppins']">
              Join our franchise network and serve delicious sandwiches to your community. 
              Low investment, high returns, and full support from our team.
            </p>
          </section>

          {/* Franchise Inquiry Form */}
          <section className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-indigo-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-indigo-700 font-['Poppins']">
                  Franchise Inquiry Form
                </h2>
                <button className="text-3xl text-indigo-600 hover:text-indigo-800 transition">
                  ×
                </button>
              </div>

              {submitted && (
                <div key="success-message" className="bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-400 text-green-800 px-6 py-4 rounded-xl mb-6 font-bold animate-fadeIn font-['Poppins'] text-sm md:text-base">
                  ✅ Thank you! Your franchise inquiry has been submitted successfully.
                  <br />
                  <span className="text-xs md:text-sm font-normal mt-2 block">We'll contact you soon. Your request will appear in the admin panel.</span>
                </div>
              )}

              {error && (
                <div key="error-message" className="bg-red-100 border-4 border-red-400 text-red-800 px-6 py-4 rounded-xl mb-6 font-bold animate-fadeIn font-['Poppins'] text-sm md:text-base">
                  ❌ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" key="franchise-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base md:text-lg font-bold mb-2 text-indigo-700 font-['Poppins']">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold font-['Poppins'] text-sm md:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-base md:text-lg font-bold mb-2 text-indigo-700 font-['Poppins']">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold font-['Poppins'] text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base md:text-lg font-bold mb-2 text-indigo-700 font-['Poppins']">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.mobilePhone}
                      onChange={(e) => setFormData({ ...formData, mobilePhone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold font-['Poppins'] text-sm md:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-base md:text-lg font-bold mb-2 text-indigo-700 font-['Poppins']">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.emailAddress}
                      onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold font-['Poppins'] text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base md:text-lg font-bold mb-2 text-indigo-700 font-['Poppins']">Company Address</label>
                  <textarea
                    required
                    value={formData.companyAddress}
                    onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                    rows={3}
                    placeholder="Enter your company address..."
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold font-['Poppins'] text-sm md:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base md:text-lg font-bold mb-2 text-indigo-700 font-['Poppins']">Company Name</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold font-['Poppins'] text-sm md:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-base md:text-lg font-bold mb-2 text-indigo-700 font-['Poppins']">Liquid Capital</label>
                    <select
                      required
                      value={formData.liquidCapital}
                      onChange={(e) => setFormData({ ...formData, liquidCapital: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold font-['Poppins'] text-sm md:text-base"
                    >
                      <option value="">Please choose an option</option>
                      <option value="1-5 Lakhs">1-5 Lakhs</option>
                      <option value="5-10 Lakhs">5-10 Lakhs</option>
                      <option value="10-20 Lakhs">10-20 Lakhs</option>
                      <option value="20-50 Lakhs">20-50 Lakhs</option>
                      <option value="50+ Lakhs">50+ Lakhs</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="mt-1 mr-3 w-5 h-5 border-2 border-indigo-400 rounded"
                  />
                  <label className="text-gray-700 font-semibold font-['Poppins'] text-sm md:text-base">
                    I have read and agree to the Privacy Policy and Terms & Conditions
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-black text-base md:text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-xl disabled:opacity-50 font-['Poppins']"
                >
                  {loading ? 'Submitting...' : 'Submit Your Information'}
                </button>
              </form>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mt-20 max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-12 text-center text-indigo-700 font-['Poppins']">
              Why Franchise with Wellwichly?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-4 border-indigo-200 text-center">
                <div className="text-5xl md:text-7xl mb-4">💼</div>
                <h3 className="text-xl md:text-2xl font-black mb-4 text-indigo-700 font-['Poppins']">Low Investment</h3>
                <p className="text-gray-700 text-sm md:text-base font-['Poppins']">Start with minimal investment and grow your business step by step.</p>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-4 border-indigo-200 text-center">
                <div className="text-5xl md:text-7xl mb-4">📈</div>
                <h3 className="text-xl md:text-2xl font-black mb-4 text-indigo-700 font-['Poppins']">High Returns</h3>
                <p className="text-gray-700 text-sm md:text-base font-['Poppins']">Proven business model with excellent profit margins and growth potential.</p>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-4 border-indigo-200 text-center">
                <div className="text-5xl md:text-7xl mb-4">🤝</div>
                <h3 className="text-xl md:text-2xl font-black mb-4 text-indigo-700 font-['Poppins']">Full Support</h3>
                <p className="text-gray-700 text-sm md:text-base font-['Poppins']">Complete training, marketing support, and ongoing assistance from our team.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

