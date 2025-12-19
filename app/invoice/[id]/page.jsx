'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

export default function InvoicePage() {
  const params = useParams();
  const id = params?.id || '';
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  const invoiceUrl = `${apiBase}/api/orders/${id}/invoice`;
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const subtotal = (order?.items || []).reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 1), 0);
  const tax = 0;
  const grand = subtotal + tax;

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${apiBase}/api/orders/track?orderId=${id}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data.order);
        } else {
          setError(data.message || 'Order not found');
        }
      } catch (e) {
        setError('Network error. Please ensure backend server is running.');
      }
    };
    fetchOrder();
  }, [id, apiBase]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-black text-center mb-8 text-gray-800">
            Invoice Preview
          </h1>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {order && (
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-1">Bill To</h3>
                  <p className="text-lg font-black text-gray-800">{order.customerName}</p>
                  <p className="text-gray-700">{order.address}</p>
                  <p className="text-gray-700">{order.phone}</p>
                  {order.email && <p className="text-gray-700">{order.email}</p>}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-500 mb-1">Invoice Details</h3>
                  <p className="text-lg font-black text-gray-800 break-all">ID: {order._id}</p>
                  <p className="text-gray-700">Status: <span className="font-black capitalize">{order.status}</span></p>
                  <p className="text-gray-700">Payment: <span className="font-black capitalize">{order.paymentMethod}</span></p>
                  <p className="text-gray-700">Date: {new Date(order.createdAt || order.orderDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="overflow-x-auto border-2 border-indigo-100 rounded-2xl">
                <table className="min-w-full text-sm">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="text-left p-3 font-black text-gray-800">Item</th>
                      <th className="text-right p-3 font-black text-gray-800">Qty</th>
                      <th className="text-right p-3 font-black text-gray-800">Rate</th>
                      <th className="text-right p-3 font-black text-gray-800">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((it, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-3 font-semibold text-gray-800">{it.name}</td>
                        <td className="p-3 text-right">{it.quantity}</td>
                        <td className="p-3 text-right">₹{Number(it.price).toFixed(2)}</td>
                        <td className="p-3 text-right font-black">₹{(Number(it.price) * Number(it.quantity)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="md:col-start-3 bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">Subtotal</span>
                    <span className="font-black">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">Taxes</span>
                    <span className="font-black">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-black text-gray-800">Grand Total</span>
                    <span className="font-black text-indigo-700">₹{grand.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-2xl border-2 border-indigo-200 overflow-hidden">
            <div className="p-4 flex justify-between items-center">
              <a
                href={invoiceUrl}
                target="_blank"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-black hover:from-indigo-700 hover:to-purple-700 transition shadow-xl"
              >
                Download PDF
              </a>
              <Link
                href="/"
                className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-xl font-black hover:bg-gray-100 transition shadow-xl border-2 border-indigo-300"
              >
                Back to Home
              </Link>
            </div>
            <div className="h-[70vh] border-t-2 border-indigo-100">
              <iframe
                title="Invoice PDF"
                src={invoiceUrl}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
