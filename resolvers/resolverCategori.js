var db_Categori = require('../models/db_categori');

module.exports = {
  Query: {
    categori: async(parent, args, {current_user}) => {
      if(current_user || current_user._id) {
        var categori = await db_Categori.find();
        return categori;
        console.log(categori)
      }
    }
  }
}
