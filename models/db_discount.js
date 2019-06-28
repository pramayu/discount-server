var mongoose = require('mongoose');


var DiscountSchema = new mongoose.Schema({
  stuff: {
    type: mongoose.Schema.Types.ObjectId, ref: 'stuffs'
  },
  discountype: {
    type: mongoose.Schema.Types.ObjectId, ref: 'discountypes'
  },
  discount: {
    type: Number, required: true
  },
  startdate: {
    type: String, required: true
  },
  enddate: {
    type: String, required: true
  },
  status: {
    type: Boolean, default: false
  },
  limitpeople: {
    type: String
  }
});

module.exports = mongoose.model('discounts', DiscountSchema);
