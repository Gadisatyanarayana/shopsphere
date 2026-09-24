import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Store, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../../src/store/authSlice';

export default function Login() {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState('customer');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSignIn = async (emailToUse, roleToUse, customName = '') => {
    let email = emailToUse || (roleToUse === 'seller' ? 'seller.store@shopsphere.com' : 'buyer.customer@gmail.com');
    let resolvedRole = roleToUse;

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
        name = resolvedRole === 'seller' ? 'ShopSphere Verified Seller' : resolvedRole === 'admin' ? 'Satyanarayana Super Admin' : 'Verified Shopper';
      }
    }

    const defaultAvatar = resolvedRole === 'seller'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
      : resolvedRole === 'admin'
      ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=300'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300';

    const result = await dispatch(
      googleLogin({
        name,
        email,
        role: resolvedRole,
        avatar: defaultAvatar
      })
    );

    if (!result.error) {
      const userRole = result.payload?.user?.role || resolvedRole;
      if (userRole === 'seller') navigate('/seller/dashboard');
      else if (userRole === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      const result = await dispatch(
        googleLogin({
          credential: credentialResponse.credential,
          role: roleInput
        })
      );
      if (!result.error) {
        const userRole = result.payload?.user?.role || roleInput;
        if (userRole === 'seller') navigate('/seller/dashboard');
        else if (userRole === 'admin') navigate('/admin/dashboard');
        else navigate('/');
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center bg-white">
        {/* Header */}
        <div className="space-y-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 shadow-md shadow-indigo-600/20 hover:scale-105 transition-transform"
          >
            <ShoppingBag className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to ShopSphere</h1>
          <p className="text-xs text-slate-500">Select your account role and sign in with Google</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-semibold flex items-center justify-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Role Toggle Selector */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-bold text-slate-700">1. Select Account Role:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRoleInput('customer')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                roleInput === 'customer'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs ring-2 ring-indigo-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User size={16} /> Buyer Account
            </button>

            <button
              type="button"
              onClick={() => setRoleInput('seller')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                roleInput === 'seller'
                  ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-xs ring-2 ring-violet-500/20'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Store size={16} /> Seller Merchant
            </button>
          </div>
        </div>

        {/* Primary Google Login OAuth Button */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-slate-700 text-left">2. Continue with Google:</label>
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Google Login Failed')}
              useOneTap
              shape="pill"
              theme="outline"
              size="large"
              width="320"
              text="continue_with"
            />
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">or sign in with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Clean Email Sign In Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name (Optional)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Satyanarayana"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
              />
              <User className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="satyanarayanag904@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
              />
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In Now'}
          </button>
        </form>

        <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium border-t border-slate-100">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Google Encrypted One-Tap Authentication</span>
        </div>
      </div>
    </div>
  );
}
