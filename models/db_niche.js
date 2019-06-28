var mongoose = require('mongoose');

var NicheSchema = new mongoose.Schema({
  child: {
    type: String, unique: true
  },
  icon: {
    type: String, required: true
  }
});

module.exports = mongoose.model('niches', NicheSchema);
