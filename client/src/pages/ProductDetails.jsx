import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Star, Check } from 'lucide-react';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { fetchProductBySlug } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import API from '../services/api';

export default function ProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  const { currentProduct, detailLoading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (currentProduct?._id) {
      API.get(`/products/${currentProduct._id}/related`)
        .then((res) => setRelatedProducts(res.data.products || []))
        .catch(console.error);

      API.get(`/reviews/product/${currentProduct._id}`)
        .then((res) => setReviews(res.data.reviews || []))
        .catch(console.error);
    }
  }, [currentProduct]);

  if (detailLoading || !currentProduct) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isWishlisted = wishlist?.products?.some((p) => p._id === currentProduct._id || p === currentProduct._id);
  const activePrice = currentProduct.discountPrice > 0 ? currentProduct.discountPrice : currentProduct.price;
  const hasDiscount = currentProduct.discountPrice > 0 && currentProduct.discountPrice < currentProduct.price;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: currentProduct._id, quantity }));
    setToastMessage(`Added ${quantity} "${currentProduct.name}" to cart!`);
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(toggleWishlist(currentProduct._id));
    setToastMessage(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await dispatch(addToCart({ productId: currentProduct._id, quantity }));
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      await API.post('/reviews', {
        productId: currentProduct._id,
        rating: newRating,
        comment: newComment
      });
      setToastMessage('Review submitted successfully!');
      setReviewModalOpen(false);
      setNewComment('');
      const res = await API.get(`/reviews/product/${currentProduct._id}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      setReviewError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 flex items-center gap-2">
        <Link to="/" className="hover:text-white">Home</Link> /
        <Link to="/shop" className="hover:text-white">Shop</Link> /
        <span className="text-indigo-400 font-semibold">{currentProduct.name}</span>
      </div>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-4/3 rounded-3xl overflow-hidden glass-card border border-slate-800 bg-slate-950">
            <img
              src={currentProduct.images[selectedImage] || currentProduct.images[0]}
              alt={currentProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          {currentProduct.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {currentProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden glass-card border transition-all shrink-0 ${
                    selectedImage === idx ? 'border-indigo-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <span className="bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">{currentProduct.brand}</span>
              <span>{currentProduct.category?.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{currentProduct.name}</h1>
            <RatingStars rating={currentProduct.ratings} numReviews={currentProduct.numReviews} size={16} />
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 p-4 rounded-2xl glass-card border border-slate-800">
            <span className="text-3xl font-extrabold text-white">₹{activePrice.toLocaleString('en-IN')}</span>
            {hasDiscount && (
              <span className="text-sm text-slate-500 line-through">₹{currentProduct.price.toLocaleString('en-IN')}</span>
            )}
            <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${
              currentProduct.stock > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {currentProduct.stock > 0 ? `In Stock (${currentProduct.stock})` : 'Out of Stock'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{currentProduct.description}</p>

          {/* Quantity & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-300">Quantity:</span>
              <div className="flex items-center glass-panel rounded-xl border border-slate-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-300 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentProduct.stock, quantity + 1))}
                  className="px-3 py-1.5 text-slate-300 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={currentProduct.stock <= 0}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-extrabold py-3.5 rounded-2xl transition-all cursor-pointer"
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={currentProduct.stock <= 0}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:bg-slate-800 text-white text-xs font-extrabold py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
              >
                ⚡ Buy Now & Checkout
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-center">
            <div className="p-3 rounded-xl glass-card text-[11px] text-slate-400 font-medium">
              <Truck size={16} className="mx-auto mb-1 text-indigo-400" /> Express Shipping
            </div>
            <div className="p-3 rounded-xl glass-card text-[11px] text-slate-400 font-medium">
              <ShieldCheck size={16} className="mx-auto mb-1 text-emerald-400" /> 1-Yr Warranty
            </div>
            <div className="p-3 rounded-xl glass-card text-[11px] text-slate-400 font-medium">
              <RefreshCw size={16} className="mx-auto mb-1 text-amber-400" /> 7-Day Return
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {currentProduct.specifications?.length > 0 && (
        <section className="space-y-4 glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="text-lg font-bold text-white">Technical Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentProduct.specifications.map((spec, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">{spec.key}</span>
                <span className="text-white font-semibold">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-white">Customer Reviews</h3>
            <p className="text-xs text-slate-400">Verified buyer ratings and experiences</p>
          </div>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
          >
            Write a Review
          </button>
        </div>

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-white">{rev.user?.name || 'Verified Buyer'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <RatingStars rating={rev.rating} size={14} />
                <p className="text-xs text-slate-300">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No reviews yet for this product. Be the first to review!</p>
          )}
        </div>
      </section>

      {/* Write Review Modal */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Write a Customer Review">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          {reviewError && <p className="text-xs font-semibold text-rose-400">{reviewError}</p>}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Rating</label>
            <RatingStars rating={newRating} interactive={true} onRatingChange={setNewRating} size={24} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Review Comment</label>
            <textarea
              required
              rows={4}
              placeholder="Share details of your experience with this product..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 outline-none focus:border-indigo-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 rounded-xl cursor-pointer"
          >
            Submit Review
          </button>
        </form>
      </Modal>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-extrabold text-white">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} onToast={setToastMessage} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
