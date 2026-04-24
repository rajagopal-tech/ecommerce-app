const express = require('express');
const router = express.Router();

const { createOrder, getOrders } = require('../controllers/orderController');

// create order
router.post('/', createOrder);

// get orders by user
router.get('/:userId', getOrders);

module.exports = router;