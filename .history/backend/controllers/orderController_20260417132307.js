const Order = require('../models/Order');

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    const order = await Order.create({
      user: req.user.id,
      items,
      total
    });

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USER ORDERS
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({createdAt: -1});
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};