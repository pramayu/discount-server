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
});

module.exports = mongoose.model('comments', CommentSchema);
