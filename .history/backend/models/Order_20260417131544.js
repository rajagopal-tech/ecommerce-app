const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:{
    type: mongo
  }
})

module.exports = mongoose.model('Order', orderSchema);