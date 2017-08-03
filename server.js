const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mustacheExpress = require('mustache-express');

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Your app is running on PORT ${ port }.`);
});
