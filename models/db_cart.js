var mongoose = require('mongoose');

var CartSchema = new mongoose.Schema({
  stuffs: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'stuffs'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'users'
  }
});


module.exports = mongoose.model('carts', CartSchema)
