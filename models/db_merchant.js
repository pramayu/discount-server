var mongoose = require('mongoose');

var MerchantSchema = new mongoose.Schema({
  name: {
    type: String, required: true, unique: true
  },
  coordinate: [{ type: String }],
  address: {
    type: String
  },
  districs: {
    type: String
  },
  province: {
    type: String
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
  }]
});

module.exports = mongoose.model('merchants', MerchantSchema);
