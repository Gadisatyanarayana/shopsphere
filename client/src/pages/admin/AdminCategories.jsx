import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, FolderTree } from 'lucide-react';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { fetchCategories } from '../../store/productSlice';
import API from '../../services/api';

export default function AdminCategories() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await API.post('/categories', { name, description, image });
      setToastMessage(`Category "${name}" created!`);
      setModalOpen(false);
      setName('');
      setDescription('');
      setImage('');
      dispatch(fetchCategories());
    } catch (err) {
      setToastMessage(err.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id, catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      try {
        await API.delete(`/categories/${id}`);
        setToastMessage(`Category "${catName}" deleted!`);
        dispatch(fetchCategories());
      } catch (err) {
        setToastMessage(err.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Category Governance</h1>
          <p className="text-xs text-slate-500 mt-1">Organize products into platform departments</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-4">Slug</th>
              <th className="py-4 px-4">Description</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img src={cat.image} alt="" className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                    <span className="font-bold text-slate-900">{cat.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-indigo-600 font-mono font-semibold">{cat.slug}</td>
                <td className="py-4 px-4 text-slate-600 max-w-xs truncate">{cat.description}</td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => handleDeleteCategory(cat._id, cat.name)}
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Department Category">
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Gaming Gear"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Brief description of this department..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL</label>
            <input
              type="text"
              required
              placeholder="https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl cursor-pointer shadow-sm"
          >
            Create Category
          </button>
        </form>
      </Modal>
    </div>
  );
}
