var mongoose = require('mongoose');

var CategoriSchema = new mongoose.Schema({
  child: {
    type: String, required: true, unique: true
  },
  niche: {
    type: mongoose.Schema.Types.ObjectId, ref: 'niches'
  }
});

module.exports = mongoose.model('categories', CategoriSchema);
