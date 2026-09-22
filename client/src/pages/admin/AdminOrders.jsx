import React, { useEffect, useState } from 'react';
import { Package, Search, Filter } from 'lucide-react';
import Toast from '../../components/Toast';
import Pagination from '../../components/Pagination';
import API from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const loadOrders = async () => {
    try {
      const res = await API.get(`/orders/admin/all?page=${page}&status=${status}`);
      setOrders(res.data.orders || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, status]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setToastMessage(`Order status updated to "${newStatus}"!`);
      loadOrders();
    } catch (err) {
      setToastMessage(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Order Governance Portal</h1>
          <p className="text-xs text-slate-500 mt-1">Fulfill customer shipments and update status progression</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-indigo-600" />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl px-3 py-2 outline-none focus:bg-white"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-6">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-indigo-600">#{ord._id.slice(-8).toUpperCase()}</td>
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    {ord.user?.name || 'Customer'}
                    <span className="block text-[10px] text-slate-400 font-normal">{ord.user?.email}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4 font-extrabold text-slate-900">₹{ord.total.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4">
                    <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 rounded-xl px-2.5 py-1.5 outline-none focus:border-indigo-500 focus:bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
}
