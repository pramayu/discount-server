var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var cloudinary = require('cloudinary');
var db_User = require('../models/db_user');
var db_Merchant = require('../models/db_merchant');
var cert = fs.readFileSync(path.join(__dirname, '../utils/jwtRS256.key'));
var certpub = fs.readFileSync(path.join(__dirname, '../utils/jwtRS256.key.pub'));

cloudinary.config({
  cloud_name: 'dw8yfsem4',
  api_key: '177692719348648',
  api_secret: '-3ZXwK1ZC9I6_8Tzo6lEZfXgk-o'
});

module.exports = {
  Query:{
    user: async(parent, args, context) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'fetch_user',
            message: 'please re-login'
          }]
        }
      } else {
        var user = await db_User.findOne({'_id': args.userID});
        if(user || user !== null) {
          return {
            status: true,
            error: [],
            user: user
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'fetch_user',
              message: 'please re-login'
            }]
          }
        }
      }
    }
  },
  User: {
    merchant: async(parent, args, context) => {
      var merchant = await db_Merchant.findOne({'_id': parent.merchant});
      return merchant;
    }
  },
  Mutation: {
    createuser: async(parent, args, context) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'createuser',
            message: 'Fields are Required'
          }]
        }
      } else {
        var existuser = await db_User.findOne({ $or: [{'username': args.username}, {'email': args.email}] });
        if(existuser || existuser !== null) {
          return {
            status: false,
            error: [{
              path: 'createuserexsist',
              message: 'Username or Email Already Exist.'
            }]
          }
        } else {
          var hashStr = await bcrypt.hash(args.password, 12);
          var uniquePin = Math.random().toString(36).substr(2, 6).toUpperCase();
          var newuser = new db_User();
          newuser.username = args.username;
          newuser.email = args.email;
          newuser.phone = args.phone;
          newuser.strhash = hashStr;
          newuser.pin = uniquePin;
          var saveuser = await newuser.save();
          if(saveuser) {
            return {
              status: true,
              error: [],
            }
          }
        }
      }
    },
    comparepin: async(parent, args, context) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'comparepin',
            message: 'field is required'
          }]
        }
      } else {
        var verifyUser = await db_User.findOne({'pin': args.uniquepin});
        if(verifyUser || verifyUser !== null) {
          verifyUser.pin = `_${args.uniquepin}`;
          verifyUser.activated = true;
          var updatedUser = await verifyUser.save();
          if(updatedUser) {
            var token = jwt.sign({
              _id: updatedUser._id,
              username: updatedUser.username,
              usertype: updatedUser.privilege
            }, cert, { algorithm: 'RS256' });
            return {
              status: true,
              error: [],
              token: token
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'comparepin',
              message: 'wrong uniquepin pin'
            }]
          }
        }
      }
    },
    authorization: async(parent, args, context) => {
      if(_.isEmpty(args)) {
        return {
          status: false
        }
      } else {
        var current_user = jwt.verify(args.usertoken, certpub);
        console.log(current_user)
        var user = await db_User.findOne({'_id': current_user._id});
        if(user || user !== null) {
          return {
            status: true,
            usertype: user.privilege
          }
        } else {
          return {
            status: false
          }
        }
      }
    },
    loginuser: async(parent, args, context) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'loginuser',
            message: 'fields are required'
          }]
        }
      } else {
        var checkUser = await db_User.findOne({ $or: [{'username': args.identifier}, {'email': args.identifier}] });
        if(checkUser || checkUser !== null) {
          var match = await bcrypt.compare(args.password, checkUser.strhash);
          if(match) {
            var token = jwt.sign({
              _id: checkUser._id,
              username: checkUser.username,
              usertype: checkUser.privilege
            }, cert, { algorithm: 'RS256' });
            return {
              status: true,
              token: token,
              error: []
            }
          } else {
            return {
              status: false,
              error: [{
                path: 'loginusercheck',
                message: 'Wrong Identifier or Password'
              }]
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'loginusercheck',
              message: 'Wrong Identifier or Password'
            }]
          }
        }
      }
    },
    updateuser: async(parent, args, { current_user }) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'updateuser',
            message: 'please re-login'
          }]
        }
      } else {
        if(current_user._id === args.userID) {
          var user = await db_User.findOne({'_id': args.userID});
          if(user || user !== null) {
            if(user.username !== args.username) {
              user.username = user.username !== args.username ? args.username : user.username;
              user.fullname = user.fullname !== args.fullname ? args.fullname : user.fullname;
              user.email = user.email !== args.email ? args.email : user.email;
              user.address = user.address !== args.address ? args.address : user.address;
              user.phone = user.phone !== args.phone ? args.phone : user.phone;
              if(args.pprofile.length > 0) {
                if(user.photos.length > 0) {
                  cloudinary.uploader.destroy(user.photos[0].publicId);
                  await db_User.updateOne({'_id': args.userID}, {$pull: { photos: { '_id': user.photos[0]._id } }});
                }
                user.photos.push({
                  publicId: args.pprofile[0].publicId,
                  secureUrl: args.pprofile[0].secureUrl,
                  imgType: args.pprofile[0].imgType,
                });
              }
              var saveuser = await user.save();
              if(saveuser) {
                var token = jwt.sign({
                  _id: saveuser._id,
                  username: saveuser.username,
                  usertype: saveuser.privilege
                }, cert, { algorithm: 'RS256' });
                return {
                  status: true,
                  error: [],
                  token: token
                }
              }
            } else {
              user.username = user.username !== args.username ? args.username : user.username;
              user.fullname = user.fullname !== args.fullname ? args.fullname : user.fullname;
              user.email = user.email !== args.email ? args.email : user.email;
              user.address = user.address !== args.address ? args.address : user.address;
              user.phone = user.phone !== args.phone ? args.phone : user.phone;
              if(args.pprofile.length > 0) {
                if(user.photos.length > 0) {
                  cloudinary.uploader.destroy(user.photos[0].publicId);
                  await db_User.updateOne({'_id': args.userID}, {$pull: { photos: { '_id': user.photos[0]._id } }});
                }
                user.photos.push({
                  publicId: args.pprofile[0].publicId,
                  secureUrl: args.pprofile[0].secureUrl,
                  imgType: args.pprofile[0].imgType,
                });
              }
              var saveuser = await user.save();
              if(saveuser) {
                return {
                  status: true,
                  error: [],
                  token: ''
                }
              }
            }
          } else {
            return {
              status: false,
              error: [{
                path: 'updateuser',
                message: 'please re-login'
              }]
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'updateuser',
              message: 'please re-login'
            }]
          }
        }
      }
    },
    changepassword: async(parent, args, { current_user }) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'change_password',
            message: 'field cant be empty'
          }]
        }
      } else {
        var user = await db_User.findOne({'_id': args.userID});
        var match = await bcrypt.compare(args.oldpassword, user.strhash);
        if(match) {
          if(args.newpassword === args.confirmpassword && args.newpassword !== args.oldpassword) {
            var hashStr = await bcrypt.hash(args.newpassword, 12);
            user.strhash = hashStr;
            var saveuser = await user.save();
            if(saveuser) {
              return {
                status: true,
                error: []
              }
            }
          } else {
            return {
              status: false,
              error: [{
                path: 'change_password',
                message: 'Re-type password'
              }]
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'change_password',
              message: 'Wrong password'
            }]
          }
        }
      }
    },
    changeusertype: async(parent, args, { current_user }) => {
      if(!_.isEmpty(args)) {
        if(current_user || args.userID === current_user._id) {
          var user = await db_User.findOne({'_id': args.userID});
          if(user !== null) {
            if(user.merchant) {
              user.privilege = args.usertype;
            } else {
              var merchant = new db_Merchant();
              merchant.name = user.username;
              var savemerchant = await merchant.save();
              user.privilege = 'merchant';
              user.merchant = savemerchant._id;
            }
            var saveuser = await user.save();
            if(saveuser) {
              var token = jwt.sign({
                _id: saveuser._id,
                username: saveuser.username,
                usertype: saveuser.privilege
              }, cert, { algorithm: 'RS256' });
              return {
                status: true,
                token: token,
                error: []
              }
            }
          } else {
            return {
              status: false,
              error: [{
                path: 'changeusertype',
                message: 'user not found'
              }]
            }
          }
        } else {
          return {
            status: false,
            error: [{
              path: 'changeusertype',
              message: 'please re-login'
            }]
          }
        }
      } else {
        return {
          status: false,
          error: [{
            path: 'changeusertype',
            message: 'field are required'
          }]
        }
      }
    }
  }
}
