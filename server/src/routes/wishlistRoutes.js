const express = require('express');
const {
  getWishlist,
  toggleWishlist,
  moveToCart
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(toggleWishlist);

router.post('/move-to-cart', moveToCart);

module.exports = router;
