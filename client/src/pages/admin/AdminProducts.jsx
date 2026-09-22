import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Star, ExternalLink } from 'lucide-react';
import Toast from '../../components/Toast';
import Pagination from '../../components/Pagination';
import { fetchProducts } from '../../store/productSlice';
import API from '../../services/api';

export default function AdminProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [search, setSearch] = useState('');

  const { products, page, pages, total, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ keyword: search, page: 1, limit: 10 }));
  }, [dispatch, search]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await API.delete(`/products/${id}`);
        setToastMessage(`Product "${name}" deleted!`);
        dispatch(fetchProducts({ page: 1, limit: 10 }));
      } catch (err) {
        setToastMessage(err.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Product Catalog Governance</h1>
          <p className="text-xs text-slate-500 mt-1">Create, edit, and control pricing/stock of all products</p>
        </div>

        <Link
          to="/admin/products/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
        >
          <Plus size={16} /> Add New Product
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search product name, brand, tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 focus:bg-white"
        />
        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Brand</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Stock</th>
                <th className="py-4 px-4">Rating</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((prod) => (
                <tr key={prod._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={prod.images?.[0]} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                      <div>
                        <Link to={`/product/${prod.slug}`} className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1">
                          {prod.name}
                        </Link>
                        <span className="text-[10px] text-slate-500">{prod.category?.name || 'Uncategorized'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{prod.brand}</td>
                  <td className="py-4 px-4 font-bold text-slate-900">₹{(prod.discountPrice > 0 ? prod.discountPrice : prod.price).toLocaleString('en-IN')}</td>
                  <td className="py-4 px-4">
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      prod.stock > 5 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}>
                      {prod.stock} Units
                    </span>
                  </td>
                  <td className="py-4 px-4 text-amber-500 font-semibold flex items-center gap-1">
                    <Star size={12} className="fill-amber-400" /> {prod.ratings} ({prod.numReviews})
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${prod._id}`, { state: { product: prod } })}
                      className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-colors"
                      title="Edit Product"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id, prod.name)}
                      className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors"
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
