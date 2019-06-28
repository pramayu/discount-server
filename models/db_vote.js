var mongoose = require('mongoose');


var VoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  },
  stuff: {
    type: mongoose.Schema.Types.ObjectId, ref: 'stuffs'
  }
});

module.exports = mongoose.model('votes', VoteSchema);
