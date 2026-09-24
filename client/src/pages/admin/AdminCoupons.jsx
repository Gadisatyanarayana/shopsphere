import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Ticket, Check } from 'lucide-react';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import API from '../../services/api';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minimumPurchase, setMinimumPurchase] = useState(999);
  const [expiryDate, setExpiryDate] = useState('2027-12-31');
  const [usageLimit, setUsageLimit] = useState(100);

  const loadCoupons = async () => {
    try {
      const res = await API.get('/coupons');
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await API.post('/coupons', {
        code,
        discountType,
        discountValue: Number(discountValue),
        minimumPurchase: Number(minimumPurchase),
        expiryDate,
        usageLimit: Number(usageLimit)
      });
      setToastMessage(`Coupon "${code.toUpperCase()}" created!`);
      setModalOpen(false);
      setCode('');
      loadCoupons();
    } catch (err) {
      setToastMessage(err.message || 'Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (id, couponCode) => {
    if (window.confirm(`Delete coupon "${couponCode}"?`)) {
      try {
        await API.delete(`/coupons/${id}`);
        setToastMessage(`Coupon "${couponCode}" deleted!`);
        loadCoupons();
      } catch (err) {
        setToastMessage(err.message || 'Failed to delete coupon');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Promotional Coupons</h1>
          <p className="text-xs text-slate-500 mt-1">Generate discount vouchers and set usage limits</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
        >
          <Plus size={16} /> Generate Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6">Coupon Code</th>
              <th className="py-4 px-4">Discount</th>
              <th className="py-4 px-4">Min Spend</th>
              <th className="py-4 px-4">Usage Count</th>
              <th className="py-4 px-4">Expiry Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((coup) => (
              <tr key={coup._id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-mono font-bold text-amber-600 flex items-center gap-2">
                  <Ticket size={16} className="text-amber-600" /> {coup.code}
                </td>
                <td className="py-4 px-4 font-bold text-slate-900">
                  {coup.discountType === 'percentage' ? `${coup.discountValue}% OFF` : `₹${coup.discountValue} FLAT`}
                </td>
                <td className="py-4 px-4 text-slate-700 font-semibold">₹{coup.minimumPurchase}</td>
                <td className="py-4 px-4 text-slate-500">{coup.usedCount} / {coup.usageLimit}</td>
                <td className="py-4 px-4 text-slate-500">{new Date(coup.expiryDate).toLocaleDateString()}</td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => handleDeleteCoupon(coup._id, coup.code)}
                    className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Generate New Promo Coupon">
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Coupon Code</label>
            <input
              type="text"
              required
              placeholder="e.g. FESTIVE30"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 uppercase rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white font-medium"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Discount Value</label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Purchase (₹)</label>
              <input
                type="number"
                required
                value={minimumPurchase}
                onChange={(e) => setMinimumPurchase(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Usage Limit</label>
              <input
                type="number"
                required
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
            <input
              type="date"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl cursor-pointer shadow-xs"
          >
            Create Coupon
          </button>
        </form>
      </Modal>
    </div>
  );
}
