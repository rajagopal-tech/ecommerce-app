const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:{
    type: mongoose
  }
})

module.exports = mongoose.model('Order', orderSchema);