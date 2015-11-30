const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.redirect('/game');
});

// presenter should have BasicAuth
app.use('/game', require('./apps/client'));
app.use('/presenter', require('./apps/presenter'));

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
