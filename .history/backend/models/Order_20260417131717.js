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
  tot
})

module.exports = mongoose.model('Order', orderSchema);