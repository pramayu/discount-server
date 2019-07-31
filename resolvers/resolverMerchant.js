var _ = require('lodash');
var db_Merchant = require('../models/db_merchant');

module.exports = {
  Mutation: {
    basicupdatemerchant: async(parent, args, { current_user }) => {
      if(current_user || current_user._id === args.basicupdateprop.userID) {
        var merchant = await db_Merchant.findOne({'_id': args.basicupdateprop.merchantID});
        if(merchant !== null) {
          merchant.name = merchant.name !== args.basicupdateprop.name ? args.basicupdateprop.name : merchant.name;
          merchant.phone = merchant.phone !== args.basicupdateprop.phone ? args.basicupdateprop.phone : merchant.phone;
          merchant.sosmed = merchant.sosmed !== args.basicupdateprop.sosmed ? args.basicupdateprop.sosmed : merchant.sosmed;
          merchant.description = merchant.description !== args.basicupdateprop.description ? args.basicupdateprop.description : merchant.description;
          var savemerchant = await merchant.save();
          if(savemerchant) {
            return {
              status: true,
              error: []
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'basicupdatemerchant',
              message: 'please made merchant first'
            }]
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'basicupdatemerchant',
            message: 'please re-login'
          }]
        }
      }
    }
  }
}
