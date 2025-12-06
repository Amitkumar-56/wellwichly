'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function OrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'cash',
  });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      try {
        const items = JSON.parse(decodeURIComponent(itemsParam));
        // Group items and count quantities
        const grouped = items.reduce((acc, item) => {
          const existing = acc.find((i) => i._id === item._id);
          if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
          } else {
            acc.push({ ...item, quantity: 1 });
          }
          return acc;
        }, []);
        setCartItems(grouped);
      } catch (error) {
        console.error('Error parsing cart items:', error);
      }
    } else {
      // If no items, redirect to services
      router.push('/services');
    }
  }, [searchParams, router]);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data before sending
    if (!formData.customerName || !formData.customerName.trim()) {
      alert('Please enter your name');
      setLoading(false);
      return;
    }

    if (!formData.phone || !formData.phone.trim()) {
      alert('Please enter your phone number');
      setLoading(false);
      return;
    }

    if (!formData.address || !formData.address.trim()) {
      alert('Please enter your delivery address');
      setLoading(false);
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to cart first.');
      setLoading(false);
      router.push('/services');
      return;
    }

    const orderData = {
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      email: formData.email ? formData.email.trim() : '',
      address: formData.address.trim(),
      paymentMethod: formData.paymentMethod,
      items: cartItems.map(item => ({
        name: String(item.name || '').trim(),
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
      })),
      totalAmount: Number(totalAmount),
    };

    // Final validation
    if (orderData.items.some(item => !item.name || item.price <= 0)) {
      alert('Invalid items in cart. Please try again.');
      setLoading(false);
      return;
    }

    if (orderData.totalAmount <= 0) {
      alert('Invalid total amount. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('Sending order to:', `${apiUrl}/api/orders`);
      console.log('Order data:', JSON.stringify(orderData, null, 2));

      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        alert('Server error: Invalid response. Please check backend server.');
        setLoading(false);
        return;
      }

      console.log('Response status:', response.status);
      console.log('Response data:', responseData);

      if (response.ok) {
        alert('Order placed successfully! We will contact you soon.');
        router.push('/');
      } else {
        let errorMessage = responseData.message || responseData.error || 'Error placing order. Please try again.';
        
        // Add validation errors if present
        if (responseData.validationErrors) {
          const validationErrors = Object.values(responseData.validationErrors).join(', ');
          errorMessage += `\n\nValidation Errors: ${validationErrors}`;
        }
        
        if (responseData.details) {
          errorMessage += `\n\nDetails: ${responseData.details}`;
        }
        
        console.error('Order error:', responseData);
        alert(`Error: ${errorMessage}\n\nPlease check browser console (F12) for more details.`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      let errorMsg = 'Network error occurred. ';
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMsg += 'Please check if backend server is running on http://localhost:5000';
      } else {
        errorMsg += error.message;
      }
      
      alert(`${errorMsg}\n\nPlease check:\n1. Backend server is running (npm run dev:server)\n2. MongoDB is connected\n3. Check browser console (F12) for details`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-8">Place Your Order</h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No items in cart</p>
              <Link href="/services" className="text-primary hover:underline">
                Go to Menu
              </Link>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity || 1} × ₹{item.price}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * (item.quantity || 1))}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2">Payment Method *</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="mr-2"
                      />
                      Cash on Delivery
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="mr-2"
                      />
                      Online Payment
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Order() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}

