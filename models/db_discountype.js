var mongoose = require('mongoose');


var DiscountTypeSchema = new mongoose.Schema({
  child: {
    type: String, required: true, unique: true
  }
});

module.exports = mongoose.model('discountypes', DiscountTypeSchema);
