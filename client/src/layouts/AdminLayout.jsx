import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Shield,
  ArrowLeft
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { label: 'Platform Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users & Sellers', path: '/admin/users', icon: Users },
    { label: 'Category Directory', path: '/admin/categories', icon: FolderTree }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      {/* Super Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shadow-sm">
        <div className="p-6 space-y-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span>ShopSphere <span className="text-[10px] text-indigo-600 font-bold block uppercase tracking-wider">SUPER ADMIN</span></span>
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
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
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
              Super Admin Governance / {location.pathname.split('/')[2] || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={user?.name}
              className="w-8 h-8 rounded-lg object-cover border border-indigo-500/40"
            />
            <div>
              <span className="text-xs font-semibold text-slate-900 block truncate max-w-[120px]">{user?.name || 'Super Admin'}</span>
              <span className="text-[10px] text-indigo-600 font-bold block uppercase">PLATFORM GOVERNANCE</span>
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
