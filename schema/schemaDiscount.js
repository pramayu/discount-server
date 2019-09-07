module.exports=`
  type Discount {
    _id             : ID!
    enddate         : String!
    startdate       : String!
    discountype     : Discountype
    discount        : String!
    quantity        : String
    status          : Boolean
    stuff           : Stuff
  }


  type Query {
    discounts(stuffID: ID!): [Discount!]
  }

  type responseMutation {
    status          : Boolean!
    error           : [Error!]
    discount        : Discount
  }

  input reqdiscount {
    stuffID         : ID!
    userID          : ID!
    discountypeID   : ID!
    enddate         : String!
    startdate       : String
    discount        : String!
    quantity        : String
  }

  type Mutation {
    madediskon(reqdiscount: reqdiscount): responseMutation!
  }
`
