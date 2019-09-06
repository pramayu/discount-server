var db_Discountype = require('../models/db_discountype');
var _ = require('lodash');

module.exports = {
  Query: {
    discountypes: async(parent, args, {current_user}) => {
      if(current_user || current_user._id) {
        var discountypes = await db_Discountype.find({});
        return discountypes;
      }
    }
  }
}
