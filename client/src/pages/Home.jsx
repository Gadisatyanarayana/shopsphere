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
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950/60 via-slate-950 to-slate-950 py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles size={14} /> Next-Generation E-Commerce Marketplace
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Upgrade Your Tech & <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300 bg-clip-text text-transparent">Lifestyle Today</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Discover curated high-performance electronics, trendy fashion apparel, smart home appliances, and fitness gear with instant express shipping.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/shop"
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                Explore Collection <ArrowRight size={16} />
              </Link>
              <Link
                to="/categories"
                className="glass-panel hover:bg-slate-800 text-slate-200 font-semibold text-sm px-6 py-3.5 rounded-2xl transition-all border border-slate-700"
              >
                Browse Categories
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl glass-card aspect-16/10">
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
            <h2 className="text-2xl font-extrabold text-white">Popular Categories</h2>
            <p className="text-xs text-slate-400">Explore items tailored to your interest</p>
          </div>
          <Link to="/categories" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden glass-card aspect-4/3 border border-slate-800 flex flex-col justify-end p-4"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{cat.name}</h3>
                <p className="text-[11px] text-slate-300 line-clamp-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">Featured Products</h2>
              <p className="text-xs text-slate-400">Top picks selected by our editors</p>
            </div>
          </div>
          <Link to="/shop?isFeatured=true" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
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
        <div className="glass-panel rounded-3xl p-8 border border-indigo-500/30 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              FLASH SALE ENDS SOON
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Save Up to 40% OFF Premium Audio & Accessories</h3>
            <p className="text-xs text-slate-300">Grab instant discounts before stock runs out.</p>
          </div>
          <Link
            to="/shop"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            Claim Deals Now
          </Link>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Zap size={18} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">Latest Arrivals</h2>
              <p className="text-xs text-slate-400">Discover brand new items added daily</p>
            </div>
          </div>
          <Link to="/shop" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
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
