'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useState } from 'react';
import Link from 'next/link';

export default function TrackOrder() {
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      preparing: 'bg-purple-100 text-purple-800 border-purple-300',
      out_for_delivery: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered Successfully! 🎉',
      cancelled: 'Cancelled',
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      out_for_delivery: '🚚',
      delivered: '🎉',
      cancelled: '❌',
    };
    return icons[status] || '⏳';
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    if (!phone.trim() && !orderId.trim()) {
      setError('Please enter phone number or order ID');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const params = new URLSearchParams();
      if (phone.trim()) params.append('phone', phone.trim());
      if (orderId.trim()) params.append('orderId', orderId.trim());

      const response = await fetch(`${apiUrl}/api/orders/track?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        setError(data.message || 'Order not found. Please check your phone number or order ID.');
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black text-center mb-8 text-gray-800">
            Track Your Order
          </h1>

          {/* Track Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8">
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                />
              </div>

              <div className="text-center text-gray-500 font-bold">OR</div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Order ID
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID"
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-black text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </form>
          </div>

          {/* Order Details */}
          {order && (
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              <div className="mb-6">
                <div className={`inline-block px-6 py-3 rounded-full border-2 font-black text-lg ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)} {getStatusText(order.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-1">Order ID</h3>
                  <p className="text-lg font-black text-gray-800 break-all">{order._id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-1">Customer Name</h3>
                  <p className="text-lg font-black text-gray-800">{order.customerName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-1">Phone Number</h3>
                  <p className="text-lg font-black text-gray-800">{order.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-1">Order Date</h3>
                  <p className="text-lg font-black text-gray-800">
                    {new Date(order.orderDate || order.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-1">Payment Method</h3>
                  <p className="text-lg font-black text-gray-800 capitalize">{order.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-1">Total Amount</h3>
                  <p className="text-2xl font-black text-indigo-600">₹{order.totalAmount}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-500 mb-2">Delivery Address</h3>
                <p className="text-lg text-gray-800 bg-gray-50 p-4 rounded-xl">{order.address}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-black text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                      <div>
                        <p className="font-black text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-black text-indigo-600 text-lg">₹{item.quantity * item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {order.status === 'delivered' && (
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 text-center">
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="text-xl font-black text-green-800 mb-2">Order Delivered Successfully!</p>
                  <p className="text-green-700">Thank you for ordering with us. We hope you enjoyed your meal!</p>
                </div>
              )}

              {order.status === 'out_for_delivery' && (
                <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-6 text-center">
                  <p className="text-2xl mb-2">🚚</p>
                  <p className="text-xl font-black text-indigo-800 mb-2">Your order is on the way!</p>
                  <p className="text-indigo-700">Please keep your phone nearby. Our delivery partner will contact you soon.</p>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-black hover:from-indigo-700 hover:to-purple-700 transition shadow-xl"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

