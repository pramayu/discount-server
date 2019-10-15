var _ = require('lodash');
var db_Merchant = require('../models/db_merchant');
var db_Location = require('../models/db_location');
var db_User = require('../models/db_user');

module.exports = {
  Query: {
    usertimeline: async(parent, args, {current_user}) => {
      if(current_user._id === args.userID) {
        var user = await db_User.findOne({'_id': args.userID});
        if(user !== null) {
          return user
        } else {
          console.log('error wooe')
        }
      }
    },
    timeline: async(parent, args, {current_user}) => {
      if(current_user || current_user._id === args.timelineProp.userID) {
        var timeline = await db_Location.aggregate([
          {
            $geoNear: {
              near: { type: "Point", coordinates: [parseFloat(args.timelineProp.longitude), parseFloat(args.timelineProp.latitude)] },
              maxDistance: 100,
              distanceField: "calcDistance",
              spherical: true
            }
          },
          {
            $lookup: {
              from: "merchants",
              localField: "merchant",
              foreignField: "_id",
              as: "merchant"
            }
          },
          {
            $lookup: {
              from: "stuffs",
              localField: "merchant._id",
              foreignField: "merchant",
              as: "stuffs"
            }
          },
          {
            $project: {
              _id: 1,
              merchant: 1,
              address: 1,
              distric: 1,
              province: 1,
              stuffs: {//sort belum
                $filter: {
                  input: "$stuffs",
                  as: "stuff",
                  cond: {$and: [{$eq: ["$$stuff.discountstatus", true]}, {$eq: ["$$stuff.stuffstatus", true]}]}
                }
              }
            }
          }
        ]);
        if(timeline !== null) {
          var merchant = [];
          var stuffs = [];
          _.map(timeline, (tmline) => {
            merchant.push(...tmline.merchant);
            stuffs.push(...tmline.stuffs)
          });
          return {
            status    : true,
            stuffs    : stuffs,
            merchant  : merchant
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
