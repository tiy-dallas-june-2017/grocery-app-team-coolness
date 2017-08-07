const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      expressValidator = require('express-validator'),
      mongo = require('./mongo'),
      mustacheExpress = require('mustache-express')
      session = require('express-session');

const router = require('./routes/routes');

let port = process.env.PORT || 3000;
let url = 'mongodb://localhost:27017/grocery_stock';

let mustacheInstance = mustacheExpress();
mustacheInstance.cache = null;
app.engine('mustache', mustacheInstance);

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(express.static('public'));
app.use('/', router);

mongo.connect(url, (err, db) => {
  if (err) {
    console.log(err);
    throw err;
  } else {
    app.listen(port, () => {
      console.log(`Your app is running on PORT ${ port }.`);
    });
  }
})
