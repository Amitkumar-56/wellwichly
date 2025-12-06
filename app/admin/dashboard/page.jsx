'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [contents, setContents] = useState([]);
  const [editingContent, setEditingContent] = useState(null);
  const [contentFilter, setContentFilter] = useState('all'); // all, home, about, services, contact

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
      return;
    }
    setToken(adminToken);
    fetchData(adminToken);
  }, [router]);

  const fetchData = async (adminToken) => {
    try {
      const headers = {
        'Authorization': `Bearer ${adminToken}`,
      };

      const [ordersRes, contactsRes, servicesRes, contentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contacts`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/services`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/content`, { headers }),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData);
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      }

      if (contentsRes.ok) {
        const contentsData = await contentsRes.json();
        setContents(contentsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        fetchData(token);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateContactStatus = async (contactId, status) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contacts/${contactId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        fetchData(token);
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      new: 'bg-yellow-100 text-yellow-800',
      read: 'bg-blue-100 text-blue-800',
      replied: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-4 border-indigo-200">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2 font-['Poppins']">Wellwichly Admin Panel</h1>
              <p className="text-gray-600 text-lg font-['Poppins']">Complete access to manage orders, contacts, franchise enquiries, and menu items</p>
              <div className="mt-2 flex gap-4 text-sm">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">✅ Full Access</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">📊 Database Connected</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg font-['Poppins']"
              >
                🔐 Change Password
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg font-['Poppins']"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Password Change Form */}
          {showPasswordChange && (
            <div className="bg-white rounded-xl shadow-2xl p-8 border-4 border-indigo-200 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-gray-800 font-['Poppins']">Change Password</h2>
                <button
                  onClick={() => {
                    setShowPasswordChange(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                    setPasswordSuccess('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {passwordError && (
                <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-xl mb-4">
                  <p className="font-bold">❌ {passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-xl mb-4">
                  <p className="font-bold">✅ {passwordSuccess}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-blue-800 font-semibold">
                    💡 You can login with either <strong>Username</strong> or <strong>Email</strong>
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Default: Username: <strong>admin</strong> | Email: <strong>Wellwichly@gmail.com</strong>
                  </p>
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-800">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-800">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-800">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={async () => {
                      setPasswordError('');
                      setPasswordSuccess('');

                      // Validation
                      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                        setPasswordError('All fields are required');
                        return;
                      }

                      if (passwordData.newPassword.length < 6) {
                        setPasswordError('New password must be at least 6 characters long');
                        return;
                      }

                      if (passwordData.newPassword !== passwordData.confirmPassword) {
                        setPasswordError('New password and confirm password do not match');
                        return;
                      }

                      try {
                        const response = await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/change-password`,
                          {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              currentPassword: passwordData.currentPassword,
                              newPassword: passwordData.newPassword,
                            }),
                          }
                        );

                        const data = await response.json();

                        if (response.ok) {
                          setPasswordSuccess('Password changed successfully! Please login again with your new password.');
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setTimeout(() => {
                            handleLogout();
                          }, 2000);
                        } else {
                          setPasswordError(data.message || 'Error changing password');
                        }
                      } catch (error) {
                        console.error('Error changing password:', error);
                        setPasswordError('Error changing password. Please try again.');
                      }
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-black hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordError('');
                      setPasswordSuccess('');
                    }}
                    className="bg-gray-500 text-white px-8 py-3 rounded-xl font-black hover:bg-gray-600 transition shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b-2 border-gray-300">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-bold text-lg ${
                activeTab === 'orders'
                  ? 'border-b-4 border-orange-600 text-orange-600'
                  : 'text-gray-600 hover:text-orange-600'
              } transition`}
            >
              📦 Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-6 py-3 font-bold text-lg ${
                activeTab === 'contacts'
                  ? 'border-b-4 border-orange-600 text-orange-600'
                  : 'text-gray-600 hover:text-orange-600'
              } transition`}
            >
              📞 Contact & Franchise ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-3 font-bold text-lg ${
                activeTab === 'services'
                  ? 'border-b-4 border-orange-600 text-orange-600'
                  : 'text-gray-600 hover:text-orange-600'
              } transition`}
            >
              🥪 Menu Items ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 font-bold text-lg ${
                activeTab === 'content'
                  ? 'border-b-4 border-orange-600 text-orange-600'
                  : 'text-gray-600 hover:text-orange-600'
              } transition`}
            >
              ✏️ Website Content ({contents.length})
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No orders yet</p>
              ) : (
                orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-xl shadow-lg p-6 border-4 border-gray-200 hover:border-orange-300 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{order.customerName}</h3>
                        <p className="text-gray-600 text-lg mt-1">📞 {order.phone}</p>
                        {order.email && <p className="text-gray-600 text-lg">✉️ {order.email}</p>}
                        <p className="text-gray-600 text-lg">📍 {order.address}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <p className="text-3xl font-black text-orange-600 mt-2">₹{order.totalAmount}</p>
                      </div>
                    </div>

                    <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold mb-3 text-gray-800">Items:</h4>
                      <ul className="space-y-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center bg-white p-2 rounded">
                            <span className="font-semibold">{item.name}</span>
                            <span className="text-gray-600">Qty: {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg">
                      <p className="text-gray-700 font-semibold">
                        💳 Payment: <span className="text-orange-600 font-bold">{order.paymentMethod.toUpperCase()}</span>
                      </p>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-300 font-semibold bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      📅 Order Date: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No contact requests yet</p>
              ) : (
                contacts.map((contact) => {
                  const isFranchise = contact.message && contact.message.includes('Franchise Enquiry');
                  return (
                    <div key={contact._id} className={`bg-white rounded-xl shadow-lg p-6 border-4 ${isFranchise ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                      {isFranchise && (
                        <div className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-4 py-2 rounded-lg mb-4 inline-block">
                          <span className="font-bold">🏪 FRANCHISE ENQUIRY</span>
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">{contact.name}</h3>
                          <p className="text-gray-600 text-lg mt-1">📞 {contact.phone}</p>
                          <p className="text-gray-600 text-lg">✉️ {contact.email}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(contact.status)}`}>
                          {contact.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold mb-2 text-gray-800">Message/Details:</h4>
                        <p className="text-gray-700 whitespace-pre-line">{contact.message}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          📅 Received: {new Date(contact.createdAt).toLocaleString()}
                        </p>
                        <select
                          value={contact.status}
                          onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                          className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-300 font-semibold"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-gray-800">Manage Menu Items</h2>
                <button
                  onClick={() => setEditingService({ name: '', description: '', price: 0, image: '', category: '', available: true })}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-black hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                >
                  + Add New Item
                </button>
              </div>

              {editingService && (
                <div className="bg-white rounded-xl shadow-2xl p-8 border-4 border-indigo-200 mb-6">
                  <h3 className="text-2xl font-black mb-6 text-gray-800">
                    {editingService._id ? 'Edit Item' : 'Add New Item'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-bold mb-2 text-gray-800">Name</label>
                      <input
                        type="text"
                        value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold mb-2 text-gray-800">Price (₹)</label>
                      <input
                        type="number"
                        value={editingService.price}
                        onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-lg font-bold mb-2 text-gray-800">Description</label>
                      <textarea
                        value={editingService.description}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold mb-2 text-gray-800">Image URL</label>
                      <input
                        type="url"
                        value={editingService.image}
                        onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold mb-2 text-gray-800">Category</label>
                      <select
                        value={editingService.category}
                        onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                      >
                        <option value="">Select Category</option>
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingService.available}
                          onChange={(e) => setEditingService({ ...editingService, available: e.target.checked })}
                          className="w-5 h-5"
                        />
                        <span className="font-bold text-gray-800">Available</span>
                      </label>
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                      <button
                        onClick={async () => {
                          try {
                            const url = editingService._id
                              ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/services/${editingService._id}`
                              : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/services`;
                            const method = editingService._id ? 'PUT' : 'POST';
                            
                            const response = await fetch(url, {
                              method,
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                              },
                              body: JSON.stringify(editingService),
                            });

                            if (response.ok) {
                              setEditingService(null);
                              fetchData(token);
                              alert('Service saved successfully!');
                            } else {
                              alert('Error saving service');
                            }
                          } catch (error) {
                            console.error('Error saving service:', error);
                            alert('Error saving service');
                          }
                        }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-black hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingService(null)}
                        className="bg-gray-500 text-white px-8 py-3 rounded-xl font-black hover:bg-gray-600 transition shadow-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {services.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No services yet. Add your first menu item!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service._id} className="bg-white rounded-xl shadow-lg p-6 border-4 border-indigo-200 hover:border-indigo-500 transition">
                      {service.image && (
                        <img src={service.image} alt={service.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                      )}
                      <h3 className="text-xl font-black text-gray-800 mb-2">{service.name}</h3>
                      <p className="text-gray-600 mb-2">{service.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-black text-indigo-600">₹{service.price}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${service.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {service.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      {service.category && (
                        <p className="text-sm text-gray-500 mb-4">Category: {service.category}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingService(service)}
                          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this item?')) {
                              try {
                                const response = await fetch(
                                  `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/services/${service._id}`,
                                  {
                                    method: 'DELETE',
                                    headers: {
                                      'Authorization': `Bearer ${token}`,
                                    },
                                  }
                                );
                                if (response.ok) {
                                  fetchData(token);
                                  alert('Service deleted successfully!');
                                }
                              } catch (error) {
                                console.error('Error deleting service:', error);
                                alert('Error deleting service');
                              }
                            }
                          }}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Website Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-800">Manage Website Content</h2>
                  <p className="text-gray-600 mt-2">Edit text, images, logo, and all website content</p>
                </div>
                <div className="flex gap-3">
                  <select
                    value={contentFilter}
                    onChange={(e) => setContentFilter(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 font-semibold"
                  >
                    <option value="all">All Pages</option>
                    <option value="home">Home</option>
                    <option value="about">About</option>
                    <option value="services">Services</option>
                    <option value="contact">Contact</option>
                  </select>
                  <button
                    onClick={() => setEditingContent({ key: '', type: 'text', value: '', label: '', description: '', page: 'home' })}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-black hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                  >
                    + Add New Content
                  </button>
                </div>
              </div>

              {editingContent && (
                <div className="bg-white rounded-xl shadow-2xl p-8 border-4 border-indigo-200 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-gray-800">
                      {editingContent._id ? 'Edit Content' : 'Add New Content'}
                    </h3>
                    <button
                      onClick={() => setEditingContent(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-bold mb-2 text-gray-800">Key (Unique ID)</label>
                      <input
                        type="text"
                        value={editingContent.key}
                        onChange={(e) => setEditingContent({ ...editingContent, key: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                        placeholder="e.g., hero-title, logo-url"
                        disabled={!!editingContent._id}
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold mb-2 text-gray-800">Type</label>
                      <select
                        value={editingContent.type}
                        onChange={(e) => setEditingContent({ ...editingContent, type: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                      >
                        <option value="text">Text</option>
                        <option value="image">Image URL</option>
                        <option value="logo">Logo URL</option>
                        <option value="banner">Banner Image</option>
                        <option value="section">Section Content</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-lg font-bold mb-2 text-gray-800">Label (Display Name)</label>
                      <input
                        type="text"
                        value={editingContent.label}
                        onChange={(e) => setEditingContent({ ...editingContent, label: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                        placeholder="e.g., Hero Title, Main Logo"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold mb-2 text-gray-800">Page</label>
                      <select
                        value={editingContent.page}
                        onChange={(e) => setEditingContent({ ...editingContent, page: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                      >
                        <option value="home">Home</option>
                        <option value="about">About</option>
                        <option value="services">Services</option>
                        <option value="contact">Contact</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-lg font-bold mb-2 text-gray-800">
                        {editingContent.type === 'text' || editingContent.type === 'section' ? 'Text Content' : 'URL'}
                      </label>
                      {editingContent.type === 'text' || editingContent.type === 'section' ? (
                        <textarea
                          value={editingContent.value}
                          onChange={(e) => setEditingContent({ ...editingContent, value: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                          placeholder="Enter text content..."
                        />
                      ) : (
                        <>
                          <input
                            type="url"
                            value={editingContent.value}
                            onChange={(e) => setEditingContent({ ...editingContent, value: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-gray-800 font-semibold"
                            placeholder="https://images.unsplash.com/..."
                          />
                          {editingContent.value && (
                            <div className="mt-4">
                              <img
                                src={editingContent.value}
                                alt="Preview"
                                className="w-full max-w-md h-48 object-cover rounded-xl border-4 border-gray-200"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="md:col-span-2 flex gap-4">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/content`,
                              {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify(editingContent),
                              }
                            );

                            const data = await response.json();

                            if (response.ok) {
                              setEditingContent(null);
                              fetchData(token);
                              alert('Content saved successfully!');
                            } else {
                              alert('Error saving content: ' + (data.message || 'Unknown error'));
                            }
                          } catch (error) {
                            console.error('Error saving content:', error);
                            alert('Error saving content');
                          }
                        }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-black hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                      >
                        Save Content
                      </button>
                      <button
                        onClick={() => setEditingContent(null)}
                        className="bg-gray-500 text-white px-8 py-3 rounded-xl font-black hover:bg-gray-600 transition shadow-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {contents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border-4 border-gray-200">
                  <p className="text-gray-600 text-lg mb-4">No content items yet.</p>
                  <p className="text-gray-500 mb-4">Run this command to setup default content:</p>
                  <code className="bg-gray-100 px-4 py-2 rounded-lg">node setup-default-content.js</code>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contents
                    .filter(content => contentFilter === 'all' || content.page === contentFilter)
                    .map((content) => (
                      <div key={content._id} className="bg-white rounded-xl shadow-lg p-6 border-4 border-indigo-200 hover:border-indigo-500 transition">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-black text-gray-800 mb-1">{content.label}</h3>
                            <p className="text-xs text-gray-500">Key: {content.key}</p>
                            <div className="flex gap-2 mt-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                content.type === 'text' ? 'bg-blue-100 text-blue-800' :
                                content.type === 'image' ? 'bg-green-100 text-green-800' :
                                content.type === 'logo' ? 'bg-purple-100 text-purple-800' :
                                content.type === 'banner' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {content.type.toUpperCase()}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                                {content.page}
                              </span>
                            </div>
                          </div>
                        </div>

                        {content.type === 'image' || content.type === 'logo' || content.type === 'banner' ? (
                          <div className="mb-4">
                            <img
                              src={content.value}
                              alt={content.label}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700 line-clamp-3">{content.value}</p>
                          </div>
                        )}

                        {content.description && (
                          <p className="text-xs text-gray-500 mb-4">{content.description}</p>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingContent(content)}
                            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete "${content.label}"?`)) {
                                try {
                                  const response = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/content/${content.key}`,
                                    {
                                      method: 'DELETE',
                                      headers: {
                                        'Authorization': `Bearer ${token}`,
                                      },
                                    }
                                  );
                                  if (response.ok) {
                                    fetchData(token);
                                    alert('Content deleted successfully!');
                                  }
                                } catch (error) {
                                  console.error('Error deleting content:', error);
                                  alert('Error deleting content');
                                }
                              }
                            }}
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

