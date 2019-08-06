var _ = require('lodash');
var db_Niche = require('../models/db_niche');

module.exports = {
  Query: {

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
