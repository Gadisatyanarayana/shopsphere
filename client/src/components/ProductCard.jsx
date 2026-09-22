import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag } from 'lucide-react';
import RatingStars from './RatingStars';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';

export default function ProductCard({ product, onToast }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlist?.products?.some((p) => p._id === product._id || p === product._id);

  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    if (onToast) onToast(`Added "${product.name}" to cart!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist(product._id));
    if (onToast) onToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300 relative">
      <div>
        {/* Image & Badges Container */}
        <div className="relative aspect-4/3 overflow-hidden bg-slate-50">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              -{discountPercent}% OFF
            </span>
          )}

          {/* Featured Badge */}
          {product.isFeatured && !hasDiscount && (
            <span className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              FEATURED
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs transition-all duration-300 shadow-md ${
              isWishlisted ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-500 hover:bg-white'
            }`}
          >
            <Heart size={18} className={isWishlisted ? 'fill-rose-500' : ''} />
          </button>
        </div>

        {/* Details Container */}
        <div className="p-5">
          <div className="flex items-center justify-between text-xs text-indigo-600 font-bold mb-1.5">
            <span>{product.brand}</span>
            <span className="text-slate-500 font-medium">{product.category?.name || 'General'}</span>
          </div>

          <Link to={`/product/${product.slug || product._id}`}>
            <h3 className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>

          <RatingStars rating={product.ratings} numReviews={product.numReviews} size={14} />

          <p className="text-xs text-slate-500 line-clamp-2 my-2.5 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Price & Action Footer */}
      <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-slate-100 mt-auto bg-slate-50/50">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900">₹{activePrice.toLocaleString('en-IN')}</span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
            )}
          </div>
          <span className={`text-[10px] font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <ShoppingBag size={14} />
          Add
        </button>
      </div>
    </div>
  );
}
