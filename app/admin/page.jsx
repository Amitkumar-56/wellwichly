'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState('username'); // 'username' or 'email'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    try {
      const loginData = loginMethod === 'email' 
        ? { email, password }
        : { username, password };

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json().catch(() => ({ message: 'Server error' }));

      if (!response.ok) {
        setError(data.message || 'Invalid credentials. Please check username and password.');
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        router.push('/admin/dashboard');
      } else {
        setError('Invalid response from server. Token not received.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setError(`Cannot connect to server at ${apiUrl}. Please make sure the backend server is running. Run: npm run dev:server`);
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-indigo-200">
          <h1 className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Admin Login</h1>
          <p className="text-center text-gray-600 mb-6">Wellwichly Admin Panel</p>
          
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-xl mb-4">
              <p className="font-bold mb-2">❌ Error:</p>
              <p className="text-sm">{error}</p>
              {error.includes('Cannot connect') && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p className="text-xs font-bold text-yellow-800 mb-1">💡 Quick Fix:</p>
                  <p className="text-xs text-yellow-700">1. Open a new terminal</p>
                  <p className="text-xs text-yellow-700">2. Run: <code className="bg-yellow-100 px-1 rounded">npm run dev:server</code></p>
                  <p className="text-xs text-yellow-700">3. Wait for "Server running on port 5000"</p>
                  <p className="text-xs text-yellow-700">4. Try logging in again</p>
                </div>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {loginMethod === 'username' ? (
              <div>
                <label className="block text-sm font-semibold mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-gray-800 font-semibold transition"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-gray-800 font-semibold transition"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 text-gray-800 font-semibold transition"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-black text-lg hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

