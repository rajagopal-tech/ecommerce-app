const express = require('express');
const router = express.Router();

const { createOrder, getMyOrders } = require('../controllers/orderController');
const auth = require("../middleware/authMiddleware");
// create order
router.post('/', auth, createOrder);
router.get("/", auth, getMyOrders)
// get orders by user
//router.get('/:userId', getOrders);

module.exports = router;