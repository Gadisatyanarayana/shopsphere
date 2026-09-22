import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Star } from 'lucide-react';
import Toast from '../../components/Toast';
import Pagination from '../../components/Pagination';
import { fetchProducts } from '../../store/productSlice';
import API from '../../services/api';

export default function SellerProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [search, setSearch] = useState('');

  const { products, page, pages, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ keyword: search, page: 1, limit: 10 }));
  }, [dispatch, search]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove product "${name}" from your catalog?`)) {
      try {
        await API.delete(`/products/${id}`);
        setToastMessage(`Product "${name}" deleted successfully!`);
        dispatch(fetchProducts({ page: 1, limit: 10 }));
      } catch (err) {
        setToastMessage(err.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Seller Product Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">Add new items, update prices, discounts, and control stock availability</p>
        </div>

        <Link
          to="/seller/products/new"
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-600/30"
        >
          <Plus size={16} /> Add Product to Store
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search products by title, brand, tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-violet-500"
        />
        <Search className="absolute left-3 top-3 text-slate-500" size={16} />
      </div>

      {/* Products Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Brand</th>
                <th className="py-4 px-4">Regular Price</th>
                <th className="py-4 px-4">Sale Price</th>
                <th className="py-4 px-4">Stock Units</th>
                <th className="py-4 px-4">Rating</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((prod) => (
                <tr key={prod._id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={prod.images?.[0]} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800" />
                      <div>
                        <Link to={`/product/${prod.slug}`} className="font-bold text-white hover:text-violet-400 line-clamp-1">
                          {prod.name}
                        </Link>
                        <span className="text-[10px] text-slate-500">{prod.category?.name || 'General'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-300">{prod.brand}</td>
                  <td className="py-4 px-4 font-bold text-slate-400">₹{prod.price.toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4 font-bold text-emerald-400">
                    ₹{(prod.discountPrice > 0 ? prod.discountPrice : prod.price).toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      prod.stock > 5 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {prod.stock} Units
                    </span>
                  </td>
                  <td className="py-4 px-4 text-amber-400 font-semibold flex items-center gap-1">
                    <Star size={12} className="fill-amber-400" /> {prod.ratings} ({prod.numReviews})
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/seller/products/edit/${prod._id}`, { state: { product: prod } })}
                      className="p-2 glass-panel hover:bg-slate-800 text-violet-400 rounded-xl"
                      title="Edit Price, Discount & Details"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id, prod.name)}
                      className="p-2 glass-panel hover:bg-rose-500/20 text-rose-400 rounded-xl"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
