const express = require('express');
const exphbs  = require('express-handlebars');
const players = require('../models/players');
const game = require('../models/game');

const app = express();
module.exports = app;

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log("url"+socket.handshake.url);
  clientId=socket.handshake.query.clientId;
  console.log("connected clientId:"+clientId);
});


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', './views');
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
  if (game.state() == 'lobby') {
    res.render('game-lobby');
  } else {
    res.render('game-closed');
  }
});

app.post('/players', function(req, res) {
  if (game.state() != 'lobby') {
    return res.render('game-closed');
  }
  players.create(req.body, function(err, player) {
    if (err) {
      res.send(400, '/');
    } else {
      res.redirect('/game/players/' + player.id);
    }
  })
});

app.get('/players/:id', function(req, res) {
  players.get(req.params.id, function(err, player) {
    if (err) {
      res.redirect('/game');
    } else if (game.state() == 'lobby') {
      res.render('player-lobby', player);
    }
  });
});

app.post('/players/:id/answers/:number', function(req, res) {
  // save answer
  // 302 redirect to player
});
