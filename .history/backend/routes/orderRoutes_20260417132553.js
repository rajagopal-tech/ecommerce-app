const express = require('express');
const router = express.Router();

const { createOrder, getMyOrders } = require('../controllers/orderController');
const auth = require("../middleware/authMiddleware");
// create order
router.post('/', createOrder);
router.get
// get orders by user
router.get('/:userId', getOrders);

module.exports = router;