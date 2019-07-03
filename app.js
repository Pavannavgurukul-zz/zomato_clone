// here I am using the file of database connection named knexfile.
const knex = require('./knexfile');

//here I am inporting the date module
// const date = require('date-and-time');
var datetime = new Date();
var today = datetime.toISOString().slice(0, 10);
// creating the server for routing.
const express = require('express');
var app = express();
app.use(express.json());


// here we are using the data for Json Web Token.
const jwt = require('jsonwebtoken');
// const config = require('./config');
// const middleware = require('./middleware');


// here I am using the ejs syntex for connection to node js
const ejs = require('ejs');
app.set('view engine', 'ejs');

// using the static files.....
app.use(express.static("public"));

// using the body-parser for parse the data from html form as a middleware.
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

// this is for only testing the zomato api.
var zomato = require('zomato');
var client = zomato.createClient({
  userKey: process.env.API_KEY, //as obtained from [Zomato API](https://developers.zomato.com/apis)
});

// creating endpoint for the main page....
var home = express.Router();
app.use('/home', home)
require('./routes/home')(home,express);

// creating the routes for get and post the data for customers.
var customers = express.Router();
app.use('/customers', customers)
require('./routes/customers')(customers, knex, today, jwt);

// here  I am creating the route for zomato api
var zomato = express.Router();
app.use('/search', zomato)
require('./routes/zomato')(zomato, client);

app.listen(process.env.PORT);
