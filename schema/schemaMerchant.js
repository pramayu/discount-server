module.exports =`
  type Merchant {
    _id         : ID!
    name        : String
    coordinate  : Coordinate
    address     : String
    districs    : String
    province    : String
    description : String
    foodtype    : String
    sosmed      : String
    phone       : String
    photos      : [Photo]
  }

  type Coordinate {
    latitude    : String
    longitude   : String
  }

  type Photo {
    _id         : ID
    publicId    : String
    secureUrl   : String
    imgType     : String
  }

  type merchantRespon {
    status      : Boolean!
    error       : [Error!]
  }

  input basicupdateprop {
    merchantID  : ID!
    userID      : ID!
    name        : String
    phone       : String
    sosmed      : String
    description : String
  }

  input imageupload {
    publicId    : String
    secureUrl   : String
    imgType     : String
  }

  type Mutation {
    basicupdatemerchant(basicupdateprop: basicupdateprop, imageupload: [imageupload]): merchantRespon!
  }

`
