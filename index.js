var path = require('path');
var compression = require('compression');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
require('dotenv').config();

var app = express();

mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true, useCreateIndex: true});

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());


app.listen(process.env.PORT || 3000, () => {
  console.log('server is running on port 127.0.0.1:3000');
});
