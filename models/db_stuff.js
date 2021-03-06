var mongoose = require('mongoose');


var StuffSchema = new mongoose.Schema({
  merchant: {
    type: mongoose.Schema.Types.ObjectId, ref: 'merchants'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  },
  categori: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'categories'
  }],
  title: {
    type: String
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  photos: [{
    publicId: { type: String },
    secureUrl: { type: String },
    imgType: { type: String }
  }],
  discountstatus: {
    type: Boolean, default: false
  },
  stuffstatus: {
    type: Boolean, default: false
  },
  created: {
    type: Date, default: Date.now()
  }
});

module.exports = mongoose.model('stuffs', StuffSchema);
