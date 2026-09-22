const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// In-Memory Fallback Carts for Offline Mode
const inMemoryCarts = new Map();

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], subtotal: 0 });
  }
  return cart;
};

// @desc Get user cart
// @route GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (mongoose.connection.readyState !== 1) {
      if (!inMemoryCarts.has(userId)) {
        inMemoryCarts.set(userId, { items: [], subtotal: 0 });
      }
      return res.status(200).json(new ApiResponse(200, { cart: inMemoryCarts.get(userId) }, 'Cart fetched (Memory Mode)'));
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(200).json(new ApiResponse(200, { cart: { items: [], subtotal: 0 } }, 'Cart is empty'));
    }
    res.status(200).json(new ApiResponse(200, { cart }, 'Cart fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Add item to cart
// @route POST /api/cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (mongoose.connection.readyState !== 1) {
      // In-Memory Cart Handling
      let memoryCart = inMemoryCarts.get(userId) || { items: [], subtotal: 0 };
      
      const sampleProducts = [
        { _id: productId, name: 'Sony WH-1000XM5 Headphones', price: 349.99, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'], slug: 'sony-wh1000xm5' },
        { _id: productId, name: 'Apple MacBook Air M3', price: 1299.00, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'], slug: 'macbook-air-m3' }
      ];
      const prod = sampleProducts.find(p => p._id === productId) || {
        _id: productId,
        name: 'ShopSphere Premium Tech Item',
        price: 99.99,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
        slug: 'tech-item'
      };

      const existingIdx = memoryCart.items.findIndex(i => i.product._id === productId || i.product === productId);
      if (existingIdx > -1) {
        memoryCart.items[existingIdx].quantity += Number(quantity);
      } else {
        memoryCart.items.push({
          _id: `item_${Date.now()}`,
          product: prod,
          quantity: Number(quantity),
          price: prod.price
        });
      }

      memoryCart.subtotal = memoryCart.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      inMemoryCarts.set(userId, memoryCart);
      return res.status(200).json(new ApiResponse(200, { cart: memoryCart }, 'Item added to cart (Memory Mode)'));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    if (product.stock < quantity) {
      return next(new ApiError(400, `Requested quantity exceeds available stock (${product.stock} available)`));
    }

    const priceToUse = product.discountPrice > 0 ? product.discountPrice : product.price;
    const cart = await getOrCreateCart(userId);

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].quantity + Number(quantity);
      if (product.stock < newQty) {
        return next(new ApiError(400, `Cannot add more. Only ${product.stock} items available in stock.`));
      }
      cart.items[existingItemIndex].quantity = newQty;
      cart.items[existingItemIndex].price = priceToUse;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: priceToUse
      });
    }

    cart.calculateSubtotal();
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json(new ApiResponse(200, { cart: updatedCart }, 'Item added to cart'));
  } catch (error) {
    next(error);
  }
};

// @desc Update cart item quantity
// @route PUT /api/cart/:itemId
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;
    const userId = req.user.id;

    if (mongoose.connection.readyState !== 1) {
      let memoryCart = inMemoryCarts.get(userId) || { items: [], subtotal: 0 };
      const idx = memoryCart.items.findIndex(i => i._id === itemId || i.product._id === itemId);
      if (idx > -1) {
        memoryCart.items[idx].quantity = Number(quantity);
        memoryCart.subtotal = memoryCart.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
        inMemoryCarts.set(userId, memoryCart);
      }
      return res.status(200).json(new ApiResponse(200, { cart: memoryCart }, 'Cart updated'));
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return next(new ApiError(404, 'Cart not found'));
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return next(new ApiError(404, 'Cart item not found'));
    }

    const product = await Product.findById(cart.items[itemIndex].product);
    if (product && product.stock < quantity) {
      return next(new ApiError(400, `Only ${product.stock} items available in stock`));
    }

    cart.items[itemIndex].quantity = Number(quantity);
    cart.calculateSubtotal();
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json(new ApiResponse(200, { cart: updatedCart }, 'Cart updated'));
  } catch (error) {
    next(error);
  }
};

// @desc Remove item from cart
// @route DELETE /api/cart/:itemId
exports.removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    if (mongoose.connection.readyState !== 1) {
      let memoryCart = inMemoryCarts.get(userId) || { items: [], subtotal: 0 };
      memoryCart.items = memoryCart.items.filter(i => i._id !== itemId && i.product._id !== itemId);
      memoryCart.subtotal = memoryCart.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      inMemoryCarts.set(userId, memoryCart);
      return res.status(200).json(new ApiResponse(200, { cart: memoryCart }, 'Item removed'));
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return next(new ApiError(404, 'Cart not found'));
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    cart.calculateSubtotal();
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json(new ApiResponse(200, { cart: updatedCart }, 'Item removed from cart'));
  } catch (error) {
    next(error);
  }
};

// @desc Clear whole cart
// @route DELETE /api/cart
exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (mongoose.connection.readyState !== 1) {
      inMemoryCarts.set(userId, { items: [], subtotal: 0 });
      return res.status(200).json(new ApiResponse(200, { cart: { items: [], subtotal: 0 } }, 'Cart cleared'));
    }

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      cart.subtotal = 0;
      await cart.save();
    }
    res.status(200).json(new ApiResponse(200, { cart: { items: [], subtotal: 0 } }, 'Cart cleared'));
  } catch (error) {
    next(error);
  }
};
