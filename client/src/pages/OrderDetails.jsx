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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-mono text-indigo-600 font-bold">ORDER DETAILS</span>
          <h1 className="text-2xl font-extrabold text-slate-900">#{currentOrder._id}</h1>
          <p className="text-xs text-slate-500">Placed on {new Date(currentOrder.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-3">
          {['pending', 'confirmed'].includes(currentOrder.orderStatus) && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Cancel Order
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <Printer size={14} /> Print Invoice
          </button>
        </div>
      </div>

      {/* Order Status Timeline Tracker */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Shipment Tracking Status</h3>
        <div className="flex items-center justify-between relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            return (
              <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 border border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span className={`text-[10px] uppercase font-bold ${isCompleted ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Package size={16} className="text-indigo-600" /> Purchased Items ({currentOrder.items?.length || 0})
            </h3>

            <div className="divide-y divide-slate-100">
              {currentOrder.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-200" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <p className="text-[10px] text-slate-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping Address & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-600" /> Delivery Address
            </h3>
            <p className="text-xs text-slate-700 font-medium">{currentOrder.shippingAddress?.street}</p>
            <p className="text-xs text-slate-500">
              {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} - {currentOrder.shippingAddress?.postalCode}
            </p>
            <p className="text-xs text-slate-500 font-semibold">{currentOrder.shippingAddress?.country || 'India'}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Payment Summary</h3>
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{currentOrder.total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Payment Method</span>
              <span className="font-bold text-indigo-600">{currentOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Payment Status</span>
              <span className="font-bold text-emerald-600 uppercase">{currentOrder.paymentStatus}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-100 text-sm font-extrabold text-slate-900">
              <span>Grand Total</span>
              <span className="text-indigo-600">₹{currentOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
