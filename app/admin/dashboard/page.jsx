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
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceSort, setServiceSort] = useState('recent');
  const [toast, setToast] = useState(null);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
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

      const [ordersRes, contactsRes, servicesRes, contentsRes, usersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contacts`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/services/all`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/content`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/users`, { headers }),
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
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
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
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/orders/${orderId}/status`,
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
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/contacts/${contactId}/status`,
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

  const saveService = async () => {
    if (!token || !editingService) return;
    try {
      if (!editingService.name || !editingService.category || !editingService.price || Number(editingService.price) <= 0) {
        setToast({ type: 'error', message: 'Name, Category aur Price required hai' });
        return;
      }
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const method = editingService._id ? 'PUT' : 'POST';
      const url = editingService._id
        ? `${apiBase}/api/services/${editingService._id}`
        : `${apiBase}/api/services`;
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
        setToast({ type: 'success', message: 'Item save ho gaya' });
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast({ type: 'error', message: 'Save mein error aayi' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      setToast({ type: 'error', message: 'Network error, dobara koshish karein' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const saveContent = async () => {
    if (!token || !editingContent) return;
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const method = editingContent._id ? 'PUT' : 'POST';
      const url = editingContent._id
        ? `${apiBase}/api/content/${editingContent.key}`
        : `${apiBase}/api/content`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingContent),
      });
      if (response.ok) {
        setEditingContent(null);
        fetchData(token);
        setToast({ type: 'success', message: 'Content save ho gaya!' });
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast({ type: 'error', message: 'Content save fail ho gaya' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setToast({ type: 'error', message: 'Network error, dobara koshish karein' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const saveContentItem = async (item) => {
    if (!token || !item) return;
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const method = item._id ? 'PUT' : 'POST';
      const url = item._id ? `${apiBase}/api/content/${item.key}` : `${apiBase}/api/content`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });
      if (response.ok) {
        fetchData(token);
        setToast({ type: 'success', message: 'Image save ho gaya!' });
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast({ type: 'error', message: 'Image save fail ho gaya' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error('Error saving content item:', error);
      setToast({ type: 'error', message: 'Network error, dobara koshish karein' });
      setTimeout(() => setToast(null), 3000);
    }
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
          <div className="flex justify-between items-center mb-6 bg-white/70 backdrop-blur-md p-6 rounded-2xl border-2 border-indigo-200 shadow-xl">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-800 mb-2">Wellwichly Admin Panel</h1>
              <p className="text-gray-600">Manage orders, messages, and menu items</p>
            </div>
            <div className="flex gap-3">
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-bold hover:from-indigo-700 hover:to-purple-700 transition text-sm lg:text-base shadow-lg"
                >
                  🔐 Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-bold hover:from-red-700 hover:to-orange-700 transition text-sm lg:text-base shadow-lg"
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
              <TabButton name="users" icon="👥" count={users.length} />
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
            <TabButton name="users" icon="👥" count={users.length} />
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
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/orders/${order._id}/invoice`}
                          target="_blank"
                          download={`invoice-${String(order._id).slice(-8).toUpperCase()}.pdf`}
                          className="px-3 py-2 bg-white border-2 border-orange-300 rounded-lg text-orange-700 font-bold hover:bg-orange-100 transition-all duration-300 transform hover:scale-105"
                          onClick={(e) => {
                            // Ensure download works even if target="_blank" interferes
                            const link = e.currentTarget;
                            setTimeout(() => {
                              window.open(link.href, '_blank');
                            }, 100);
                          }}
                        >
                          📄 Download Invoice
                        </a>
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
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        placeholder="Search items..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                      />
                    </div>
                    <select
                      value={serviceSort}
                      onChange={(e) => setServiceSort(e.target.value)}
                      className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                    >
                      <option value="recent">Recent</option>
                      <option value="price_low">Price Low</option>
                      <option value="price_high">Price High</option>
                      <option value="name">Name</option>
                      <option value="available">Available First</option>
                    </select>
                    <button
                      onClick={() => setEditingService({ name: '', description: '', price: 0, image: '', category: '', available: true })}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition w-full sm:w-auto"
                    >
                      + Add New Item
                    </button>
                  </div>
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
                        {(!editingService.name) && (
                          <p className="text-xs text-red-600 mt-1">Name required hai</p>
                        )}
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
                          {(!editingService.price || Number(editingService.price) <= 0) && (
                            <p className="text-xs text-red-600 mt-1">Valid price daalein</p>
                          )}
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
                          {(!editingService.category) && (
                            <p className="text-xs text-red-600 mt-1">Category select karein</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-800">Description</label>
                        <textarea
                          value={editingService.description || ''}
                          onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold mb-2 text-gray-800">Image URL</label>
                          <input
                            type="url"
                            value={editingService.image || ''}
                            onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                          />
                        </div>
                        <div className="flex items-center gap-3 mt-8 lg:mt-0">
                          <input
                            id="available"
                            type="checkbox"
                            checked={Boolean(editingService.available)}
                            onChange={(e) => setEditingService({ ...editingService, available: e.target.checked })}
                            className="h-5 w-5"
                          />
                          <label htmlFor="available" className="text-sm font-bold text-gray-800">Available</label>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          onClick={saveService}
                          className={`px-6 py-3 rounded-xl font-bold transition w-full sm:w-auto ${(!editingService.name || !editingService.category || !editingService.price || Number(editingService.price) <= 0) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                          disabled={!editingService.name || !editingService.category || !editingService.price || Number(editingService.price) <= 0}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition w-full sm:w-auto"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-pulse">
                        <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                        <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {services.length === 0 && !loading ? (
                  <p className="text-center text-gray-600 py-8">No services yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services
                      .filter((s) => {
                        const q = serviceSearch.trim().toLowerCase();
                        if (!q) return true;
                        return (
                          (s.name || '').toLowerCase().includes(q) ||
                          (s.description || '').toLowerCase().includes(q) ||
                          (s.category || '').toLowerCase().includes(q)
                        );
                      })
                      .sort((a, b) => {
                        if (serviceSort === 'price_low') return (a.price || 0) - (b.price || 0);
                        if (serviceSort === 'price_high') return (b.price || 0) - (a.price || 0);
                        if (serviceSort === 'name') return (a.name || '').localeCompare(b.name || '');
                        if (serviceSort === 'available') return (b.available === true) - (a.available === true);
                        return 0;
                      })
                      .map((service) => (
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
                                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/services/${service._id}`,
                                    {
                                      method: 'DELETE',
                                      headers: {
                                        'Authorization': `Bearer ${token}`,
                                      },
                                    }
                                  );
                                  if (response.ok) {
                                    fetchData(token);
                                    setToast({ type: 'success', message: 'Item delete ho gaya' });
                                    setTimeout(() => setToast(null), 3000);
                                  } else {
                                    setToast({ type: 'error', message: 'Delete fail ho gaya' });
                                    setTimeout(() => setToast(null), 3000);
                                  }
                                } catch (error) {
                                  console.error('Error deleting service:', error);
                                  setToast({ type: 'error', message: 'Network error, delete nahi hua' });
                                  setTimeout(() => setToast(null), 3000);
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

                {editingContent && (
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-indigo-200 mb-6 animate-scaleIn">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-gray-800">
                        {editingContent._id ? 'Edit Content' : 'Add Content'}
                      </h3>
                      <button
                        onClick={() => setEditingContent(null)}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                      >
                        ×
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-800">Label</label>
                        <input
                          type="text"
                          value={editingContent.label || ''}
                          onChange={(e) => setEditingContent({ ...editingContent, label: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-800">Key</label>
                        <input
                          type="text"
                          value={editingContent.key || ''}
                          onChange={(e) => setEditingContent({ ...editingContent, key: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                          disabled={Boolean(editingContent._id)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-800">Type</label>
                        <select
                          value={editingContent.type || 'text'}
                          onChange={(e) => setEditingContent({ ...editingContent, type: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                        >
                          <option value="text">Text</option>
                          <option value="image">Image</option>
                          <option value="logo">Logo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-800">Page</label>
                        <select
                          value={editingContent.page || 'home'}
                          onChange={(e) => setEditingContent({ ...editingContent, page: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                        >
                          <option value="home">Home</option>
                          <option value="about">About</option>
                          <option value="services">Services</option>
                          <option value="contact">Contact</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-bold mb-2 text-gray-800">{editingContent.type === 'text' ? 'Text' : 'URL'}</label>
                      {editingContent.type === 'text' ? (
                        <textarea
                          value={editingContent.value || ''}
                          onChange={(e) => setEditingContent({ ...editingContent, value: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                          rows={3}
                        />
                      ) : (
                        <input
                          type="url"
                          value={editingContent.value || ''}
                          onChange={(e) => setEditingContent({ ...editingContent, value: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                        />
                      )}
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-bold mb-2 text-gray-800">Description</label>
                      <textarea
                        value={editingContent.description || ''}
                        onChange={(e) => setEditingContent({ ...editingContent, description: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                        rows={2}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        onClick={saveContent}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
                      >
                        💾 Save Content
                      </button>
                      <button
                        onClick={() => setEditingContent(null)}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300 w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {/* Content items grid - responsive */}
                {contents.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contents
                      .filter(content => contentFilter === 'all' || content.page === contentFilter)
                      .map((content, index) => (
                        <div key={content._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition-all duration-300 transform hover:scale-105 animate-slideUp" style={{ animationDelay: `${index * 0.05}s` }}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{content.label}</h3>
                              <div className="flex flex-wrap gap-1 mb-2">
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
                              <p className="text-xs text-gray-600 line-clamp-2">{content.value || 'No value set'}</p>
                            </div>
                            <button
                              onClick={() => setEditingContent(content)}
                              className="ml-2 text-indigo-600 hover:text-indigo-800 font-bold transition-all duration-300 transform hover:scale-110"
                            >
                              ✏️ Edit
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                {contents.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <p className="text-gray-600 text-lg">No content items yet. Add new content to get started!</p>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-black text-gray-800">User Management</h2>
                  <button
                    onClick={() => setEditingUser({ username: '', email: '', password: '', role: 'subadmin' })}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition w-full lg:w-auto"
                  >
                    + Add User
                  </button>
                </div>
                {editingUser && (
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                    <h3 className="text-xl font-black mb-6 text-gray-800">
                      {editingUser._id ? 'Edit User' : 'Add New User'}
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-800">Username</label>
                        <input
                          type="text"
                          value={editingUser.username || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-800">Email</label>
                        <input
                          type="email"
                          value={editingUser.email || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-800">Password</label>
                        <input
                          type="password"
                          value={editingUser.password || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-gray-800">Role</label>
                        <select
                          value={editingUser.role || 'subadmin'}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-800"
                        >
                          <option value="admin">Admin</option>
                          <option value="subadmin">Subadmin</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={async () => {
                          if (!token || !editingUser) return;
                          if (!editingUser.username || !editingUser.password) {
                            setToast({ type: 'error', message: 'Username aur Password required hai' });
                            setTimeout(() => setToast(null), 3000);
                            return;
                          }
                          try {
                            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                            const response = await fetch(`${apiBase}/api/auth/users`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                              },
                              body: JSON.stringify(editingUser),
                            });
                            if (response.ok) {
                              setEditingUser(null);
                              fetchData(token);
                              setToast({ type: 'success', message: 'User create ho gaya' });
                              setTimeout(() => setToast(null), 3000);
                            } else {
                              const data = await response.json().catch(() => ({}));
                              setToast({ type: 'error', message: data.message || 'User create fail' });
                              setTimeout(() => setToast(null), 3000);
                            }
                          } catch (error) {
                            console.error('Error creating user:', error);
                            setToast({ type: 'error', message: 'Network error' });
                            setTimeout(() => setToast(null), 3000);
                          }
                        }}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition w-full sm:w-auto"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((u) => (
                    <div key={u._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{u.username}</h3>
                          {u.email && <p className="text-sm text-gray-600">{u.email}</p>}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {u.role}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            const nextRole = u.role === 'admin' ? 'subadmin' : 'admin';
                            try {
                              const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                              const response = await fetch(`${apiBase}/api/auth/users/${u._id}/role`, {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify({ role: nextRole }),
                              });
                              if (response.ok) {
                                fetchData(token);
                                setToast({ type: 'success', message: 'Role update ho gaya' });
                                setTimeout(() => setToast(null), 3000);
                              } else {
                                setToast({ type: 'error', message: 'Role update fail' });
                                setTimeout(() => setToast(null), 3000);
                              }
                            } catch (error) {
                              console.error('Error updating role:', error);
                              setToast({ type: 'error', message: 'Network error' });
                              setTimeout(() => setToast(null), 3000);
                            }
                          }}
                          className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-indigo-700 transition text-sm"
                        >
                          Toggle Role
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Delete user?')) {
                              try {
                                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                                const response = await fetch(`${apiBase}/api/auth/users/${u._id}`, {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                  },
                                });
                                if (response.ok) {
                                  fetchData(token);
                                  setToast({ type: 'success', message: 'User delete ho gaya' });
                                  setTimeout(() => setToast(null), 3000);
                                } else {
                                  setToast({ type: 'error', message: 'Delete fail' });
                                  setTimeout(() => setToast(null), 3000);
                                }
                              } catch (error) {
                                console.error('Error deleting user:', error);
                                setToast({ type: 'error', message: 'Network error' });
                                setTimeout(() => setToast(null), 3000);
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

                {/* Home Slider Images */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">🏞️ Home Slider Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1,2,3,4,5].map((i) => {
                      const key = `home-slider-${i}`;
                      const existing = contents.find(c => c.key === key);
                      return (
                        <div key={key} className="bg-white rounded-xl p-4 border-2 border-indigo-100">
                          <label className="block text-sm font-bold mb-2 text-gray-800">Image {i} URL</label>
                          <input
                            type="url"
                            defaultValue={existing?.value || ''}
                            onBlur={(e) => {
                              const url = e.target.value.trim();
                              if (!url) return;
                              const item = {
                                key,
                                type: 'image',
                                value: url,
                                label: `Home Slider Image ${i}`,
                                description: 'Homepage hero slider image',
                                page: 'home',
                              };
                              saveContentItem(item);
                            }}
                            placeholder="https://example.com/slider.jpg"
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                          />
                          <div className="w-full h-24 mt-3 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            <img
                              src={existing?.value || 'https://via.placeholder.com/400x150'}
                              alt={`Slider ${i}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Paste image URL and unfocus to save.</p>
                        </div>
                      );
                    })}
                  </div>
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
          {[
            { key: 'orders', icon: '📦', count: stats.pendingOrders },
            { key: 'contacts', icon: '📞', count: stats.newMessages },
            { key: 'services', icon: '🥪', count: stats.totalServices },
            { key: 'content', icon: '✏️', count: contents.length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`relative flex flex-col items-center justify-center w-full h-full ${
                activeTab === t.key ? 'text-orange-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              <span className="text-xs mt-1 font-semibold capitalize">{t.key}</span>
              {t.count > 0 && (
                <span className="absolute top-2 right-6 text-[10px] px-2 py-0.5 rounded-full bg-orange-600 text-white font-bold">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Add padding to content for mobile bottom nav */}
      <div className="lg:hidden pb-16"></div>

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg font-semibold ${
          toast.type === 'success' ? 'bg-green-600 text-white' :
          toast.type === 'error' ? 'bg-red-600 text-white' :
          'bg-gray-800 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <Footer />
    </div>
  );
}
