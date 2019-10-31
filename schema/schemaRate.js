module.exports = `
  type RateStore {
    _id       : ID!
    scale     : String!
    user      : User
    merchant  : Merchant
  }
`
