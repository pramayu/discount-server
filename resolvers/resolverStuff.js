var _ = require('lodash');
var db_User = require('../models/db_user');
var db_Merchant = require('../models/db_merchant');

module.exports = {
  Query: {

  },
  Mutation: {
    usermerchant: async(parent, args, {current_user}) => {
      if(current_user || current_user._id === args.userID) {
        var user = await db_User.findOne({'_id': args.userID});
        if(user !== null) {
          var merchant = await db_Merchant.findOne({'_id': user.merchant});
          if(merchant !== null) {
            return {
              status: true,
              merchant: merchant
            }
          } else {
            return {
              status: false
            }
          }
        } else {
          return {
            status: false
          }
        }
      } else {
        return {
          status: false
        }
      }
    }
  }
}
