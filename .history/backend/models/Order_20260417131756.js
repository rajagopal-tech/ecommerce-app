const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
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
    deg
  }
})

module.exports = mongoose.model('Order', orderSchema);