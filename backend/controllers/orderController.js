const Order = require('../models/Order');
const Product = require('../models/Product');

// CREATE ORDER
exports.createOrder = async (req, res, next) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No items in order" 
      });
    }

    // Server-side validation of price and total
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item._id);
      if (!dbProduct) {
        return res.status(404).json({ 
          success: false, 
          message: `Product ${item.name} not found` 
        });
      }
      
      const itemPrice = dbProduct.price;
      const itemQty = item.qty || 1;
      calculatedTotal += itemPrice * itemQty;

      validatedItems.push({
        name: dbProduct.name,
        price: itemPrice,
        image: dbProduct.image,
        qty: itemQty
      });
    }

    if (Math.round(calculatedTotal) !== Math.round(total)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid order total. Possible price manipulation detected." 
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: validatedItems,
      total: calculatedTotal
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order
    });

  } catch (err) {
    next(err);
  }
};

// GET USER ORDERS
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({createdAt: -1});
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try{
    const order = await Order.findById(req.params.id);

    if(!order) return res.status(404).json({ 
      success: false, 
      message: "Order not found" 
    });

    // Ownership Check
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to cancel this order" 
      });
    }

    if (order.status !== "Pending") {
        return res.status(400).json({ 
          success: false, 
          message: `Cannot cancel order in '${order.status}' status` 
        });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL ORDERS (Admin Only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE ORDER STATUS (Admin Only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = req.body.status || order.status;
    
    if (!order.user) {
      return res.status(400).json({ 
        success: false, 
        message: "Order data is incomplete (missing user)" 
      });
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      data: order
    });
  } catch (err) {
    next(err);
  }
};
