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
    type: String, required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number, required: true
  },
  photos: [{
    publicId: { type: String },
    secureUrl: { type: String },
    imgType: { type: String }
  }],
  discountstatus: {
    type: Boolean, default: false
  }
});

module.exports = mongoose.model('stuffs', StuffSchema);
