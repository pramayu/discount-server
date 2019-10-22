var _ = require('lodash');
var db_Cart = require('../models/db_cart');
var db_Stuff = require('../models/db_stuff');
var db_User = require('../models/db_user');


module.exports = {
  Query: {
    get_user_cart: async(parent, args, {current_user}) => {
      console.log(args)
      if(current_user._id === args.usercartprop.userID) {
        var cart = await db_Cart.findOne({$and: [
          {'user': args.usercartprop.userID},
          {'stuffs': {$in: args.usercartprop.stuffID}}
        ]});
        console.log(cart)
        if(cart !== null) {
          return {
            status: true
          }
        } else {
          console.log(false)
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
  },
  Cart: {
    stuffs: async(parent, args, {current_user}) => {
      if(current_user._id) {
        var stuffs = await db_Stuff.find({'_id': {$in: parent.stuffs}});
        return stuffs;
      }
    },
    user: async(parent, args, {current_user}) => {
      if(current_user._id) {
        var user = await db_User.findOne({'_id': parent.user});
        return user;
      }
    }
  },
  Mutation: {
    add_to_cart: async(parent, args, {current_user}) => {
      if(current_user._id === args.userID) {
        var cart = await db_Cart.findOne({'user': args.userID});
        if(cart !== null) {
          cart.stuffs.push(args.stuffID);
          var saveCart = await cart.save();
          return {
            status: true,
            error: [],
            cart: saveCart
          }
        } else {
          var nCart = new db_Cart({});
          nCart.user = args.userID;
          nCart.stuffs.push(args.stuffID);
          var saveCart = await nCart.save();
          if(saveCart) {
            return {
              status: true,
              error: [],
              cart: saveCart
            }
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'add_to_cart',
            message: 'please re-login'
          }]
        }
      }
    }
  }
}
