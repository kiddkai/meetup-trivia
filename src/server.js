const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', './views');
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
  res.render('player-lobby');
});

const sse = require('tiny-sse');
app.get('/player/:id', sse.head(), sse.ticker({seconds: 15}), function(req, res) {
  setInterval(function() {
    const data = {
      id: Math.floor(Math.random()*100),
      question: Math.floor(Math.random()*100),
      answer: 'B'
    };
    sse.send({event: 'status', data: data})(req, res);
  }, 1000);
  // req.end();
});

// presenter should have BasicAuth
// app.use('/game', require('./apps/client'));
// app.use('/presenter', require('./apps/presenter'));

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});


// var io = socketio.listen(server);
// io.on('connection', function(socket){
//   console.log("url"+socket.handshake.url);
//   clientId=socket.handshake.query.clientId;
//   console.log("connected clientId:"+clientId);
// });
//
