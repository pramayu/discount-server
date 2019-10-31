var _ = require('lodash');
var db_Comment = require('../models/db_comment');
var db_Stuff = require('../models/db_stuff');
var db_User = require('../models/db_user');
var db_Rate = require('../models/db_rate');

module.exports = {
  Query: {
    comment_stuff: async(parent, args, {current_user}) => {
      if(current_user._id === args.commentprop.userID) {
        var stuff = await db_Stuff.findOne({'_id': args.commentprop.stuffID});
        if(stuff !== null) {
          var comments = await db_Comment.find({'stuff': stuff._id});
          if(comments !== null) {
            return comments;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  },
  Comment: {
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
    stuff: async(parent, args, {current_user}) => {
      if(current_user._id) {
        var stuff = await db_Stuff.findOne({'_id': parent.stuff});
        if(stuff !== null) {
          return stuff;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    rate: async(parent, args, {current_user}) => {
      if(current_user._id) {
        var rate = await db_Rate.findOne({'comment': parent._id});
        if(rate !== null) {
          return rate;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  },
  Mutation: {
    comment_to_stuff: async(parent, args, {current_user}) => {
      if(current_user._id === args.commentprop.userID) {
        var stuff = await db_Stuff.findOne({'_id': args.commentprop.stuffID});
        if(stuff !== null) {
          if(args.commentprop.child.length > 0) {
            var comment = new db_Comment({});
            comment.child = args.commentprop.child;
            comment.user = args.commentprop.userID;
            comment.stuff = stuff._id
            var savecomment = await comment.save();
            if(savecomment) {
              var rate = new db_Rate({});
              rate.scale = parseInt(args.commentprop.rate);
              rate.user = args.commentprop.userID;
              rate.merchant = args.commentprop.merchantID;
              rate.comment = savecomment._id
              await rate.save();
              return {
                status: true,
                error: [],
                comment: savecomment
              }
            }
          } else {
            return {
              status: false,
              error: [{
                path: 'comment_to_stuff',
                message: "comment can't be empty"
              }]
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'comment_to_stuff',
              message: 'stuff not found'
            }]
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'comment_to_stuff',
            message: 'please re-login'
          }]
        }
      }
    },
    edit_comment_stuff: async(parent, args, {current_user}) => {
      if(current_user._id === args.commentprop.userID) {
        var comment = await db_Comment.findOne({'_id': args.commentprop.commentID});
        if(comment !== null) {
          if(args.commentprop.child.length > 0) {
            comment.child = args.commentprop.child;
            var savecomment = await comment.save();
            return {
              status: true,
              error: []
            }
          } else {
            return {
              status: false,
              error: [{
                path: 'edit_comment_stuff',
                message: 'comment is required'
              }]
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'edit_comment_stuff',
              message: 'comment not found'
            }]
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'edit_comment_stuff',
            message: 'please re-login'
          }]
        }
      }
    },
    delete_comment_stuff: async(parent, args, {current_user}) => {
      if(current_user._id === args.commentprop.userID) {
        var comment = await db_Comment.findOne({'_id': args.commentprop.commentID});
        if(comment !== null) {
          await db_Comment.remove({'_id': args.commentprop.commentID});
          await db_Rate.remove({'comment': args.commentprop.commentID});
          return {
            status: true
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'delete_comment_stuff',
              message: 'comment not found'
            }]
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'delete_comment_stuff',
            message: 'please re-login'
          }]
        }
      }
    }
  }
}
