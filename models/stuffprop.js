var mongoose = require('mongoose');


var StuffProp = new mongoose.Schema({
  size: [{
    child: {type: String}
  }],
  color: [{
    child: {type: String}
  }],
  ingredient: [{
    child: {type: String}
  }],
  stuff: {
    type: mongoose.Schema.Types.ObjectId, ref: 'stuffs'
  }
});

module.exports = mongoose.model('stuffprops', StuffProp);
