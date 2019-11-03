var mongoose = require('mongoose');

var SubCommentSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.ObjectId, ref: 'comments'
  },
  child: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId, ref: 'merchants'
  }
});

module.exports = mongoose.model('subcomments', SubCommentSchema);
