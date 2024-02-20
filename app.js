const express = require('express'); 
const path = require('path');
const configRoutes = require('./routes');
const cookieParser = require("cookie-parser");
const session = require("express-session")
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');

const static = express.static(__dirname + '/public');
const app = express();


const handlebarsInstance = exphbs.create({
	defaultLayout: 'main',
	// Specify helpers which are only registered on this instance.
	helpers: {
	  asJSON: (obj, spacing) => {
		if (typeof spacing === 'number')
		  return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
  
		return new Handlebars.SafeString(JSON.stringify(obj));
	  }
	},
	partialsDir: ['views/partials/']
  });

  const rewriteUnsupportedBrowserMethods = (req, res, next) => {
	// If the user posts to the server with a property called _method, rewrite the request's method
	// To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
	// rewritten in this middleware to a PUT route
	if (req.body && req.body._method) {
	  req.method = req.body._method;
	  delete req.body._method;
	}
  
	// let the next middleware run:
	next();
  };


  const mongoose = require("mongoose");
  mongoose.connect('mongodb://localhost/anime',{
	  useNewUrlParser:true,useUnifiedTopology: true
  })
  
  const db = mongoose.connection;
  
  app.use(express.urlencoded({extended: true}))
  app.use(cookieParser());
  
  app.use(session({
	  name: 'AuthCookie',
	  secret: 'some secret string!',
	  resave: false,
	  saveUninitialized: true
  }));
  
  const isUserlogin = function (req) {
	  return !!req.session.user;
  };
  
  
  app.use(function (req, res, next) {
	  console.log(
		  `${req.method}\t${req.originalUrl}\t${
		  isUserlogin(req) ? 'User Authenticated' : 'User not Authenticated'
	  }:[${new Date().toUTCString()}]`
	  );
	  next();
	  });
  
  

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});


