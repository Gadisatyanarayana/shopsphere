const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc Get reviews for a product
// @route GET /api/reviews/product/:productId
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, { reviews }, 'Product reviews fetched'));
  } catch (error) {
    next(error);
  }
};

// @desc Create product review (Verified purchasers only)
// @route POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    // Check if user has ordered this product
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      'items.product': productId,
      paymentStatus: 'completed'
    });

    if (!hasPurchased && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Only verified customers who purchased this product can leave a review'));
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user.id
    });

    if (alreadyReviewed) {
      return next(new ApiError(400, 'You have already reviewed this product'));
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating: Number(rating),
      comment
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json(new ApiResponse(201, { review: populatedReview }, 'Review submitted successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Update user review
// @route PUT /api/reviews/:id
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ApiError(404, 'Review not found'));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to edit this review'));
    }

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;

    await review.save();

    res.status(200).json(new ApiResponse(200, { review }, 'Review updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc Delete review
// @route DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new ApiError(404, 'Review not found'));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to delete this review'));
    }

    const productId = review.product;
    await review.deleteOne();

    // Trigger static getAverageRating
    await Review.getAverageRating(productId);

    res.status(200).json(new ApiResponse(200, {}, 'Review deleted successfully'));
  } catch (error) {
    next(error);
  }
};
