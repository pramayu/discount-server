var mongoose = require('mongoose');

var SubcategoriSchema = new mongoose.Schema({
  child: {
    type: String, required: true, unique: true
  },
  categori: {
    type: mongoose.Schema.Types.ObjectId, ref: 'niches'
  }
});

module.exports = mongoose.model('categories', CategoriSchema);
