module.exports = `
  type Stuff {
    _id             : ID!
    title           : String
    description     : String
    price           : String
    discountstatus  : Boolean
    photos          : [Photos]
    merchant        : Merchant
    manager         : User
    categori        : [Categori]
  }

  type Photos {
    _id             : ID
    secureUrl       : String
    publicId        : String
    imgType         : String
  }

  type reqResponse {
    status          : Boolean!
    error           : [Error]
    merchant        : Merchant
    stuff           : Stuff
  }

  input basestuff {
    userID          : ID!
    merchantID      : ID!
    stuffID         : ID
    title           : String
    description     : String
    price           : String
    upstatus        : String
  }

  input picture {
    publicId        : String
    secureUrl       : String
    imgType         : String
  }

  input categori {
    categoriID      : ID
  }

  type Mutation {
    usermerchant(userID: ID!): reqResponse!
    madestuff(basestuff: basestuff, picture: [picture], categori: [categori]): reqResponse!
    stuffpublish(userID: ID!, stuffID: ID!): reqResponse!
  }

`
