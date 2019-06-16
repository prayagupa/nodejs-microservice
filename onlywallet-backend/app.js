
/**
 * Module dependencies.
 */

var express   = require('express');
var routes    = require('./routes');
var user      = require('./routes/user');
var http      = require('http');
var path      = require('path');

var app       = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

//var Mongoose  = require('mongoose');
//var db        = Mongoose.createConnection('localhost', 'onlywallet');
var util      = require('util');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

