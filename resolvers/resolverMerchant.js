var _ = require('lodash');
var cloudinary = require('cloudinary');
var db_Merchant = require('../models/db_merchant');

cloudinary.config({
  cloud_name: 'dw8yfsem4',
  api_key: '177692719348648',
  api_secret: '-3ZXwK1ZC9I6_8Tzo6lEZfXgk-o'
});

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
          if(args.imageupload.length > 0) {
            if(merchant.photos.length > 0) {
              cloudinary.uploader.destroy(merchant.photos[0].publicId);
              await db_Merchant.updateOne({'_id': args.basicupdateprop.merchantID}, {$pull: { photos: { '_id': merchant.photos[0]._id } }});
            }
            merchant.photos.push({
              publicId: args.imageupload[0].publicId,
              secureUrl: args.imageupload[0].secureUrl,
              imgType: args.imageupload[0].imgType,
            });
          }
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
