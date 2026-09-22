import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Truck, CheckCircle2, Clock, MapPin, Printer, AlertCircle } from 'lucide-react';
import Toast from '../components/Toast';
import { fetchOrderById } from '../store/orderSlice';
import API from '../services/api';

export default function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [toastMessage, setToastMessage] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const { currentOrder } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  if (!currentOrder) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await API.put(`/orders/${currentOrder._id}/cancel`);
      setToastMessage('Order cancelled successfully!');
      dispatch(fetchOrderById(id));
    } catch (err) {
      setToastMessage(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStepIdx = steps.indexOf(currentOrder.orderStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-bold">ORDER DETAILS</span>
          <h1 className="text-2xl font-extrabold text-white">#{currentOrder._id}</h1>
          <p className="text-xs text-slate-400">Placed on {new Date(currentOrder.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-3">
          {['pending', 'confirmed'].includes(currentOrder.orderStatus) && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Cancel Order
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="glass-panel text-slate-300 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <Printer size={14} /> Print Invoice
          </button>
        </div>
      </div>

      {/* Order Status Timeline Tracker */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Shipment Tracking Status</h3>
        <div className="flex items-center justify-between relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            return (
              <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span className={`text-[10px] uppercase font-bold ${isCompleted ? 'text-indigo-400' : 'text-slate-600'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Purchased Items</h3>
            <div className="space-y-3">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-900" />
                    <div>
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <p className="text-slate-400">Qty: {item.quantity} x ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <span className="font-bold text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-400" /> Delivery Address
            </h3>
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">{currentOrder.user?.name}</p>
              <p>{currentOrder.shippingAddress?.street}</p>
              <p>{currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} - {currentOrder.shippingAddress?.postalCode}</p>
              <p>{currentOrder.shippingAddress?.country}</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Payment Summary</h3>
            <div className="flex justify-between text-slate-400">
              <span>Payment Method</span>
              <span className="font-semibold text-white">{currentOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payment Status</span>
              <span className="font-bold text-emerald-400 uppercase">{currentOrder.paymentStatus}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-semibold text-white">₹{currentOrder.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Discount</span>
              <span className="font-semibold text-emerald-400">-₹{currentOrder.discount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-extrabold text-white">
              <span>Total Paid</span>
              <span className="text-indigo-400">₹{currentOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
