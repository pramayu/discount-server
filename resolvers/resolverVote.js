var _ = require('lodash');
var db_Vote = require('../models/db_vote');
var db_Stuff = require('../models/db_stuff');
var db_User = require('../models/db_user');

module.exports = {
  Query: {

  },
  Vote: {
    voter: async(parent, args, {current_user}) => {
      if(current_user._id) {
        var voter = await db_User.findOne({'_id': parent.voter});
        if(voter !== null) {
          return voter
        } else {
          return null
        }
      } else {
        return null
      }
    }
  },
  Mutation: {
    add_vote_stuff: async(parent, args, {current_user}) => {
      if(current_user._id === args.voteprop.userID) {
        var stuff = await db_Stuff.findOne({'_id': args.voteprop.stuffID});
        if(stuff !== null) {
          var vote = new db_Vote({});
          vote.voter = args.voteprop.userID;
          vote.stuff = stuff._id;
          var savevote = await vote.save();
          if(savevote) {
            return {
              status: true,
              error: []
            }
          } else {
            return {
              status: false,
              error: [{
                path: 'add_vote_stuff',
                message: 'someting wrong'
              }]
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'add_vote_stuff',
              message: 'stuff not exist'
            }]
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'add_vote_stuff',
            message: 'please re-login'
          }]
        }
      }
    },
    unvote_stuff: async(parent, args, {current_user}) => {
      if(current_user._id === args.voteprop.userID) {
        var vote = await db_Vote.findOne({'_id': args.voteprop.voteID});
        if(vote !== null) {
          await db_Vote.deleteOne({'_id': vote._id});
          return {
            status: true,
            error: []
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'unvote_stuff',
              message: 'vote not found'
            }]
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'unvote_stuff',
            message: 'please re-login'
          }]
        }
      }
    }
  }
}
