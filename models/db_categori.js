var mongoose = require('mongoose');

var CategoriSchema = new mongoose.Schema({
  child: {
    type: String, required: true, unique: true
  }
});

module.exports = mongoose.model('categories', CategoriSchema);
