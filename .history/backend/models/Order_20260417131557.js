const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
  }
})

module.exports = mongoose.model('Order', orderSchema);