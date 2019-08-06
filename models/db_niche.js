var mongoose = require('mongoose');

var NicheSchema = new mongoose.Schema({
  child: {
    type: String, unique: true
  }
});

module.exports = mongoose.model('niches', NicheSchema);
