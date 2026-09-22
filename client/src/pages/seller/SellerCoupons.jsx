import React, { useState } from 'react';
import { Ticket, Plus, Tag, Calendar, Percent, Trash2 } from 'lucide-react';

export default function SellerCoupons() {
  const [coupons, setCoupons] = useState([
    {
      id: '1',
      code: 'SELLER20',
      discountType: 'percentage',
      discountAmount: 20,
      minPurchase: 100,
      expiryDate: '2026-12-31',
      status: 'Active'
    },
    {
      id: '2',
      code: 'FLAT50',
      discountType: 'fixed',
      discountAmount: 50,
      minPurchase: 300,
      expiryDate: '2026-10-15',
      status: 'Active'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: '',
    minPurchase: '',
    expiryDate: ''
  });

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountAmount) return;

    const newCoupon = {
      id: Date.now().toString(),
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountAmount: Number(formData.discountAmount),
      minPurchase: Number(formData.minPurchase) || 0,
      expiryDate: formData.expiryDate || '2026-12-31',
      status: 'Active'
    };

    setCoupons([newCoupon, ...coupons]);
    setShowModal(false);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountAmount: '',
      minPurchase: '',
      expiryDate: ''
    });
  };

  const handleDelete = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Ticket className="text-violet-400" size={26} /> Seller Promo Coupons
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Create custom store discount vouchers and promo codes to boost seller sales.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all self-start md:self-auto"
        >
          <Plus size={16} /> Create Promo Voucher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden group hover:border-violet-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-violet-400" />
                <span className="font-mono font-bold text-lg text-white tracking-wider">
                  {coupon.code}
                </span>
              </div>
              <button
                onClick={() => handleDelete(coupon.id)}
                className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                title="Delete Coupon"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Discount Value:</span>
                <span className="font-bold text-emerald-400">
                  {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `$${coupon.discountAmount} OFF`}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Min Order Spend:</span>
                <span className="font-semibold text-slate-200">${coupon.minPurchase}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Expires On:</span>
                <span className="font-mono text-slate-300">{coupon.expiryDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Seller Voucher</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE25"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-violet-500 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-violet-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount Value</label>
                  <input
                    type="number"
                    placeholder="e.g. 20"
                    value={formData.discountAmount}
                    onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-violet-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
