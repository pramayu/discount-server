module.exports = `
  type SubComment {
    _id         : ID!
    child       : String
    comment     : Comment
    user        : User
    merchant    : Merchant
  }

  type responseSubcomment {
    status      : Boolean!
    error       : [Error]
  }

  input subcommentprop {
    userID      : ID!
    subcommentID: ID
    commentID   : ID
    merchantID  : ID
    child       : String
  }

  type Mutation {
    reply_to_comment_stuff(subcommentprop: subcommentprop): responseSubcomment!
    delete_reply_comment(subcommentprop: subcommentprop): responseSubcomment!
  }
`
