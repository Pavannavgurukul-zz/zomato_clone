// using the body-parser for parse the data from html form as a middleware.
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

const env = require('dotenv');
env.config()

// importing Node mailer 
var nodemailer = require('nodemailer');
// here i am requiring the coockes parser.
// const cookies = require('cookie-parser');


// here  I am exporting the main customer data file to app.js(main server file).
module.exports = function(customers, knex, today,jwt) {


    //this is demo path for the main sign uo form
    customers.get('/register', (request, response, next) => {
      response.render('register');
    });

    customers.get('/login', (request, response, next) => {
      return response.render('login');
    });
    
  // Sign In in the shopping
  customers.post('/login',urlencodedParser,(request, response, next) => {
    var email = request.body.email;
    console.log(email)
    var password = request.body.psw;
    console.log(password)
    var query = knex('users').where('email',email).select('*').then((loginData) => {

      // return response.json(loginData)
        if(email === loginData[0].email && password === loginData[0].password){
          return response.render('datafile');
          return response.send("you are logged in ....congo!")
        }
        else{
          response.send("please chech your email and password")
        }
      });
  });



    // here I am getting the all users details.
    customers.get('/all', (request, response, next) => {
      var query = knex('users').select('*').then((data) => {
        console.log(data);
        return response.json(data)
      })
    });

    // here I am adding new user in my database.
    customers.post('/register', urlencodedParser, (request, response, next) => {
          var user = {
            username: request.body.username,
            email: request.body.email,
            password: request.body.psw,
            date: today,
            verified: 0
          }
          console.log(user.email);
          var insertQuery = knex('users').insert(user).then(() => {
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.MAIL_PASS
              }
            });

            var mailOptions = {
              from: process.env.EMAIL_ID,
              to: request.body.email,
              subject: 'Sending Email using Node.js',
              text: "Verify Your"
            };

            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                response.send("check your mail box for verification")
                console.log('Email sent: ' + info.response);
            }
        });
    });
  });
}






   