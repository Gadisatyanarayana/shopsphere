import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, RotateCcw, Search, Grid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Toast from '../components/Toast';
import { ProductSkeleton } from '../components/Skeleton';
import { fetchProducts, fetchCategories } from '../store/productSlice';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const dispatch = useDispatch();
  const { products, categories, page, pages, total, loading } = useSelector((state) => state.products);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const sort = searchParams.get('sort') || 'newest';
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(
      fetchProducts({
        keyword,
        category,
        brand,
        minPrice,
        maxPrice,
        rating,
        sort,
        page: currentPage,
        limit: 12
      })
    );
  }, [dispatch, keyword, category, brand, minPrice, maxPrice, rating, sort, currentPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Product Collection</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <span className="text-indigo-600 font-bold">{total}</span> items matching your search criteria
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-white border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-indigo-600 shadow-xs"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-2 bg-white text-slate-700 border border-slate-200 text-xs px-3 py-2 rounded-xl shadow-xs"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className={`space-y-6 md:block ${showMobileFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-indigo-600" /> Filter Products
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Categories</label>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors font-semibold ${
                    !category ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors font-semibold ${
                      category === cat.slug ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-2.5 py-1.5 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Minimum Rating</label>
              <div className="space-y-1">
                {[4, 3, 2, 1].map((r) => (
                  <button
                    key={r}
                    onClick={() => updateParam('rating', rating === String(r) ? '' : String(r))}
                    className={`w-full text-left text-xs px-3 py-1.5 rounded-xl transition-colors font-semibold flex items-center gap-1.5 ${
                      rating === String(r) ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{r} Stars & Above</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} onToast={setToastMessage} />
                ))}
              </div>

              <Pagination
                page={page}
                pages={pages}
                onPageChange={(p) => updateParam('page', p)}
              />
            </>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl space-y-4 border border-slate-200 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Products Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching your search or active filter options.
              </p>
              <button
                onClick={resetFilters}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
