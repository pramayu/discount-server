var _ = require('lodash');
var db_Discount = require('../models/db_discount');
var db_Stuff = require('../models/db_stuff');
var db_Discountype = require('../models/db_discountype');


module.exports = {
  Query: {

  },
  Discount: {
    discountype: async(parent, args, {current_user}) => {
      if(current_user || current_user._id) {
        var discountype = await db_Discountype.find({'_id': parent.discountype})
      }
    }
  },
  Mutation: {
    madediskon: async(parent, args, {current_user}) => {
      if(current_user._id === args.reqdiscount.userID) {
        var stuff = await db_Stuff.findOne({'_id': args.reqdiscount.stuffID});
        var today = new Date();
        if(stuff !== null) {
          var discount = new db_Discount();
          discount.stuff = stuff._id;
          discount.discountype = args.reqdiscount.discountypeID;
          discount.discount = args.reqdiscount.discount;
          discount.startdate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
          discount.enddate = args.reqdiscount.enddate;
          discount.status = true;
          discount.quantity = args.reqdiscount.quantity;
          stuff.discountstatus = true;
          var savediscount = await discount.save();
          if(savediscount) {
            var stuffupdated = await stuff.save();
            return {
              status: true,
              error: [],
              discount: savediscount
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'madediskon',
              message: 'stuff not found'
            }]
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'madediskon',
            message: 'please re-login'
          }]
        }
      }
    }
  }
}
