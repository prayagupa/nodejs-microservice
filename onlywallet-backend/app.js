
/**
 * Module dependencies.
 */

var express   = require('express');
var routes    = require('./routes');
var user      = require('./routes/user');
var http      = require('http');
var path      = require('path');

var app       = express();

var Mongoose  = require('mongoose');
var db        = Mongoose.createConnection('localhost', 'onlywallet');
var util      = require('util');
var braintree = require("braintree");

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get("/pay", function (req, res) {
  res.render("braintree.ejs");
});

app.post("/create_transaction", function (req, res) {
  var saleRequest = {
    amount: "1000.00",
    creditCard: {
      number: req.body.number,
      cvv: req.body.cvv,
      expirationMonth: req.body.month,
      expirationYear: req.body.year
    },
    options: {
      submitForSettlement: true
    }
  };

  gateway.transaction.sale(saleRequest, function (err, result) {
    if (result.success) {
      res.send("<h1>Success! Transaction ID: " + result.transaction.id + "</h1>");
    } else {
      res.send("<h1>Error:  " + result.message + "</h1>");
    }
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var gateway = braintree.connect({
	  environment: braintree.Environment.Sandbox,
      merchantId: "useYourMerchantId",
      publicKey: "useYourPublicKey",
      privateKey: "useYourPrivateKey"
});


