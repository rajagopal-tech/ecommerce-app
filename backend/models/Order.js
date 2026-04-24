const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
  },
  status:{
    type: String,
    default: "pending"
  },
  items:[
    {
      name: String,
      price: Number,
      image: String,
      qty: Number
    }
  ],
  total: Number,
  createdAt:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);