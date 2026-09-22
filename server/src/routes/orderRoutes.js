const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getAdminDashboardStats
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.get('/admin/all', adminOnly, getAllOrders);
router.get('/admin/dashboard-stats', adminOnly, getAdminDashboardStats);

router.route('/:id')
  .get(getOrderById);

router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
