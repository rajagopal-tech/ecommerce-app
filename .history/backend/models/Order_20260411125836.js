const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  products: [
    {
      name: String,
      price: Number
    }
  ],
  totalPrice: Number
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);