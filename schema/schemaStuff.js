module.exports = `
  type Stuff {
    _id             : ID!
    title           : String
    description     : String
    price           : String
    discountstatus  : Boolean
    stuffstatus     : Boolean
    photos          : [Photos]
    merchant        : Merchant
    manager         : User
    categori        : [Categori]
    discounts       : [Discount]
    vote            : [Vote]
  }

  type Photos {
    _id             : ID
    secureUrl       : String
    publicId        : String
    imgType         : String
  }

  type mtnResponse {
    status          : Boolean!
    error           : [Error]
    merchant        : Merchant
    stuff           : Stuff
  }

  type queryResponse {
    status          : Boolean!
    stuffs          : [Stuff]
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
    _id             : ID
    publicId        : String
    secureUrl       : String
    imgType         : String
  }

  input categori {
    categoriID      : ID
  }

  type Query {
    getstuffs(userID: ID!): queryResponse!
    stuff(stuffID: ID!): queryResponse!
  }

  type Mutation {
    usermerchant(userID: ID!): mtnResponse!
    madestuff(basestuff: basestuff, picture: [picture], categori: [categori]): mtnResponse!
    stuffpublish(userID: ID!, stuffID: ID!): mtnResponse!
    unsetcategori(userID: ID!, stuffID: ID!, categoriID: ID!): mtnResponse!
    unusedpicture(userID: ID!, stuffID: ID, picture: [picture]): mtnResponse!
  }

`
