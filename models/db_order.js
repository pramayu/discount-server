var mongoose = require('mongoose');


var OrderSchema = new mongoose.Schema({
  coupon: {
    type: mongoose.Schema.Types.ObjectId, ref: 'coupons'
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  },
  stuff: {
    type: mongoose.Schema.Types.ObjectId, ref: 'stuffs'
  },
  discount: {
    type: mongoose.Schema.Types.ObjectId, ref: 'discounts'
  },
  created: {
    type: Date
  },
  status: {
    type: String, default: 'pending'
  }
});

module.exports = mongoose.model('orders', OrderSchema);
