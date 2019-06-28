var mongoose = require('mongoose');


var ReviewSchema = new mongoose.Schema({
  comment: {
    type: String, required: true
  },
  user:{
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  },
  stuff: {
    type: mongoose.Schema.Types.ObjectId, ref: 'stuffs'
  }
});

module.exports = mongoose.model('reviews', ReviewSchema);
