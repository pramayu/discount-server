module.exports = `
  type Cart {
    _id       : ID!
    stuffs    : [Stuff]
    user      : User
  }

  type cartResponse {
    status    : Boolean!
    error     : [Error!]
    cart      : Cart
  }

  input usercartprop {
    userID: ID!
    stuffID: ID!
  }

  type Query {
    get_user_cart(usercartprop: usercartprop): cartResponse!
  }

  type Mutation {
    add_to_cart(userID: ID!, stuffID: ID!): cartResponse!
  }
`
