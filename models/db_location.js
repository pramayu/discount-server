var mongoose = require('mongoose');


var LocationSchema = new mongoose.Schema({
  address: {
    type: String
  },
  distric: {
    type: String
  },
  province: {
    type: String
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId, ref: 'merchants'
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
    }
  }
});

LocationSchema.index({location: "2dsphere"});

module.exports = mongoose.model('locations', LocationSchema);
