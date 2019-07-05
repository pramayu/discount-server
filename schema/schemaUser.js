module.exports =`
  type User {
    _id: ID!
    username: String
  }

  type Query {
    users: [User!]
  }

  type useresponse {
    status: Boolean
    error: [Error!]
  }

  type Mutation {
    createuser(username: String!, email: String!, phone: String!, password: String): useresponse!
  }
`
