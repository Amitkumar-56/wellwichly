'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function Services() {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/services`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setServices(data);
        const initialQty = {};
        data.forEach(s => { if (s._id) initialQty[s._id] = 1; });
        setQuantities(initialQty);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Default services if API fails
      setServices([
        {
          _id: '1',
          name: 'Classic Club Sandwich',
          description: 'Triple decker with chicken, bacon, lettuce, tomato, and mayo',
          price: 250,
        },
        {
          _id: '2',
          name: 'Veggie Delight',
          description: 'Fresh vegetables, cheese, and special sauce',
          price: 180,
        },
        {
          _id: '3',
          name: 'Chicken Grilled',
          description: 'Grilled chicken with onions, peppers, and cheese',
          price: 280,
        },
        {
          _id: '4',
          name: 'Paneer Special',
          description: 'Spiced paneer with vegetables and mint chutney',
          price: 220,
        },
        {
          _id: '5',
          name: 'BBQ Chicken',
          description: 'BBQ chicken with coleslaw and special sauce',
          price: 300,
        },
        {
          _id: '6',
          name: 'Egg & Cheese',
          description: 'Scrambled eggs with cheese and vegetables',
          price: 150,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = (id) => {
    setQuantities((q) => ({ ...q, [id]: Math.min((q[id] || 1) + 1, 20) }));
  };
  const decreaseQty = (id) => {
    setQuantities((q) => ({ ...q, [id]: Math.max((q[id] || 1) - 1, 1) }));
  };
  const addToCart = (service) => {
    const qty = quantities[service._id] || 1;
    const items = Array(qty).fill(service);
    setCart([...cart, ...items]);
    alert(`${service.name} x${qty} added to cart!`);
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-black text-center mb-4 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent animate-fadeIn">
            Our Menu
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>Choose from our delicious sandwich collection</p>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading menu...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {Array.isArray(services) && services.length > 0 ? (
                  services.map((service, index) => (
                    <div key={service._id} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover-lift border-4 border-indigo-200 hover:border-indigo-500 animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="relative w-full h-56 overflow-hidden group">
                        {service.image ? (
                          <img 
                            src={service.image} 
                            alt={service.name} 
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-125" 
                            loading="lazy"
                            onError={(e) => {
                              // Fallback to gradient if image fails to load
                              e.target.style.display = 'none';
                              const fallback = e.target.nextElementSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center ${service.image ? 'hidden' : ''}`}
                        >
                          <span className="text-8xl">🥪</span>
                        </div>
                        {/* Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-black shadow-lg z-10">
                          Fresh
                        </div>
                        {/* Category Badge */}
                        {service.category && (
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-black shadow-lg z-10">
                            {service.category}
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-black mb-3 text-gray-800">{service.name}</h3>
                        <p className="text-gray-600 mb-6 text-lg">{service.description}</p>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">₹{service.price}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseQty(service._id)}
                              className="px-3 py-2 rounded-lg border-2 border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50"
                            >
                              −
                            </button>
                            <span className="min-w-[2.5rem] text-center font-black text-gray-800">
                              {quantities[service._id] || 1}
                            </span>
                            <button
                              onClick={() => increaseQty(service._id)}
                              className="px-3 py-2 rounded-lg border-2 border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => addToCart(service)}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-black hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600 text-xl">No services available at the moment.</p>
                  </div>
                )}
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl border-t-4 border-white p-6 z-50">
                  <div className="container mx-auto flex items-center justify-between">
                    <div>
                      <p className="font-black text-white text-lg">{cart.length} item(s) in cart</p>
                      <p className="text-3xl font-black text-yellow-300">Total: ₹{totalAmount}</p>
                    </div>
                    <Link
                      href={`/order?items=${encodeURIComponent(JSON.stringify(cart))}`}
                      className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 transition shadow-xl border-4 border-yellow-300"
                    >
                      Proceed to Checkout →
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

