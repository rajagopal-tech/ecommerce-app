const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.ty
  }
})

module.exports = mongoose.model('Order', orderSchema);