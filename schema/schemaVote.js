module.exports= `
  type Vote {
    _id         : ID!
    voter       : User
    stuff       : Stuff
  }

  type voteResponse {
    status      : Boolean!
    error       : [Error]
  }

  input voteprop {
    userID      : ID!
    stuffID     : ID
    voteID      : ID
  }

  type Mutation {
    add_vote_stuff(voteprop: voteprop): voteResponse!
    unvote_stuff(voteprop: voteprop): voteResponse!
  }
`
