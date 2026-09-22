import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { logoutUser } from '../store/authSlice';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = wishlist?.products?.length || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white text-xs py-1.5 px-4 text-center font-medium shadow-xs">
        ✨ Mega Tech Festival Sale! Use Code <span className="font-extrabold text-amber-300">WELCOME10</span> for 10% OFF
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-900 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span>Shop<span className="text-indigo-600">Sphere</span></span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 focus:bg-white focus:border-indigo-600 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all placeholder-slate-400 font-medium"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <button type="submit" className="hidden">Search</button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-indigo-600 transition-colors">Shop</Link>
            <Link to="/categories" className="hover:text-indigo-600 transition-colors">Categories</Link>
          </nav>

          {/* Action Icons & Profile */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-indigo-600 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-indigo-600 transition-colors"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth Links */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 text-slate-800 bg-white"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                  />
                  <span className="hidden sm:inline text-xs font-bold max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 border border-slate-200 z-50 divide-y divide-slate-100">
                    <div className="px-4 py-2.5">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="inline-block mt-1 bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          SUPER ADMIN
                        </span>
                      )}
                      {user.role === 'seller' && (
                        <span className="inline-block mt-1 bg-violet-100 text-violet-800 border border-violet-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                          VERIFIED SELLER
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <User className="w-4 h-4 text-slate-500" /> Profile & Addresses
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <Package className="w-4 h-4 text-slate-500" /> My Orders
                      </Link>

                      {(user.role === 'seller' || user.role === 'admin') && (
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-violet-700 hover:bg-violet-50 font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4 text-violet-600" /> Seller Merchant Portal
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" /> Super Admin Governance
                        </Link>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 space-y-3 bg-white px-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 text-slate-900 text-xs rounded-xl pl-10 pr-4 py-2 outline-none"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </form>
            <div className="flex flex-col gap-2 pt-2 text-xs font-bold text-slate-800">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-600 py-1">Home</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-600 py-1">Shop All Products</Link>
              <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-600 py-1">Categories</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
