import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import Toast from '../components/Toast';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/cartSlice';
import API from '../services/api';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const { cart, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
    setToastMessage('Item removed from cart');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setToastMessage('Cart cleared');
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    try {
      const res = await API.post('/coupons/validate', {
        code: couponCode,
        cartAmount: subtotal
      });
      setAppliedCoupon(res.data.coupon);
      setToastMessage(`Coupon "${res.data.coupon.code}" applied!`);
    } catch (err) {
      setCouponError(err.message);
      setAppliedCoupon(null);
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const tax = Math.round((subtotal - discountAmount) * 0.05);
  const total = Math.max(0, subtotal - discountAmount + shippingFee + tax);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Please Log In</h2>
        <p className="text-xs text-slate-500">You need an active session to view your cart items.</p>
        <Link to="/login" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs">
          Log In Now
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">Explore our high performance products and add your favorite items.</p>
        <Link to="/shop" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-1">Review your selected items before checkout</p>
        </div>
        <button
          onClick={handleClearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
        >
          <Trash2 size={14} /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;
            return (
              <div key={item._id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                <img
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'}
                  alt={product.name}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'; }}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <Link to={`/product/${product.slug || product._id}`} className="text-sm font-bold text-slate-900 hover:text-indigo-600 line-clamp-1">
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-500">Unit Price: ₹{item.price.toLocaleString('en-IN')}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="px-2.5 py-1 text-slate-700 hover:text-slate-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-2.5 text-xs font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="px-2.5 py-1 text-slate-700 hover:text-slate-900 font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="text-sm font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>

                <button onClick={() => handleRemove(item._id)} className="text-slate-400 hover:text-rose-600 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Tag size={14} className="text-indigo-600" /> Apply Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 focus:bg-white uppercase flex-1"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] font-semibold text-rose-600">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <Check size={12} /> Coupon "{appliedCoupon.code}" active!
                </p>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-3 pt-2 text-xs border-t border-slate-100">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST Tax (5%)</span>
                <span className="font-semibold text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100 text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-indigo-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { couponCode: appliedCoupon?.code } })}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
