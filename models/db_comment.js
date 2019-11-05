var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  child: {
    type: String
  },
  stuff: {
    type: mongoose.Schema.Types.ObjectId, ref: 'stuffs'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId, ref: 'merchants'
  }
});

module.exports = mongoose.model('comments', CommentSchema);
