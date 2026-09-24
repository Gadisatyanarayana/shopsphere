import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Flame, Award, ShieldCheck, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import { ProductSkeleton } from '../components/Skeleton';
import { fetchProducts, fetchCategories } from '../store/productSlice';

export default function Home() {
  const [toastMessage, setToastMessage] = useState('');
  const dispatch = useDispatch();

  const { products, categories, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const flashDeals = products.filter((p) => p.discountPrice > 0).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Sparkles size={14} /> Next-Generation E-Commerce Marketplace
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Upgrade Your Tech & <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-600 bg-clip-text text-transparent">Lifestyle Today</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Discover curated high-performance electronics, trendy fashion apparel, smart home appliances, and fitness gear with instant express shipping.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/shop"
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
              >
                Explore Collection <ArrowRight size={16} />
              </Link>
              <Link
                to="/categories"
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-2xl transition-all border border-slate-200 shadow-xs"
              >
                Browse Categories
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white aspect-16/10">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200"
                alt="ShopSphere Hero"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Popular Categories</h2>
            <p className="text-xs text-slate-500">Explore items tailored to your interest</p>
          </div>
          <Link to="/categories" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white aspect-4/3 border border-slate-200 flex flex-col justify-end p-4 shadow-xs hover:shadow-md transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=800'; }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{cat.name}</h3>
                <p className="text-[11px] text-slate-200 line-clamp-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
              <Award size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Featured Products</h2>
              <p className="text-xs text-slate-500">Top picks selected by our editors</p>
            </div>
          </div>
          <Link to="/shop?isFeatured=true" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            See More <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : (featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)).map((product) => (
                <ProductCard key={product._id} product={product} onToast={setToastMessage} />
              ))}
        </div>
      </section>

      {/* Flash Deals Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 border border-indigo-200 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              FLASH SALE ENDS SOON
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Save Up to 40% OFF Premium Audio & Accessories</h3>
            <p className="text-xs text-slate-200">Grab instant discounts before stock runs out.</p>
          </div>
          <Link
            to="/shop"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            Claim Deals Now
          </Link>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200">
              <Zap size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Latest Arrivals</h2>
              <p className="text-xs text-slate-500">Discover brand new items added daily</p>
            </div>
          </div>
          <Link to="/shop" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            Shop All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.map((product) => (
                <ProductCard key={product._id} product={product} onToast={setToastMessage} />
              ))}
        </div>
      </section>
    </div>
  );
}
