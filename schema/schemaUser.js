module.exports =`
  type User {
    _id: ID!
    username: String
    email: String
    phone: String
    address: String
    fullname: String
    privilege: String
  }

  type userquery {
    status: Boolean!
    user: User
    error: [Error!]
  }

  type Query {
    user(userID: ID!): userquery!
  }

  type usermutation {
    status: Boolean!
    error: [Error!]
    token: String
    usertype: String
  }

  type Mutation {
    createuser(username: String!, email: String!, phone: String!, password: String): usermutation!
    loginuser(identifier: String!, password: String!): usermutation!
    comparepin(uniquepin: String!): usermutation!
    authorization(usertoken: String): usermutation!
    updateuser(userID: ID!, username: String, email: String, phone: String, fullname: String, address: String): usermutation!
  }
`
