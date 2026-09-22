const mongoose = require('mongoose');
const Category = require('../models/Category');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

let fallbackCategories = [
  {
    _id: 'cat_elec',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Next-gen smart gadgets, smartphones, laptops, audio equipment, and wearables.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_fash',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy apparel, designer footwear, streetwear, and luxury accessories.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_home',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Smart appliances, modern home decor, kitchenware, and furniture.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'cat_fit',
    name: 'Books & Fitness',
    slug: 'books-fitness',
    description: 'Bestselling literature, productivity books, gym equipment, and wellness gear.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
  }
];

// @desc Get all categories
// @route GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json(new ApiResponse(200, { categories: fallbackCategories }, 'Categories fetched successfully'));
    }

    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(new ApiResponse(200, { categories }, 'Categories fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Create category (Admin)
// @route POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const newCat = {
        _id: `cat_${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        image
      };
      fallbackCategories.push(newCat);
      return res.status(201).json(new ApiResponse(201, { category: newCat }, 'Category created successfully'));
    }

    const category = await Category.create({ name, description, image });
    res.status(201).json(new ApiResponse(201, { category }, 'Category created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Update category (Admin)
// @route PUT /api/categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = fallbackCategories.findIndex((c) => c._id === req.params.id);
      if (idx !== -1) {
        fallbackCategories[idx] = { ...fallbackCategories[idx], ...req.body };
        return res.status(200).json(new ApiResponse(200, { category: fallbackCategories[idx] }, 'Category updated successfully'));
      }
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return next(new ApiError(404, 'Category not found'));
    res.status(200).json(new ApiResponse(200, { category }, 'Category updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Delete category (Admin)
// @route DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      fallbackCategories = fallbackCategories.filter((c) => c._id !== req.params.id);
      return res.status(200).json(new ApiResponse(200, {}, 'Category deleted successfully'));
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new ApiError(404, 'Category not found'));
    res.status(200).json(new ApiResponse(200, {}, 'Category deleted successfully'));
  } catch (error) {
    next(error);
  }
};
