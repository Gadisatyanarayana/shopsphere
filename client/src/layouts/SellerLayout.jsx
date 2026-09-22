import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Ticket,
  Store,
  Plus,
  ArrowLeft
} from 'lucide-react';

export default function SellerLayout() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { label: 'Seller Dashboard', path: '/seller/dashboard', icon: LayoutDashboard },
    { label: 'My Products Catalog', path: '/seller/products', icon: Package },
    { label: 'Seller Orders', path: '/seller/orders', icon: ShoppingBag },
    { label: 'Promo Coupons', path: '/seller/coupons', icon: Ticket }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Seller Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shadow-sm">
        <div className="p-6 space-y-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span>ShopSphere <span className="text-[10px] text-violet-600 font-bold block uppercase tracking-wider">SELLER PORTAL</span></span>
          </Link>

          <nav className="space-y-1.5 pt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Customer Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-slate-900 capitalize">
              Seller Management Portal / {location.pathname.split('/')[2] || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/seller/products/new"
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Plus size={14} /> Add New Product
            </Link>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={user?.name}
                className="w-8 h-8 rounded-lg object-cover border border-violet-500/40"
              />
              <div>
                <span className="text-xs font-semibold text-slate-900 block truncate max-w-[120px]">{user?.name || 'Seller'}</span>
                <span className="text-[10px] text-violet-600 font-bold block uppercase">VERIFIED SELLER</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
