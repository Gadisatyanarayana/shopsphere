import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react';
import { fetchMyOrders } from '../store/orderSlice';

export default function Orders() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Please Log In</h2>
        <p className="text-xs text-slate-500">Log in to track your order history.</p>
        <Link to="/login" className="inline-block bg-indigo-600 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs">
          Log In
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">DELIVERED</span>;
      case 'shipped':
        return <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">SHIPPED</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">CANCELLED</span>;
      default:
        return <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">{status || 'CONFIRMED'}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Package className="text-indigo-600" /> My Orders History
        </h1>
        <p className="text-xs text-slate-500 mt-1">Track and manage your order shipments</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs text-slate-500 font-mono font-bold">ORDER #{order._id.slice(-8).toUpperCase()}</span>
                  <p className="text-[11px] text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.orderStatus)}
                  <span className="text-sm font-extrabold text-slate-900">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[150px]">{item.name}</h4>
                      <p className="text-[10px] text-slate-500">Qty: {item.quantity} | ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to={`/orders/${order._id}`}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View Order Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl space-y-4 border border-slate-200 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
            <Package size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Orders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">You haven't placed any orders yet.</p>
          <Link to="/shop" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
