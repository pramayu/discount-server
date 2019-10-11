module.exports = `

  type DiscoverSchema {
    status      : Boolean
    stuffs      : [Stuff]
    merchants   : [Merchant]
  }

  input discoverProp {
    userID      : ID!
    latitude    : String
    longitude   : String
  }

  type Query {
    discovers(discoverProp: discoverProp): DiscoverSchema!
  }

`
