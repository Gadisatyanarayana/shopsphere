import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Toast from '../../components/Toast';
import { fetchCategories } from '../../store/productSlice';
import API from '../../services/api';

export default function ProductForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();

  const isEdit = !!id;
  const existingProd = location.state?.product;

  const { categories } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: existingProd?.name || '',
    description: existingProd?.description || '',
    price: existingProd?.price || '',
    discountPrice: existingProd?.discountPrice || 0,
    category: existingProd?.category?._id || existingProd?.category || '',
    brand: existingProd?.brand || '',
    stock: existingProd?.stock || 10,
    isFeatured: existingProd?.isFeatured || false,
    images: existingProd?.images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
    tags: existingProd?.tags?.join(', ') || ''
  });

  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    if (isEdit && !existingProd) {
      API.get(`/products/${id}`).then((res) => {
        const p = res.data.product;
        setFormData({
          name: p.name,
          description: p.description,
          price: p.price,
          discountPrice: p.discountPrice,
          category: p.category?._id || p.category,
          brand: p.brand,
          stock: p.stock,
          isFeatured: p.isFeatured,
          images: p.images,
          tags: p.tags?.join(', ') || ''
        });
      });
    }
  }, [dispatch, isEdit, id, existingProd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice),
      stock: Number(formData.stock),
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
    };

    try {
      if (isEdit) {
        await API.put(`/products/${id}`, payload);
        setToastMessage('Product updated successfully!');
      } else {
        await API.post('/products', payload);
        setToastMessage('Product created successfully!');
      }
      setTimeout(() => navigate('/admin/products'), 1000);
    } catch (err) {
      setToastMessage(err.message || 'Failed to save product');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 glass-panel text-slate-400 hover:text-white rounded-xl">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white">{isEdit ? 'Edit Product Details' : 'Create New Product'}</h1>
          <p className="text-xs text-slate-400">Fill in product information for marketplace buyers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Name</label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 outline-none focus:border-indigo-500"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Regular Price (₹)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Discount Sale Price (₹)</label>
            <input
              type="number"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Available Stock Units</label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma Separated)</label>
            <input
              type="text"
              placeholder="audio, wireless, bluetooth"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Product Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
            <input
              type="text"
              required
              value={formData.images[0] || ''}
              onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-white cursor-pointer">
              Feature this product on homepage hero & top section
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            <Save size={16} /> Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
