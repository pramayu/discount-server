module.exports = `
  type Stuff {
    _id             : ID!
    title           : String
    description     : String
    price           : String
    discountstatus  : Boolean
    thumbnails      : [Thumbnail]
    merchant        : Merchant
    manager         : User
  }

  type Thumbnail {
    _id             : ID!
    secureUrl       : String
    publicId        : String
    imgType         : String
  }

  type reqResponse {
    status          : Boolean!
    error           : [Error]
    merchant        : Merchant
  }

  type Mutation {
    usermerchant(userID: ID!): reqResponse!
  }

`
