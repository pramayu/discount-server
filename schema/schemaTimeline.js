module.exports =`
  type TimelineSchema {
    status        : Boolean!
    merchant      : [Merchant]
    stuffs        : [Stuff]
  }

  input timelineProp {
    userID      : ID!
    latitude    : String
    longitude   : String
  }

  type Query {
    timeline(timelineProp: timelineProp): TimelineSchema!
    usertimeline(userID: ID!): User
  }
`
