var _ = require('lodash');
var db_Niche = require('../models/db_niche');
var db_Categori = require('../models/db_categori');

module.exports = {
  Query: {

  },
  Niche: {
    categori: async(parent, args, {current_user}) => {
      if(current_user) {
        var categori = await db_Categori.find({'niche': parent._id});
        return categori
      }
    }
  },
  Mutation: {
    fetchniches: async(parent, args, { current_user }) => {
      if(_.isEmpty(args)) {
        return {
          status: false,
          error: [{
            path: 'fetchniches',
            message: 'please re-login'
          }]
        }
      } else {
        var niches = await db_Niche.find({});
        if(niches) {
          return {
            status: true,
            error: [],
            niches: niches
          }
        }
      }
    }
  }
}
