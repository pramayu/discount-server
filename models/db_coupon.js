var mongoose = require('mongoose');

var CouponSchema = new mongoose.Schema({
  code: {
    type: String, required: true, unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  }
});


module.exports = mongoose.model('coupons', CouponSchema);
