import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 mt-20">
      {/* Feature Value Props */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Express Shipping</h4>
              <p className="text-[11px] text-slate-500">Free delivery on orders over ₹1,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">100% Secure Payments</h4>
              <p className="text-[11px] text-slate-500">Razorpay, UPI & SSL Encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <RotateCcw size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">7-Day Easy Returns</h4>
              <p className="text-[11px] text-slate-500">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-3 rounded-xl bg-violet-100 text-violet-600">
              <Headphones size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">24/7 Dedicated Support</h4>
              <p className="text-[11px] text-slate-500">Instant customer assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-slate-900">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span>Shop<span className="text-indigo-600">Sphere</span></span>
          </Link>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-medium">
            ShopSphere is a full-stack, production-grade e-commerce marketplace powered by modern MERN stack architecture. Designed for high performance, accessibility, and security.
          </p>

          <form onSubmit={handleSubscribe} className="pt-2">
            <label className="block text-xs font-bold text-slate-800 mb-2">Subscribe to Insider Deals & Updates</label>
            {subscribed ? (
              <p className="text-xs font-bold text-emerald-600">🎉 Thank you for subscribing to ShopSphere!</p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-100 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-indigo-600 focus:bg-white flex-1 text-slate-900 font-medium"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  Join
                </button>
              </div>
            )}
          </form>
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">Marketplace</h4>
          <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
            <li><Link to="/shop" className="hover:text-indigo-600 transition-colors">All Products</Link></li>
            <li><Link to="/categories" className="hover:text-indigo-600 transition-colors">Category Directory</Link></li>
            <li><Link to="/shop?isFeatured=true" className="hover:text-indigo-600 transition-colors">Featured Electronics</Link></li>
            <li><Link to="/shop?category=fashion" className="hover:text-indigo-600 transition-colors">Fashion Trends</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">Customer Account</h4>
          <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
            <li><Link to="/profile" className="hover:text-indigo-600 transition-colors">User Profile</Link></li>
            <li><Link to="/orders" className="hover:text-indigo-600 transition-colors">Order Tracking</Link></li>
            <li><Link to="/wishlist" className="hover:text-indigo-600 transition-colors">Saved Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-indigo-600 transition-colors">Shopping Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">Support & Legal</h4>
          <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
            <li><a href="#docs" className="hover:text-indigo-600 transition-colors">API Documentation</a></li>
            <li><a href="#privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
            <li><span className="text-slate-400 font-normal">ShopSphere 2026</span></li>
          </ul>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-slate-100 py-6 text-center text-xs font-medium text-slate-500 bg-slate-50/50">
        <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved. Built with React, Node.js, Express & MongoDB.</p>
      </div>
    </footer>
  );
}
