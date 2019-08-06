module.exports =`
  type Merchant {
    _id         : ID!
    name        : String
    description : String
    foodtype    : String
    sosmed      : String
    phone       : String
    photos      : [Photo]
    location    : [Location]
    niche       : [Niche]
  }

  type Coordinate {
    _id         : ID
    latitude    : String
    longitude   : String
  }

  type Location {
    _id         : ID
    address     : String
    province    : String
    distric     : String
    coordinate  : [Coordinate]
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
    location    : [Location]
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

  input addressupdateprop {
    merchantID  : ID!
    userID      : ID!
    locationID  : ID
    indexID     : String
    address     : String
    distric     : String
    province    : String
    latitude    : String
    longitude   : String
  }

  input addressdeleteprop {
    userID      : ID!
    merchantID  : ID!
    locationID  : ID!
  }

  type Mutation {
    basicupdatemerchant(basicupdateprop: basicupdateprop, imageupload: [imageupload]): merchantRespon!
    addressupdatemerchant(addressupdateprop: addressupdateprop): merchantRespon!
    addressdelete(addressdeleteprop: addressdeleteprop): merchantRespon!
  }

`
