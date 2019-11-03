module.exports = `
  type Comment {
    _id         : ID!
    child       : String!
    createAt    : String
    user        : User
    stuff       : Stuff
    rate        : RateStore
    subcomment  : [SubComment]
  }

  input commentprop {
    child       : String
    stuffID     : ID!
    userID      : ID!
    rate        : String
    merchantID  : ID
    commentID   : ID
  }

  type commentResponse {
    status      : Boolean!
    error       : [Error]
    comment     : Comment
  }

  type Query {
    comment_stuff(commentprop: commentprop): [Comment]!
  }

  type Mutation {
    comment_to_stuff(commentprop: commentprop): commentResponse!
    edit_comment_stuff(commentprop: commentprop): commentResponse!
    delete_comment_stuff(commentprop: commentprop): commentResponse!
  }
`
