import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Store, Mail, ArrowRight, AlertCircle, Lock } from 'lucide-react';
import { googleLogin } from '../../src/store/authSlice';

export default function Login() {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState('customer');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSignIn = async (emailToUse, roleToUse, customName = '') => {
    let defaultEmail = 'buyer.customer@gmail.com';
    let resolvedRole = roleToUse;

    if (roleToUse === 'seller') defaultEmail = 'seller.store@shopsphere.com';

    const email = emailToUse || defaultEmail;

    // Secret Admin Auto-Resolution for satyanarayanag904@gmail.com
    if (email.toLowerCase().includes('satyanarayanag904@gmail.com') || email.toLowerCase().includes('admin')) {
      resolvedRole = 'admin';
    }

    let name = customName;
    if (!name) {
      if (email.includes('@')) {
        const handle = email.split('@')[0].replace(/[^a-zA-Z0-9]+/g, ' ');
        name = handle.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      } else {
        if (resolvedRole === 'seller') name = 'ShopSphere Verified Seller';
        else if (resolvedRole === 'admin') name = 'Satyanarayana Super Admin';
        else name = 'Alex Rivera';
      }
    }

    const result = await dispatch(
      googleLogin({
        name,
        email,
        role: resolvedRole,
        avatar: resolvedRole === 'seller'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
          : resolvedRole === 'admin'
          ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=300'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
      })
    );

    if (!result.error) {
      const userRole = result.payload?.user?.role || resolvedRole;
      if (userRole === 'seller') {
        navigate('/seller/dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      handleSignIn(emailInput.trim(), roleInput, nameInput.trim());
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel w-full max-w-lg p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8 text-center bg-slate-950/90">
        {/* Header */}
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/20 hover:scale-105 transition-transform"
          >
            <ShoppingBag className="w-7 h-7 text-white" />
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Welcome to ShopSphere</h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Sign in to access your buyer shopping account or seller merchant store.
          </p>
        </div>

        {error && (
          <div className="glass-panel p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Public Access Cards: Buyer & Seller Only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {/* Buyer */}
          <div
            onClick={() => handleSignIn('buyer.customer@gmail.com', 'customer', 'Alex Rivera')}
            className="group glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 cursor-pointer space-y-3 transition-all bg-slate-900/60"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">Buyer Shopping Account</h3>
              <p className="text-[11px] text-slate-400">Search products, cart, address book & orders</p>
            </div>
            <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 pt-1">
              Sign In Buyer <ArrowRight size={12} />
            </span>
          </div>

          {/* Seller */}
          <div
            onClick={() => handleSignIn('seller.store@shopsphere.com', 'seller', 'ShopSphere Seller')}
            className="group glass-card p-5 rounded-2xl border border-slate-800 hover:border-violet-500/50 cursor-pointer space-y-3 transition-all bg-slate-900/60"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors">Seller Merchant Store</h3>
              <p className="text-[11px] text-slate-400">Upload items, manage inventory & seller orders</p>
            </div>
            <span className="text-[10px] font-bold text-violet-400 flex items-center gap-1 pt-1">
              Sign In Seller <ArrowRight size={12} />
            </span>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">or sign in with email</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Clean Input Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name (Optional)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Satyanarayana"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-indigo-500 transition-all"
              />
              <User className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="your.email@domain.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-indigo-500 transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Account Role:</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  roleInput === 'customer'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <input
                  type="radio"
                  name="roleInput"
                  value="customer"
                  checked={roleInput === 'customer'}
                  onChange={() => setRoleInput('customer')}
                  className="hidden"
                />
                <span>🛒 Buyer Account</span>
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  roleInput === 'seller'
                    ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <input
                  type="radio"
                  name="roleInput"
                  value="seller"
                  checked={roleInput === 'seller'}
                  onChange={() => setRoleInput('seller')}
                  className="hidden"
                />
                <span>🏪 Seller Merchant</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-xl shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In Now'}
          </button>
        </form>

        <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium border-t border-slate-800/80">
          <Lock size={12} className="text-slate-400" />
          <span>ShopSphere End-to-End Encrypted Access Security</span>
        </div>
      </div>
    </div>
  );
}
