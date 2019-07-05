var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var db_User = require('../models/db_user');
var cert = fs.readFileSync(path.join(__dirname, '../utils/jwtRS256.key'));
var certpub = fs.readFileSync(path.join(__dirname, '../utils/jwtRS256.key.pub'));

module.exports = {
  Query:{
    users: async(parent, args, context) => {

    }
  },
  Mutation: {
    createuser: async(parent, args, context) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'createuser',
            message: 'fields are required'
          }]
        }
      } else {
        var existuser = await db_User.findOne({ $or: [{'username': args.username}, {'email': args.email}] });
        if(existuser || existuser !== null) {
          return {
            status: false,
            error: [{
              path: 'createuser',
              message: 'username or email already exist.'
            }]
          }
        } else {
          var hashStr = await bcrypt.hash(args.password, 12);
          var newuser = new db_User();
          newuser.username = args.username;
          newuser.email = args.email;
          newuser.phone = args.phone;
          newuser.strhash = hashStr;
          var saveuser = await newuser.save();
          if(saveuser) {
            return {
              status: true,
              error: []
            }
          }
        }
      }
    }
  }
}
