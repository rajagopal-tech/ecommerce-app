const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ob
  }
})

module.exports = mongoose.model('Order', orderSchema);