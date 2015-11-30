const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', './views');
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('player', {
    name: 'Bob',
    score: 12
  });
});

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
