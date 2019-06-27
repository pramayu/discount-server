var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: {
    type: String, required: true, unique: true, index: true
  },
  email: {
    type: String, required: true, index: true
  },
  phone: {
    type: String, required: true, unique: true
  },
  fullname: {
    type: String
  },
  strhash: {
    type: String, required: true
  },
  pin: {
    type: String, unique: true, index: true
  },
  activated: {
    type: Boolean, default: false
  },
  privilege: {
    type: String, default: 'buyer'
  },
  photos: [{
    publicId: { type: String },
    secureUrl: { type: String },
    imgType: { type: String }
  }]
});


module.exports = mongoose.model('users', UserSchema);
