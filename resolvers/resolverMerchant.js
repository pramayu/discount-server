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
    },
    addressupdatemerchant: async(parent, args, { current_user }) => {
      if(current_user || current_user._id === args.addressupdateprop.userID) {
        var merchant = await db_Merchant.findOne({'_id': args.addressupdateprop.merchantID});
        if(merchant !== null) {
          if(args.addressupdateprop.locationID) {
            var indexID = parseInt(args.addressupdateprop.indexID);
            var qrSet1 = 'location.'+indexID+'.address';
            var qrSet2 = 'location.'+indexID+'.distric';
            var qrSet3 = 'location.'+indexID+'.province';
            var qrSet4 = 'location.'+indexID+'.coordinate.0.latitude';
            var qrSet5 = 'location.'+indexID+'.coordinate.0.longitude';
            var updatemerchant = await db_Merchant.updateOne({
              '_id': args.addressupdateprop.merchantID, 'location': {$elemMatch: {'_id': args.addressupdateprop.locationID}}
            }, {$set: {
              [`${qrSet1}`]: merchant.location[indexID].address !== args.addressupdateprop.address ? args.addressupdateprop.address : merchant.location[indexID].address,
              [`${qrSet2}`]: merchant.location[indexID].distric !== args.addressupdateprop.distric ? args.addressupdateprop.distric : merchant.location[indexID].distric,
              [`${qrSet3}`]: merchant.location[indexID].province !== args.addressupdateprop.province ? args.addressupdateprop.province : merchant.location[indexID].province,
              [`${qrSet4}`]: merchant.location[indexID].coordinate[0].latitude !== args.addressupdateprop.latitude ? args.addressupdateprop.latitude : merchant.location[indexID].coordinate[0].latitude,
              [`${qrSet5}`]: merchant.location[indexID].coordinate[0].longitude !== args.addressupdateprop.longitude ? args.addressupdateprop.longitude : merchant.location[indexID].coordinate[0].longitude,
            }});
            if(updatemerchant.ok === 1) {
              var savelocation = await db_Merchant.findOne({
                '_id': args.addressupdateprop.merchantID
              });
              console.log(savelocation)
              return {
                status: true,
                error: [],
                location: savelocation.location
              }
            }
          } else {
            var coordinate = [];
            coordinate.push({
              latitude: args.addressupdateprop.latitude,
              longitude: args.addressupdateprop.longitude
            });
            merchant.location.push({
              address: args.addressupdateprop.address,
              distric: args.addressupdateprop.distric,
              province: args.addressupdateprop.province,
              coordinate: coordinate
            });
            var savemerchant = await merchant.save();
            if(savemerchant) {
              var newlocation = _.filter(savemerchant.location, (loc) => {
                return loc.address === args.addressupdateprop.address
              });
              return {
                status: true,
                error: [],
                location: newlocation
              }
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'addressupdatemerchant',
              message: 'merchant not found'
            }]
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'addressupdatemerchant',
            message: 'plase re-login'
          }]
        }
      }
    }
  }
}
