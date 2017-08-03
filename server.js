const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mustacheExpress = require('mustache-express');

const router = require('./routes/routes');

let port = process.env.PORT || 3000;

let mustacheInstance = mustacheExpress();
mustacheInstance.cache = null;
app.engine('mustache', mustacheInstance);

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(express.static('public'));
app.use('/', router);

app.listen(port, () => {
  console.log(`Your app is running on PORT ${ port }.`);
});
