var _ = require('lodash');
var cloudinary = require('cloudinary');
var db_Merchant = require('../models/db_merchant');
var db_Niche = require('../models/db_niche');

cloudinary.config({
  cloud_name: 'dw8yfsem4',
  api_key: '177692719348648',
  api_secret: '-3ZXwK1ZC9I6_8Tzo6lEZfXgk-o'
});

module.exports = {
  Merchant: {
    niche: async(parent, args, {current_user}) => {
      if(current_user || current_user._id) {
        var niche = await db_Niche.findOne({'_id': parent.niche});
        return niche
      }
    }
  },
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
            // var qrSet4 = 'location.'+indexID+'.coordinate.0.latitude';
            // var qrSet5 = 'location.'+indexID+'.coordinate.0.longitude';
            var updatemerchant = await db_Merchant.updateOne({
              '_id': args.addressupdateprop.merchantID, 'location': {$elemMatch: {'_id': args.addressupdateprop.locationID}}
            }, {$set: {
              [`${qrSet1}`]: merchant.location[indexID].address !== args.addressupdateprop.address ? args.addressupdateprop.address : merchant.location[indexID].address,
              [`${qrSet2}`]: merchant.location[indexID].distric !== args.addressupdateprop.distric ? args.addressupdateprop.distric : merchant.location[indexID].distric,
              [`${qrSet3}`]: merchant.location[indexID].province !== args.addressupdateprop.province ? args.addressupdateprop.province : merchant.location[indexID].province,
              // [`${qrSet4}`]: merchant.location[indexID].coordinate[0].latitude !== args.addressupdateprop.latitude ? args.addressupdateprop.latitude : merchant.location[indexID].coordinate[0].latitude,
              // [`${qrSet5}`]: merchant.location[indexID].coordinate[0].longitude !== args.addressupdateprop.longitude ? args.addressupdateprop.longitude : merchant.location[indexID].coordinate[0].longitude,
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
            var coordinates = [parseFloat(args.addressupdateprop.latitude), parseFloat(args.addressupdateprop.longitude)];
            // coordinate.push({
            //   ,
            //   longitude: args.addressupdateprop.longitude
            // });
            merchant.location.push({
              address: args.addressupdateprop.address,
              distric: args.addressupdateprop.distric,
              province: args.addressupdateprop.province,
            });
            merchant.geometri.coordinates.push(coordinates)
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
    },
    addressdelete: async(parent, args, { current_user }) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'deleteaddress',
            message: 'fields are require'
          }]
        }
      } else {
        if(current_user || current_user._id === args.addressdeleteprop.userID) {
          var pathUnset = "geometri.coordinates."+args.addressdeleteprop.indexID;
          var deleteaddress = await db_Merchant.updateOne({'_id': args.addressdeleteprop.merchantID}, {
            $pull: { 'location': {'_id': args.addressdeleteprop.locationID} }
          });
          await db_Merchant.updateOne({'_id': args.addressdeleteprop.merchantID}, {
            $unset: {[`${pathUnset}`]: 1}
          });
          await db_Merchant.updateOne({'_id': args.addressdeleteprop.merchantID}, {
            $pull: {"geometri.coordinates": null}
          });
          if(deleteaddress.ok === 1) {
            return {
              status: true,
              error: []
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'deleteaddress',
              message: 'please re-login'
            }]
          }
        }
      }
    },
    choosecategori: async(parent, args, { current_user }) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'choosecategori',
            message: 'fields required'
          }]
        }
      } else {
        if(current_user || current_user._id === args.categoriprop.userID) {
          var merchant = await db_Merchant.findOne({'_id': args.categoriprop.merchantID});
          if(merchant !== null) {
            merchant.niche = args.categoriprop.nicheID;
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
                path: 'choosecategori',
                message: 'merchant not found'
              }]
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'choosecategori',
              message: 'please re-login'
            }]
          }
        }
      }
    },
    addrules: async(parent, args, { current_user }) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'addrules',
            message: 'fields are required'
          }]
        }
      } else {
        if(current_user || current_user._id) {
          var merchant = await db_Merchant.findOne({'_id': args.merchantID});
          if(merchant !== null) {
            args.ruleprop.forEach((rule) => {
              merchant.rules.push({ child: rule.child });
            });
            var savemerchant = await merchant.save();
            if(savemerchant) {
              return {
                status: true,
                error: [],
                rules: savemerchant.rules
              }
            }
          } else {
            return {
              status: false,
              error: [{
                path: 'addrules',
                message: 'merchant not found'
              }]
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'addrules',
              message: 'please re-login'
            }]
          }
        }
      }
    },
    ruledelete: async(parent, args, {current_user}) => {
      console.log(args)
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'ruledelete',
            message: 'fields are required'
          }]
        }
      } else {
        if(current_user || current_user._id === args.ruledeleteprop.userID) {
          var rule = await db_Merchant.updateOne({'_id': args.ruledeleteprop.merchantID}, {
            $pull: {'rules': {'_id': args.ruledeleteprop.ruleID}}
          });
          if(rule.ok === 1) {
            return {
              status: true,
              error: []
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'ruledelete',
              message: 'please re-login'
            }]
          }
        }
      }
    },
    addfaciliti: async(parent, args, {current_user}) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'addfaciliti',
            message: 'fields are required'
          }]
        }
      } else {
        if(current_user || current_user._id === args.userID) {
          var merchant = await db_Merchant.findOne({'_id': args.merchantID});
          if(merchant !== null) {
            args.facilitiprop.forEach((faciliti) => {
              merchant.facilities.push({
                child: faciliti.child
              })
            });
            var savedfaciliti = await merchant.save();
            if(savedfaciliti) {
              return {
                status: true,
                error: [],
                facilities: savedfaciliti.facilities
              }
            }
          } else {
            return {
              status: false,
              error: [{
                path: 'addfaciliti',
                message: 'merchant not found'
              }]
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'addfaciliti',
              message: 'please re-login'
            }]
          }
        }
      }
    },
    deletefaciliti: async(parent, args, {current_user}) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'deletefaciliti',
            message: 'fields are required'
          }]
        }
      } else {
        if(current_user || current_user._id === args.facilitideleteprop.userID) {
          var faciliti = await db_Merchant.updateOne({'_id': args.facilitideleteprop.merchantID}, {
            $pull: { 'facilities': {'_id': args.facilitideleteprop.facilitiID} }
          });
          if(faciliti.ok === 1) {
            return {
              status: true,
              error: []
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'deletefaciliti',
              message: 'please re-login'
            }]
          }
        }
      }
    }
  }
}
