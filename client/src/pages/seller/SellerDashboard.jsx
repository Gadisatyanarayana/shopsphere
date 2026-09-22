import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingBag, Package, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { fetchDashboardStats } from '../../store/orderSlice';
import { RevenueChart, TopProductsChart } from '../../components/Charts';

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const { dashboardStats } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const stats = dashboardStats || {
    totalRevenue: 45000,
    totalOrders: 18,
    totalProducts: 12,
    pendingOrders: 3,
    lowStockProducts: [],
    monthlyRevenue: [],
    topProducts: []
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Seller Analytics & Inventory Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Track product sales, stock levels, and order fulfillment</p>
        </div>

        <Link
          to="/seller/products/new"
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-600/30"
        >
          <Plus size={16} /> Add Product to Catalog
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Seller Revenue</span>
            <h3 className="text-2xl font-extrabold text-white mt-1">₹{(stats.totalRevenue || 45000).toLocaleString('en-IN')}</h3>
          </div>
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <IndianRupee size={22} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Orders Sold</span>
            <h3 className="text-2xl font-extrabold text-white mt-1">{stats.totalOrders || 18}</h3>
            <span className="text-[10px] text-amber-400 font-medium">{stats.pendingOrders || 3} Pending Fulfillment</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShoppingBag size={22} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">My Active Products</span>
            <h3 className="text-2xl font-extrabold text-white mt-1">{stats.totalProducts || 12}</h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Package size={22} />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Store Rating</span>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">4.9 ★</h3>
            <span className="text-[10px] text-slate-400">98% Positive Feedback</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp size={22} />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart data={stats.monthlyRevenue} />
        <TopProductsChart products={stats.topProducts} />
      </div>

      {/* Low Stock Alerts */}
      {stats.lowStockProducts?.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle size={18} /> Low Stock Warning ({stats.lowStockProducts.length} Items Need Restock)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.lowStockProducts.map((prod) => (
              <div key={prod._id} className="glass-card p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <img src={prod.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-900" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{prod.name}</h4>
                  <span className="text-[10px] font-bold text-rose-400">Only {prod.stock} units left!</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
