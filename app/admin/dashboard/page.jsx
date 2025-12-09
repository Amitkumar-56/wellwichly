'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

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
  const [contentFilter, setContentFilter] = useState('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    newMessages: 0,
    totalServices: 0
  });

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
      setLoading(true);
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
        
        // Calculate stats
        const revenue = ordersData
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        const pending = ordersData.filter(o => o.status === 'pending').length;
        
        setStats(prev => ({
          ...prev,
          totalRevenue: revenue,
          pendingOrders: pending
        }));
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData);
        setStats(prev => ({
          ...prev,
          newMessages: contactsData.filter(c => c.status === 'new').length
        }));
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData);
        setStats(prev => ({
          ...prev,
          totalServices: servicesData.length
        }));
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

  // Mobile responsive tab navigation
  const TabButton = ({ name, icon, count }) => (
    <button
      onClick={() => {
        setActiveTab(name);
        setShowMobileMenu(false);
      }}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
        activeTab === name
          ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden sm:inline">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
      {count > 0 && (
        <span className={`px-2 py-1 text-xs rounded-full font-bold ${
          activeTab === name ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-800'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg bg-gray-100"
            >
              {showMobileMenu ? '✕' : '☰'}
            </button>
            <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
            <button
              onClick={handleLogout}
              className="p-2 bg-red-100 text-red-600 rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>
          
          {/* Stats Bar - Mobile */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-2 rounded-lg border border-orange-200">
              <p className="text-xs text-gray-600">Revenue</p>
              <p className="font-bold text-orange-600">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600">Pending</p>
              <p className="font-bold text-blue-600">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow py-4 lg:py-8">
        <div className="container mx-auto px-4">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-6">
            <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-4 border-indigo-200">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-800 mb-2">Wellwichly Admin Panel</h1>
                <p className="text-gray-600">Manage orders, messages, and menu items</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="bg-indigo-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-bold hover:bg-indigo-700 transition text-sm lg:text-base"
                >
                  🔐 Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-bold hover:bg-red-700 transition text-sm lg:text-base"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Tabs Navigation */}
          <div className={`lg:hidden ${showMobileMenu ? 'block' : 'hidden'} mb-4`}>
            <div className="grid grid-cols-2 gap-2 p-4 bg-white rounded-xl shadow-lg">
              <TabButton name="orders" icon="📦" count={orders.length} />
              <TabButton name="contacts" icon="📞" count={contacts.length} />
              <TabButton name="website" icon="🎨" />
              <TabButton name="payments" icon="💳" />
              <TabButton name="services" icon="🥪" count={services.length} />
              <TabButton name="content" icon="✏️" count={contents.length} />
            </div>
          </div>

          {/* Desktop Tabs Navigation */}
          <div className="hidden lg:flex flex-wrap gap-2 mb-6">
            <TabButton name="orders" icon="📦" count={orders.length} />
            <TabButton name="contacts" icon="📞" count={contacts.length} />
            <TabButton name="website" icon="🎨" />
            <TabButton name="payments" icon="💳" />
            <TabButton name="services" icon="🥪" count={services.length} />
            <TabButton name="content" icon="✏️" count={contents.length} />
          </div>

          {/* Password Change Form */}
          {showPasswordChange && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-gray-800">Change Password</h2>
                  <button
                    onClick={() => setShowPasswordChange(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                {/* ... password form content same as before ... */}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No orders yet</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">{order.customerName}</h3>
                          <p className="text-gray-600 text-sm">📞 {order.phone}</p>
                          {order.email && <p className="text-gray-600 text-sm">✉️ {order.email}</p>}
                          <p className="text-gray-600 text-sm">📍 {order.address}</p>
                        </div>
                        <div className="flex items-start justify-between lg:flex-col lg:items-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <p className="text-2xl font-black text-orange-600">₹{order.totalAmount}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-bold mb-2 text-gray-800">Items:</h4>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded text-sm">
                              <span className="font-semibold">{item.name}</span>
                              <span className="text-gray-600">Qty: {item.quantity} × ₹{item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-orange-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 font-semibold">
                          💳 Payment: <span className="text-orange-600">{order.paymentMethod.toUpperCase()}</span>
                        </p>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="w-full lg:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 font-semibold text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        📅 {new Date(order.createdAt).toLocaleString()}
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
                      <div key={contact._id} className={`bg-gray-50 rounded-xl p-4 border ${isFranchise ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                        {isFranchise && (
                          <div className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-3 py-1 rounded-lg mb-3 inline-block">
                            <span className="font-bold text-sm">🏪 FRANCHISE ENQUIRY</span>
                          </div>
                        )}
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800">{contact.name}</h3>
                            <p className="text-gray-600 text-sm">📞 {contact.phone}</p>
                            <p className="text-gray-600 text-sm">✉️ {contact.email}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(contact.status)}`}>
                            {contact.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="mb-4 bg-white p-3 rounded-lg">
                          <h4 className="font-bold mb-2 text-gray-800">Message/Details:</h4>
                          <p className="text-gray-700 text-sm whitespace-pre-line">{contact.message}</p>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          <p className="text-xs text-gray-500">
                            📅 {new Date(contact.createdAt).toLocaleString()}
                          </p>
                          <select
                            value={contact.status}
                            onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                            className="w-full lg:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 font-semibold text-sm"
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
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-black text-gray-800">Manage Menu Items</h2>
                  <button
                    onClick={() => setEditingService({ name: '', description: '', price: 0, image: '', category: '', available: true })}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition w-full lg:w-auto"
                  >
                    + Add New Item
                  </button>
                </div>

                {editingService && (
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                    <h3 className="text-xl font-black mb-6 text-gray-800">
                      {editingService._id ? 'Edit Item' : 'Add New Item'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-800">Name</label>
                        <input
                          type="text"
                          value={editingService.name}
                          onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-800">Price (₹)</label>
                          <input
                            type="number"
                            value={editingService.price}
                            onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-800">Category</label>
                          <select
                            value={editingService.category}
                            onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                          >
                            <option value="">Select Category</option>
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                          </select>
                        </div>
                      </div>
                      {/* ... rest of service form ... */}
                    </div>
                  </div>
                )}

                {services.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No services yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => (
                      <div key={service._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        {service.image && (
                          <img src={service.image} alt={service.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                        )}
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xl font-black text-indigo-600">₹{service.price}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${service.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {service.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingService(service)}
                            className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-indigo-700 transition text-sm"
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
                                  }
                                } catch (error) {
                                  console.error('Error deleting service:', error);
                                }
                              }
                            }}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-red-700 transition text-sm"
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
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-800">Manage Website Content</h2>
                    <p className="text-gray-600 text-sm">Edit text and images for each page</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={contentFilter}
                      onChange={(e) => setContentFilter(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 font-semibold text-sm"
                    >
                      <option value="all">All Pages</option>
                      <option value="home">Home</option>
                      <option value="about">About</option>
                      <option value="services">Services</option>
                      <option value="contact">Contact</option>
                    </select>
                    <button
                      onClick={() => setEditingContent({ key: '', type: 'text', value: '', label: '', description: '', page: 'home' })}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition text-sm"
                    >
                      + Add New
                    </button>
                  </div>
                </div>

                {/* Content items grid - responsive */}
                {contents.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contents
                      .filter(content => contentFilter === 'all' || content.page === contentFilter)
                      .map((content) => (
                        <div key={content._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{content.label}</h3>
                              <div className="flex flex-wrap gap-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                  content.type === 'text' ? 'bg-blue-100 text-blue-800' :
                                  content.type === 'image' ? 'bg-green-100 text-green-800' :
                                  content.type === 'logo' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {content.type}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                                  {content.page}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => setEditingContent(content)}
                              className="ml-2 text-indigo-600 hover:text-indigo-800"
                            >
                              Edit
                            </button>
                          </div>
                          {/* ... rest of content card ... */}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Logo & Images Tab */}
            {activeTab === 'website' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-800">Logo & Images Management</h2>
                
                {/* Logo Section */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">🏷️ Website Logo</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-800">Logo URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com/logo.png"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                        defaultValue={contents.find(c => c.key === 'logo-url')?.value || '/wellwichly.png'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-800">Preview</label>
                      <div className="w-full max-w-xs h-32 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center">
                        <img
                          src={contents.find(c => c.key === 'logo-url')?.value || '/wellwichly.png'}
                          alt="Logo"
                          className="max-h-20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header Images - Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['home', 'about', 'services', 'contact'].map((page) => (
                    <div key={page} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="font-bold mb-3 text-gray-800 capitalize">{page} Page</h4>
                      <div className="space-y-3">
                        <input
                          type="url"
                          placeholder={`https://example.com/${page}-header.jpg`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                        />
                        <div className="w-full h-24 bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <img
                            src={contents.find(c => c.key === `${page}-header-image`)?.value || 'https://via.placeholder.com/400x100'}
                            alt={`${page} header`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-800">💳 Payment Management</h2>
                
                {/* Stats Cards - Responsive */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-xl font-black text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Online</p>
                    <p className="text-xl font-black text-blue-600">
                      {orders.filter(o => o.paymentMethod === 'online' && o.status !== 'cancelled').length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Cash</p>
                    <p className="text-xl font-black text-orange-600">
                      {orders.filter(o => o.paymentMethod === 'cash' && o.status !== 'cancelled').length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Cancelled</p>
                    <p className="text-xl font-black text-purple-600">
                      {orders.filter(o => o.status === 'cancelled').length}
                    </p>
                  </div>
                </div>

                {/* Recent Payments List */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-800">Recent Payments</h3>
                  {orders
                    .filter(o => o.status !== 'cancelled')
                    .slice(0, 5)
                    .map((order) => (
                      <div key={order._id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">{order.customerName}</p>
                            <p className="text-xs text-gray-600">Order #{order._id.slice(-6)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-800">₹{order.totalAmount}</p>
                            <span className={`text-xs px-2 py-1 rounded ${order.paymentMethod === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                              {order.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center h-16">
          {['orders', 'contacts', 'services', 'content'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center justify-center w-full h-full ${
                activeTab === tab ? 'text-orange-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">
                {tab === 'orders' && '📦'}
                {tab === 'contacts' && '📞'}
                {tab === 'services' && '🥪'}
                {tab === 'content' && '✏️'}
              </span>
              <span className="text-xs mt-1 font-semibold">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add padding to content for mobile bottom nav */}
      <div className="lg:hidden pb-16"></div>

      <Footer />
    </div>
  );
}