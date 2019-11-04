/**A simple node/express server that include communication with a 
 * mysql db instance. 
*/

//create main objects
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const mysql = require('mysql');
var path = require('path');
var crypto = require('crypto');

//create the mysql connection object.  
var connection = mysql.createConnection({
  //db is the host and that name is assigned based on the 
  //container name given in the docker-compose file
  host: 'backend-db',
  port: '3306',
  user: 'user',
  password: 'password',
  database: 'db'
});

//set up some configs for express. 
const config = {
  name: 'backend',
  port: 8000,
  host: '0.0.0.0',
};

//create the express.js object
const app = express();
var Strategy = require('passport-local').Strategy;
//create objects for sessions
const passport = require('passport');
const flash = require('connect-flash');
LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
app.use(session({
  secret: 'Text goes here',
  resave: true,
  saveUninitialized: true
}));

passport.use(new Strategy(
  function(username, password, cb) {
    connection.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.serializeUser(function(user, done){
  done(null, user.id);
});

//create a logger object.  Using logger is preferable to simply writing to the console. 
const logger = log({ console: true, file: false, label: config.name });

app.use(express.urlencoded({ extended: true })); // express body-parser
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));

//Attempting to connect to the database.
connection.connect(function (err) {
  if (err)
    logger.error("Cannot connect to DB! " + err.message);
  else
    logger.info("Connected to the DB!");
});


/**     REQUEST HANDLERS        */
//GET /
app.get('/', (req, res) => {
  res.status(200).send('Go to localhost:8000/setupdb');
});

//GET /setupdb
app.get('/setupdb', (req, res) => {
  connection.query('CREATE TABLE IF NOT EXISTS accounts(id INT(10) NOT NULL AUTO_INCREMENT, firstName varchar(50), lastName varchar(50), email varchar(100), password varchar(255), PRIMARY KEY(id))', function (err, rows, fields) {
    if (err)
      logger.error("Can't make table " + err.message);
    else
      logger.info('table created');
  });
  connection.query("insert into accounts values ('0000000000','Jaymie', 'Ruddock','jprudd@smu.edu', 'testpwd')", function(err, rows, fields) {  
    if(err)
        logger.error('adding row to table failed ' + err.message);
    else
      logger.info('added values to table');
  });
  res.status(200).send('created the table');
});

//GET /checkdb
app.get('/checkdb', (req, res) => {
  //execute a query to select * from table named data. 
  connection.query('SELECT * from accounts', function (err, rows, fields) {
    if (err) {
      logger.error("Error while executing Query");
    };
    logger.info(rows[0].name + ' ' + rows[0].id);
 
    //writing to the response object
    res.type('text/html');
    res.status(200);
    res.send('<h1>' + rows[0].id + ' ' + rows[0].firstname + ' ' + rows[0].lastname + ' ' +rows[0].email + ' ' + rows[0].password + '</h1>');
  })
});

app.get('/login', function(request, response) {
  response.sendFile(path.join(__dirname + '/login.html'));
  
});

app.get('/register', function(request, response)  {
  response.sendFile(path.join(__dirname + '/register.html')); 
});

app.post('/reg', function(request, response) {
  var firstname = request.body.firstname;
  var lastname = request.body.lastname;
	var email = request.body.email;
  var password = request.body.password;
  var hashed_hex = crypto.createHash('sha224', password);
  var hashed_password = hashed_hex.digest('string');
	if (email && password) {
		connection.query('insert into accounts (firstName, lastName, email, password) values (?, ?, ?, ?)', [firstname, lastname, email, hashed_password], function(error, results, fields) {
      logger.info(results);
      request.session.loggedin = true;
			request.session.username = email;
      response.redirect('/home');
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}
});

app.post('/auth', function(request, response) {
	var email = request.body.email;
  var password = request.body.password;
  var hashed_hex = crypto.createHash('sha224', password);
  var hashed_password = hashed_hex.digest('string');
	if (email && password) {
		connection.query('SELECT * FROM accounts WHERE email = ? AND password = ?', [email, hashed_password], function(error, results, fields) {
			if (results.length > 0) {
        logger.info(results)
        request.session.loggedin = true;
				request.session.username = results.body.firstName;
				response.redirect('/home');
			} else {
        //something about incorrect password or username
        return res.status(400).send({ 
          message : "Wrong Password"
        });
			}			
			response.end();
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
    logger.info(request.session);
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

//connecting the express object to listen on a particular port as defined in the config object. 

app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
}); 



