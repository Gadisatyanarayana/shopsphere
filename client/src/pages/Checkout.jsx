import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import Toast from '../components/Toast';
import { fetchCart } from '../store/cartSlice';
import { createOrder } from '../store/orderSlice';
import API from '../services/api';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const couponCode = location.state?.couponCode || '';

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || {};

  const [shippingAddress, setShippingAddress] = useState({
    street: defaultAddr.street || '',
    city: defaultAddr.city || '',
    state: defaultAddr.state || '',
    postalCode: defaultAddr.postalCode || '',
    country: defaultAddr.country || 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shippingFee + tax;

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const processCheckoutOrder = async (orderPayload) => {
    try {
      const res = await dispatch(createOrder(orderPayload)).unwrap();
      setToastMessage('Order placed successfully!');
      setTimeout(() => {
        navigate(`/orders/${res._id}`);
      }, 1500);
    } catch (err) {
      setErrorMessage(err || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAndOrderSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      setErrorMessage('Please complete all shipping address fields');
      setLoading(false);
      return;
    }

    const orderPayload = {
      items: items.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
        name: i.product.name,
        price: i.price,
        image: i.product.images?.[0] || ''
      })),
      shippingAddress,
      paymentMethod,
      couponCode
    };

    if (paymentMethod === 'COD') {
      await processCheckoutOrder(orderPayload);
      return;
    }

    // Razorpay or Dev Mock Payment Workflow
    try {
      const paymentRes = await API.post('/payment/create-order', {
        amount: total,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`
      });

      const paymentOrder = paymentRes.data;

      // Handle Dev Mock Payment Mode
      if (paymentOrder.isMock || !window.Razorpay) {
        console.log('[Dev Mock Payment] Executing safe dev payment verification...');
        const verifyRes = await API.post('/payment/verify', {
          razorpay_order_id: paymentOrder.id,
          razorpay_payment_id: `pay_dev_${Date.now()}`,
          isMock: true
        });

        if (verifyRes.success || verifyRes.data.verified) {
          orderPayload.paymentMethod = 'DevMock';
          await processCheckoutOrder(orderPayload);
        }
        return;
      }

      // Real Razorpay Window Checkout
      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'ShopSphere E-Commerce',
        description: 'Order Payment Transaction',
        order_id: paymentOrder.id,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#4f46e5'
        },
        handler: async function (response) {
          try {
            const verifyRes = await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              isMock: false
            });

            if (verifyRes.data.verified) {
              await processCheckoutOrder(orderPayload);
            }
          } catch (err) {
            setErrorMessage('Payment verification failed');
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      setErrorMessage(err.message || 'Payment processing error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">Complete your shipping address and secure payment</p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} /> {errorMessage}
        </div>
      )}

      <form onSubmit={handlePaymentAndOrderSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping & Payment Method */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Truck className="text-indigo-600" size={20} /> 1. Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="House/Flat No, Street, Landmark"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Postal PIN Code</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  placeholder="PIN Code"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="text-indigo-600" size={20} /> 2. Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'Razorpay' ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  className="hidden"
                />
                <ShieldCheck className="text-indigo-600" size={24} />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Razorpay Online Payment</h4>
                  <p className="text-[10px] text-slate-500">Cards, UPI, NetBanking (Dev Mock Fallback Enabled)</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="hidden"
                />
                <Truck className="text-emerald-600" size={24} />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</h4>
                  <p className="text-[10px] text-slate-500">Pay cash upon delivery at your doorstep</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Order Verification</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i._id} className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-medium line-clamp-1 flex-1 pr-2">{i.product.name} (x{i.quantity})</span>
                  <span className="font-bold text-slate-900 shrink-0">₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-slate-900">{shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span className="font-bold text-slate-900">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100 text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-indigo-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:bg-slate-200 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                `Place Order & Pay ₹${total.toLocaleString('en-IN')}`
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
