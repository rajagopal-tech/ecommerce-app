const Order = require("../models/Order");

// ✅ Create Order
exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    const order = await Order.create({
      user: req.user.id, // from token
      items,
      total
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get My Orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};