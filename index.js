var fs = require('fs');
var path = require('path');
var compression = require('compression');
var express = require('express');
var bodyParser = require('body-parser');
var { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
var { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
var mongoose = require('mongoose');
var logger = require('morgan');
require('dotenv').config();
var typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
var resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));
var schema = makeExecutableSchema({ typeDefs, resolvers });

var app = express();

mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true, useCreateIndex: true});

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());

var currentuser = (req, res, next) => {
  var authorization = req.headers['authorization'];
  if(authorization) {
    var token = authorization.split(' ')[1];
    if(token.length > 0) {
      var user = jwt.verify(token, cert);
      req.current_user = user;
    }
  }
  next();
};
app.use(currentuser);

var server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    current_user: req.current_user
  })
});
server.applyMiddleware({ app });

app.listen(process.env.PORT || 3000, () => {
  console.log('server is running on port 127.0.0.1:3000');
});
