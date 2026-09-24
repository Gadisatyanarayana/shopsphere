import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderTree } from 'lucide-react';
import { fetchCategories } from '../store/productSlice';

export default function Categories() {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <FolderTree className="text-indigo-600" /> Category Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1">Browse products grouped by specialized departments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/shop?category=${cat.slug}`}
            className="group relative rounded-3xl overflow-hidden bg-white aspect-16/9 border border-slate-200 p-8 flex flex-col justify-end shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src={cat.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=800'}
              alt={cat.name}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=800'; }}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            <div className="relative z-10 space-y-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">DEPARTMENT</span>
              <h2 className="text-2xl font-extrabold text-white group-hover:text-indigo-200 transition-colors">
                {cat.name}
              </h2>
              <p className="text-xs text-slate-200 max-w-md line-clamp-2 leading-relaxed font-medium">
                {cat.description}
              </p>
              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                Explore Products <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
