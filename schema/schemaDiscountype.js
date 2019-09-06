module.exports =`
  type Discountype {
    _id: ID!
    child: String
  }

  type Query {
    discountypes: [Discountype!]
  }

`
