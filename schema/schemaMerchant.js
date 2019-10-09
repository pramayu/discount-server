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
    niche       : Niche
    rules       : [Rules]
    facilities  : [Facilities]
    stuffs      : [Stuff]
  }

  type Photo {
    _id         : ID
    publicId    : String
    secureUrl   : String
    imgType     : String
  }

  type Rules {
    _id         : ID!
    child       : String
  }

  type Facilities {
    _id         : ID!
    child       : String
  }

  type merchantRespon {
    status      : Boolean!
    error       : [Error!]
    location    : Location
    rules       : [Rules]
    facilities  : [Facilities]
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
    indexID     : String
  }

  input categoriprop {
    userID      : ID!
    merchantID  : ID!
    nicheID     : ID!
  }

  input ruleprop {
    child      : String
  }

  input ruledeleteprop {
    userID      : ID!
    merchantID  : ID!
    ruleID      : ID!
  }

  input facilitiprop {
    child       : String
  }

  input facilitideleteprop {
    userID      : ID!
    merchantID  : ID!
    facilitiID  : ID!
  }

  type Mutation {
    basicupdatemerchant(basicupdateprop: basicupdateprop, imageupload: [imageupload]): merchantRespon!
    addressupdatemerchant(addressupdateprop: addressupdateprop): merchantRespon!
    addressdelete(addressdeleteprop: addressdeleteprop): merchantRespon!
    choosecategori(categoriprop: categoriprop): merchantRespon!
    addrules(userID: ID!, merchantID: ID!, ruleprop: [ruleprop]): merchantRespon!
    ruledelete(ruledeleteprop: ruledeleteprop): merchantRespon!
    addfaciliti(userID: ID!, merchantID: ID!, facilitiprop: [facilitiprop]): merchantRespon!
    deletefaciliti(facilitideleteprop: facilitideleteprop): merchantRespon!
  }

`
