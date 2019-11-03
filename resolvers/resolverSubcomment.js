var _ = require('lodash');
var db_Comment = require('../models/db_comment');
var db_Subcomment = require('../models/db_subcomment');
var db_User = require('../models/db_user');
var db_Merchant = require('../models/db_merchant');

module.exports = {
  Query: {

  },
  SubComment: {
    user: async(parent, args, {current_user}) => {
      if(current_user._id) {
        var user = await db_User.findOne({'_id': parent.user});
        if(user !== null) {
          return user;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    merchant: async(parent, args, {current_user}) => {
      if(current_user._id) {
        var merchant = await db_Merchant.findOne({'_id': parent.user});
        if(merchant !== null) {
          return merchant;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
  },
  Mutation: {
    reply_to_comment_stuff: async(parent, args, {current_user}) => {
      if(args.subcommentprop.userID === current_user._id) {
        var comment = await db_Comment.findOne({'_id': args.subcommentprop.commentID});
        if(comment !== null) {
          if(args.subcommentprop.child.length > 0) {
            var subcomment = new db_Subcomment({});
            subcomment.user = args.subcommentprop.userID;
            subcomment.merchant = args.subcommentprop.merchantID;
            subcomment.comment = comment._id;
            subcomment.child = args.subcommentprop.child;
            var savesubcomment = await subcomment.save();
            if(savesubcomment) {
              return {
                status: true,
                error: []
              }
            }
          } else {
            return {
              status: false,
              error: [{
                path: 'reply_to_comment_stuff',
                message: 'replt cannot be empty'
              }]
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'reply_to_comment_stuff',
              message: 'comment not found'
            }]
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'reply_to_comment_stuff',
            message: 'please re-login'
          }]
        }
      }
    },
    delete_reply_comment: async(parent, args, {current_user}) => {
      if(current_user._id === args.subcommentprop.userID) {
        var subcomment = await db_Subcomment.findOne({'_id': args.subcommentprop.subcommentID});
        if(subcomment !== null) {
          await db_Subcomment.deleteOne({'_id': subcomment._id});
          return {
            status: true
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'delete_reply_comment',
              message: 'subcomment not found'
            }]
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'delete_reply_comment',
            message: 'please re-login'
          }]
        }
      }
    }
  }
}
