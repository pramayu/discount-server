module.exports =`
  type Niche {
    _id       : ID!
    child     : String!
  }

  type Query {
    niches: [Niche!]
  }

  type nicheRespon {
    status    : Boolean!
    error     : [Error]
    niches    : [Niche!]
  }

  type Mutation {
    fetchniches(userID: ID!): nicheRespon!
  }
`
