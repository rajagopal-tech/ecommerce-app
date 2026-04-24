const Order = require('../models/Order');

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    const order = await Order.create({
      userId,
      products,
      totalPrice
    });

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USER ORDERS
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};