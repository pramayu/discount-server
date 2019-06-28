var mongoose = require('mongoose');


var SubcriberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  },
  merchant: {
    type: mongoose.Schema.Types.ObjectId, ref: 'merchants'
  }
});

module.exports = mongoose.model('subscribers', SubcriberSchema);
