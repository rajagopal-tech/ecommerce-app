const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
  },
  items:[
    {
      name: S
    }
  ]
})

module.exports = mongoose.model('Order', orderSchema);