module.exports = `
  type Categori {
    _id       : ID!
    child     : String
    niche     : ID
  }

  type Query {
    categori: [Categori!]
  }
`
