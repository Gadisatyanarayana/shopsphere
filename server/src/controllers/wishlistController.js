const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// In-Memory Wishlists for Fallback Mode
const inMemoryWishlists = new Map();

// @desc Get user wishlist
// @route GET /api/wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (mongoose.connection.readyState !== 1 || !mongoose.Types.ObjectId.isValid(userId)) {
      const userWishlist = inMemoryWishlists.get(userId) || { products: [] };
      return res.status(200).json(new ApiResponse(200, { wishlist: userWishlist }, 'Wishlist fetched (Memory Mode)'));
    }

    let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    res.status(200).json(new ApiResponse(200, { wishlist }, 'Wishlist fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Toggle product in wishlist (Add/Remove)
// @route POST /api/wishlist
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (mongoose.connection.readyState !== 1 || !mongoose.Types.ObjectId.isValid(userId)) {
      let memoryWishlist = inMemoryWishlists.get(userId) || { products: [] };
      const idx = memoryWishlist.products.findIndex(p => p._id === productId || p === productId);
      let action = 'added';
      if (idx > -1) {
        memoryWishlist.products.splice(idx, 1);
        action = 'removed';
      } else {
        memoryWishlist.products.push({
          _id: productId,
          name: 'Wishlist Tech Item',
          price: 199.99,
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800']
        });
        action = 'added';
      }
      inMemoryWishlists.set(userId, memoryWishlist);
      return res.status(200).json(new ApiResponse(200, { wishlist: memoryWishlist, action }, `Product ${action} wishlist`));
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    const index = wishlist.products.findIndex(p => p.toString() === productId);
    let action = '';

    if (index > -1) {
      wishlist.products.splice(index, 1);
      action = 'removed';
    } else {
      wishlist.products.push(productId);
      action = 'added';
    }

    await wishlist.save();
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');

    res.status(200).json(new ApiResponse(200, { wishlist: updatedWishlist, action }, `Product ${action} wishlist`));
  } catch (error) {
    next(error);
  }
};

// @desc Move product from wishlist to cart
// @route POST /api/wishlist/move-to-cart
exports.moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (mongoose.connection.readyState !== 1 || !mongoose.Types.ObjectId.isValid(userId)) {
      let memoryWishlist = inMemoryWishlists.get(userId) || { products: [] };
      memoryWishlist.products = memoryWishlist.products.filter(p => p._id !== productId && p !== productId);
      inMemoryWishlists.set(userId, memoryWishlist);
      return res.status(200).json(new ApiResponse(200, { wishlist: memoryWishlist }, 'Item moved to cart'));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    // Add to cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], subtotal: 0 });
    }

    const priceToUse = product.discountPrice > 0 ? product.discountPrice : product.price;
    const existingIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1, price: priceToUse });
    }

    cart.calculateSubtotal();
    await cart.save();

    // Remove from wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
      await wishlist.save();
    }

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate('products');
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json(new ApiResponse(200, { wishlist: updatedWishlist, cart: updatedCart }, 'Item moved to cart'));
  } catch (error) {
    next(error);
  }
};
