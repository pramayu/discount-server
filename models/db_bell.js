var mongoose = require('mongoose');


var BellSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  },
  tipe: {
    type: String
  },
  status: {
    type: Boolean, default: false
  }
});

module.exports = mongoose.model('bells', BellSchema);
