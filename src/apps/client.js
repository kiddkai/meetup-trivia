const express = require('express');
const exphbs  = require('express-handlebars');
const players = require('../models/players');
const game = require('../models/game');

const app = express();
module.exports = app;

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
  players.create(req.body, function(err, player) {
    if (err) {
      res.send(400, '/');
    } else {
      res.redirect('/player/' + player.id);
    }
  })
});

app.get('/players/:id', function(req, res) {
  res.render('player', {
    name: 'Bob',
    score: 12
  });
  // render page for player
  // several possible states, could each be different views
  // - waiting in lobby
  // - question (with optional answer chosen)
  // - answer time
  // - won
  // - lost
});

app.post('/players/:id/answers/:number', function(req, res) {
  // save answer
  // 302 redirect to player
});
