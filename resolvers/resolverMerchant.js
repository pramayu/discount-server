var _ = require('lodash');
var cloudinary = require('cloudinary');
var db_Merchant = require('../models/db_merchant');
var db_Niche = require('../models/db_niche');
var db_Location = require('../models/db_location');
var db_Stuff = require('../models/db_stuff');

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
    },
    location: async(parent, args, {current_user}) => {
      if(current_user || current_user._id) {
        var location = await db_Location.find({'merchant': parent._id});
        return location;
      }
    },
    stuffs: async(parent, args, {current_user}) => {
      var stuffs = await db_Stuff.find({
        $and: [{'merchant': parent._id}, {'stuffstatus': true}]
      });
      return stuffs
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
      if(current_user._id === args.addressupdateprop.userID) {
        var coordinates = [parseFloat(args.addressupdateprop.longitude), parseFloat(args.addressupdateprop.latitude)];
        var location = new db_Location({});
        location.address                = args.addressupdateprop.address;
        location.distric                = args.addressupdateprop.distric;
        location.province               = args.addressupdateprop.province;
        location.merchant               = args.addressupdateprop.merchantID;
        location.location.type          = "Point";
        location.location.coordinates   = coordinates;
        var savelocation = await location.save();
        if(savelocation) {
          return {
            status: true,
            location: savelocation,
            error: []
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
          await db_Location.findByIdAndRemove({'_id': args.addressdeleteprop.locationID})
          return {
            status: true,
            error: []
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
