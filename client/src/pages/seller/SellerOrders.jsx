import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Clock,
  AlertCircle,
  Eye,
  ChevronDown
} from 'lucide-react';

export default function SellerOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Initial mockup seller orders list
  const [orders, setOrders] = useState([
    {
      id: 'ORD-98231',
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav.sharma@example.com',
      date: '2026-09-18',
      items: [
        { name: 'Sony WH-1000XM5 Noise Canceling Headphones', qty: 1, price: 349.99 }
      ],
      totalAmount: 349.99,
      paymentStatus: 'Paid (Razorpay)',
      status: 'Processing',
      shippingAddress: 'Flat 402, Green Acres Apt, Bandra West, Mumbai, Maharashtra 400050'
    },
    {
      id: 'ORD-98219',
      customerName: 'Priya Patel',
      customerEmail: 'priya.patel@example.com',
      date: '2026-09-17',
      items: [
        { name: 'Apple MacBook Air M3 (16GB, 512GB SSD)', qty: 1, price: 1299.00 }
      ],
      totalAmount: 1299.00,
      paymentStatus: 'Paid (Credit Card)',
      status: 'Shipped',
      shippingAddress: 'Sector 62, Digital Park, Noida, Uttar Pradesh 201301'
    },
    {
      id: 'ORD-98184',
      customerName: 'Rahul Verma',
      customerEmail: 'rahul.verma@example.com',
      date: '2026-09-15',
      items: [
        { name: 'Logitech MX Master 3S Wireless Mouse', qty: 2, price: 99.99 }
      ],
      totalAmount: 199.98,
      paymentStatus: 'Paid (UPI)',
      status: 'Delivered',
      shippingAddress: 'Koramangala 4th Block, Bengaluru, Karnataka 560034'
    }
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
            <CheckCircle size={12} /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Truck size={12} /> Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Clock size={12} /> Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold">
            <AlertCircle size={12} /> {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="text-violet-600" size={26} /> Seller Order Fulfillment
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage incoming orders for your store products, update delivery progress, and handle shipping.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl pl-9 pr-4 py-2 outline-none focus:border-violet-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter size={16} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3 py-2 outline-none focus:border-violet-500 focus:bg-white font-medium"
          >
            <option value="all">All Order Statuses</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Items Ordered</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Fulfillment Status</th>
                <th className="px-6 py-4 text-right">Update Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No matching seller orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-slate-900 block">{order.id}</span>
                      <span className="text-[11px] text-slate-500">{order.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{order.customerName}</span>
                      <span className="text-[11px] text-slate-500 block">{order.customerEmail}</span>
                    </td>
                    <td className="px-6 py-4">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="text-slate-700 font-medium">
                          <span className="font-bold text-slate-900">{it.name}</span>
                          <span className="text-violet-600 ml-1.5 font-bold">x{it.qty}</span>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">${order.totalAmount.toFixed(2)}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold block">{order.paymentStatus}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-violet-500 focus:bg-white font-medium"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
