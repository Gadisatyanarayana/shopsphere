const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// In-Memory Seed Products Fallback when local MongoDB is disconnected
let fallbackProducts = [
  {
    _id: '65f1234567890abcdef10001',
    name: 'SonicPro Wireless Noise Cancelling Headphones',
    slug: 'sonicpro-wireless-noise-cancelling-headphones',
    description: 'Experience studio-quality sound with active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam earcups.',
    price: 14999,
    discountPrice: 11999,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
    category: { _id: 'cat_elec', name: 'Electronics', slug: 'electronics' },
    brand: 'SonicPro',
    stock: 25,
    ratings: 4.8,
    numReviews: 42,
    isFeatured: true,
    tags: ['audio', 'wireless', 'headphones', 'bluetooth'],
    specifications: [{ key: 'Battery Life', value: '40 Hours' }, { key: 'ANC', value: 'Active Noise Cancellation' }]
  },
  {
    _id: '65f1234567890abcdef10002',
    name: 'UltraVision 4K Smart Watch Series 8',
    slug: 'ultravision-4k-smart-watch-series-8',
    description: 'Seamless health tracking, AMOLED display, ECG monitoring, sleep tracking, and multi-sport workout modes.',
    price: 8999,
    discountPrice: 6499,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
    category: { _id: 'cat_elec', name: 'Electronics', slug: 'electronics' },
    brand: 'UltraVision',
    stock: 30,
    ratings: 4.6,
    numReviews: 28,
    isFeatured: true,
    tags: ['smartwatch', 'fitness', 'wearables'],
    specifications: [{ key: 'Display', value: '1.9 inch AMOLED' }]
  },
  {
    _id: '65f1234567890abcdef10003',
    name: 'Urban Legend Leather Biker Jacket',
    slug: 'urban-legend-leather-biker-jacket',
    description: 'Handcrafted genuine lambskin leather jacket with asymmetrical zip closure, quilted shoulder padding, and satin lining.',
    price: 12999,
    discountPrice: 8999,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'],
    category: { _id: 'cat_fash', name: 'Fashion', slug: 'fashion' },
    brand: 'Urban Legend',
    stock: 15,
    ratings: 4.9,
    numReviews: 19,
    isFeatured: true,
    tags: ['jacket', 'leather', 'fashion', 'outerwear'],
    specifications: [{ key: 'Material', value: '100% Genuine Lambskin' }]
  },
  {
    _id: '65f1234567890abcdef10004',
    name: 'RunnerX Cushion Elite Sneakers',
    slug: 'runnerx-cushion-elite-sneakers',
    description: 'Engineered mesh sneakers with responsive foam cushioning, breathable lining, and high-traction rubber outsole.',
    price: 5999,
    discountPrice: 3999,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
    category: { _id: 'cat_fash', name: 'Fashion', slug: 'fashion' },
    brand: 'RunnerX',
    stock: 35,
    ratings: 4.7,
    numReviews: 34,
    isFeatured: true,
    tags: ['shoes', 'sneakers', 'footwear'],
    specifications: [{ key: 'Sole Material', value: 'High Density Rubber' }]
  },
  {
    _id: '65f1234567890abcdef10005',
    name: 'BaristaTouch Espresso Machine & Coffee Maker',
    slug: 'baristatouch-espresso-machine',
    description: '15-bar Italian pump pressure espresso maker with built-in milk frother, precise thermal heating, and stainless steel housing.',
    price: 24999,
    discountPrice: 19999,
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800'],
    category: { _id: 'cat_home', name: 'Home & Kitchen', slug: 'home-kitchen' },
    brand: 'BaristaTouch',
    stock: 14,
    ratings: 4.9,
    numReviews: 52,
    isFeatured: true,
    tags: ['coffee', 'espresso', 'kitchen'],
    specifications: [{ key: 'Pump Pressure', value: '15 Bar' }]
  },
  {
    _id: '65f1234567890abcdef10006',
    name: 'System Design Interview & Architecture Guide Book',
    slug: 'system-design-interview-guide-book',
    description: 'Comprehensive hardbound masterguide covering large scale distributed systems, database sharding, caching, microservices, and system architecture.',
    price: 1499,
    discountPrice: 999,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'],
    category: { _id: 'cat_fit', name: 'Books & Fitness', slug: 'books-fitness' },
    brand: 'TechPress',
    stock: 60,
    ratings: 5.0,
    numReviews: 88,
    isFeatured: true,
    tags: ['books', 'programming', 'architecture'],
    specifications: [{ key: 'Pages', value: '450 Pages' }]
  }
];

// @desc Get all products with search, filter, sort, pagination
// @route GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      isFeatured,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    // In-memory fallback if MongoDB local service is offline
    if (mongoose.connection.readyState !== 1) {
      let filtered = [...fallbackProducts];

      if (keyword) {
        const k = keyword.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(k) ||
            p.brand.toLowerCase().includes(k) ||
            p.tags.some((t) => t.toLowerCase().includes(k))
        );
      }

      if (category) {
        filtered = filtered.filter(
          (p) => p.category?.slug === category || p.category?._id === category
        );
      }

      if (brand) {
        filtered = filtered.filter((p) => p.brand.toLowerCase().includes(brand.toLowerCase()));
      }

      if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));
      if (rating) filtered = filtered.filter((p) => p.ratings >= Number(rating));
      if (isFeatured !== undefined) {
        filtered = filtered.filter((p) => p.isFeatured === (isFeatured === 'true'));
      }

      if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') filtered.sort((a, b) => b.ratings - a.ratings);

      const pageNum = Number(page);
      const limitNum = Number(limit);

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            products: filtered,
            page: pageNum,
            pages: Math.ceil(filtered.length / limitNum) || 1,
            total: filtered.length
          },
          'Products fetched successfully (Fallback Active)'
        )
      );
    }

    // Database Queries when MongoDB is Connected
    const query = {};
    if (keyword) query.$text = { $search: keyword };
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catObj = await Category.findOne({ slug: category });
        if (catObj) query.category = catObj._id;
      }
    }
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.ratings = { $gte: Number(rating) };
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { ratings: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json(
      new ApiResponse(
        200,
        { products, page: pageNum, pages: Math.ceil(total / limitNum) || 1, total },
        'Products fetched successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc Get product details by slug or ID
// @route GET /api/products/:identifier
exports.getProductByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const product = fallbackProducts.find((p) => p.slug === identifier || p._id === identifier);
      if (!product) return next(new ApiError(404, 'Product not found'));
      return res.status(200).json(new ApiResponse(200, { product }, 'Product detail fetched'));
    }

    let product;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate('category', 'name slug description');
    } else {
      product = await Product.findOne({ slug: identifier }).populate('category', 'name slug description');
    }

    if (!product) return next(new ApiError(404, 'Product not found'));
    res.status(200).json(new ApiResponse(200, { product }, 'Product detail fetched'));
  } catch (error) {
    next(error);
  }
};

// @desc Get related products
// @route GET /api/products/:id/related
exports.getRelatedProducts = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(new ApiResponse(200, { products: fallbackProducts.slice(0, 4) }, 'Related products fetched'));
    }

    const product = await Product.findById(req.params.id);
    if (!product) return next(new ApiError(404, 'Product not found'));

    const related = await Product.find({ category: product.category, _id: { $ne: product._id } })
      .limit(4)
      .populate('category', 'name slug');

    res.status(200).json(new ApiResponse(200, { products: related }, 'Related products fetched'));
  } catch (error) {
    next(error);
  }
};

// @desc Create product (Admin / Seller)
// @route POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const newProd = {
        _id: `prod_${Date.now()}`,
        slug: (req.body.name || 'new-product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ratings: 5.0,
        numReviews: 0,
        category: { name: 'General', slug: 'general' },
        ...req.body
      };
      fallbackProducts.unshift(newProd);
      return res.status(201).json(new ApiResponse(201, { product: newProd }, 'Product created successfully (Dev Mode)'));
    }

    const product = await Product.create(req.body);
    res.status(201).json(new ApiResponse(201, { product }, 'Product created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Update product (Admin / Seller)
// @route PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = fallbackProducts.findIndex((p) => p._id === req.params.id);
      if (idx !== -1) {
        fallbackProducts[idx] = { ...fallbackProducts[idx], ...req.body };
        return res.status(200).json(new ApiResponse(200, { product: fallbackProducts[idx] }, 'Product updated successfully'));
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return next(new ApiError(404, 'Product not found'));
    res.status(200).json(new ApiResponse(200, { product }, 'Product updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Delete product (Admin / Seller)
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      fallbackProducts = fallbackProducts.filter((p) => p._id !== req.params.id);
      return res.status(200).json(new ApiResponse(200, {}, 'Product deleted successfully'));
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new ApiError(404, 'Product not found'));
    res.status(200).json(new ApiResponse(200, {}, 'Product deleted successfully'));
  } catch (error) {
    next(error);
  }
};
