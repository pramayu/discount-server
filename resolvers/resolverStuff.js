var _ = require('lodash');
var db_User = require('../models/db_user');
var db_Merchant = require('../models/db_merchant');
var db_Stuff = require('../models/db_stuff');
var db_Categori = require('../models/db_categori');

module.exports = {
  Query: {
    getstuffs: async(parent, args, {current_user}) => {
      if(current_user || current_user._id === args.userID) {
        var user = await db_User.findOne({'_id': args.userID});
        if(user !== null) {
          var stuffs = await db_Stuff.find({'merchant': user.merchant});
          if(stuffs !== null) {
            return {
              status: true,
              stuffs
            }
          } else {
            return {
              status: false,
              stuffs: []
            }
          }
        } else {
          return {
            status: false,
            stuffs: []
          }
        }
      } else {
        return {
          status: false,
          stuffs: []
        }
      }
    },
    stuff: async(parent, args, {current_user}) => {
      console.log(args)
      if(current_user || current_user._id) {
        var stuff = db_Stuff.findOne({'_id': args.stuffID});
        if(stuff !== null) {
          return {
            status: true,
            stuff
          }
        } else {
          return {
            status: false,
            stuff: []
          }
        }
      } else {
        return {
          status: false,
          stuff: []
        }
      }
    }
  },
  Stuff: {
    manager: async(parent, args, {current_user}) => {
      if(current_user) {
        var manager = await db_User.findOne({'_id': parent.manager});
        return manager;
      }
    },
    merchant: async(parent, args, {current_user}) => {
      if(current_user) {
        var merchant = await db_Merchant.findOne({'_id': parent.merchant});
        return merchant;
      }
    },
    categori: async(parent, args, {current_user}) => {
      if(current_user) {
        var categori = await db_Categori.find({'_id': {$in: parent.categori}});
        return categori;
      }
    }
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
    },
    madestuff: async(parent, args, {current_user}) => {
      if(current_user || current_user._id === args.basestuff.userID) {
        if(args.basestuff.stuffID) {
          var stuff = await db_Stuff.findOne({'_id': args.basestuff.stuffID});
          if(stuff !== null) {
            if(args.basestuff.upstatus === 'pictureupload') {
              args.picture.map((res, index) => {
                stuff.photos.push({
                  publicId: res.publicId,
                  secureUrl: res.secureUrl,
                  imgType: res.imgType,
                })
              })
            } else {

            }
          } else {
            return {
              status: false,
              error: [{
                path: 'madestuff',
                error: 'stuff not found'
              }]
            }
          }
        } else {
          var stuff = new db_Stuff();
          stuff.manager = args.basestuff.userID;
          stuff.merchant = args.basestuff.merchantID;
          stuff.title = args.basestuff.title;
          stuff.description = args.basestuff.description;
          stuff.price = args.basestuff.price;
          args.categori.forEach((categori) => {stuff.categori.push(categori.categoriID)})
        }
        var savedstuff = await stuff.save();
        if(savedstuff) {
          return {
            status: true,
            stuff: savedstuff
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'madestuff',
            error: 'please re-login'
          }]
        }
      }
    },
    stuffpublish: async(parent, args, {current_user}) => {
      if(current_user || current_user._id === args.userID) {
        var stuff = await db_Stuff.findOne({'_id': args.stuffID});
        if(stuff) {
          stuff.stuffstatus = true;
          var savedstuff = await stuff.save();
          return {
            status: true
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
    },
    unsetcategori: async(parent, args, {current_user}) => {
      if(current_user._id === args.userID) {
        var stuff = await db_Stuff.findOne({'_id': args.stuffID});
        if(stuff !== null) {
          var updated = await db_Stuff.updateOne({'_id': args.stuffID}, {$pull: {
            categori: args.categoriID
          }});
          if(updated.ok === 1) {
            return {
              status: true
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
