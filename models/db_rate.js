var mongoose = require('mongoose');


var RateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId, ref: 'merchants'
  },
  scale: {
    type: Number, required: true
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId, ref: 'comments'
  }
});

module.exports = mongoose.model('rates', RateSchema);
