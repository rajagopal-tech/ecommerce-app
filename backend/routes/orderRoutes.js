const express = require('express');
const router = express.Router();

const { createOrder, getMyOrders , cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
// create order
router.post('/', auth, createOrder);
router.get("/", auth, getMyOrders)
router.put("/:id/cancel", auth, cancelOrder);

// Admin routes
router.get("/admin/all", auth, admin, getAllOrders);
router.put("/:id/status", auth, admin, updateOrderStatus);

module.exports = router;