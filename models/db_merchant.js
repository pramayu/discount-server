var mongoose = require('mongoose');

var MerchantSchema = new mongoose.Schema({
  name: {
    type: String, required: true, unique: true
  },
  phone: {
    type: String
  },
  location: [{
    address: {
      type: String
    },
    distric: {
      type: String
    },
    province: {
      type: String
    },
  }],
  geometri: {
    type: {
      type: String, default: "MultiPoint"
    },
    coordinates: [ [Number] ]
  },
  description: {
    type: String
  },
  foodtype: {
    type: String
  },
  sosmed: {
    type: String
  },
  niche: {
    type: mongoose.Schema.Types.ObjectId, ref: 'niches'
  },
  photos: [{
    publicId: { type: String },
    secureUrl: { type: String },
    imgType: { type: String }
  }],
  rules: [{
    child: { type: String }
  }],
  facilities: [{
    child: { type: String }
  }]
});

module.exports = mongoose.model('merchants', MerchantSchema);
