module.exports = `
  type Comment {
    _id       : ID!
    child     : String!
    createAt  : String
    user      : User
    stuff     : Stuff
  }

  input commentprop {
    child     : String
    stuffID   : ID!
    userID    : ID!
  }

  type commentResponse {
    status    : Boolean!
    error     : [Error]
    comment   : Comment
  }

  type Query {
    comment_stuff(commentprop: commentprop): [Comment]!
  }

  type Mutation {
    comment_to_stuff(commentprop: commentprop): commentResponse!
  }
`
