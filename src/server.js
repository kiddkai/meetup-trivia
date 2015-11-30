const express = require('express');
const exphbs = require('express-handlebars');
const sse = require('tiny-sse');
const game = require('./models/game');
const players = require('./models/players');
const sockets = require('./models/sockets');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', './views');
app.set('view engine', 'handlebars');

//
// Lobby (player not logged in)
//
app.get('/', function(req, res) {
  if (game.state() == 'lobby') {
    res.render('game-lobby');
  } else {
    res.render('game-closed');
  }
});

//
// Create a player
//
app.post('/players', function(req, res) {
  if (game.state() != 'lobby') {
    return res.render('game-closed');
  }
  players.create(req.body, function(err, player) {
    if (err) {
      res.send(400, '/');
    } else {
      res.redirect('/players/' + player.id);
    }
  })
});

//
// Player logged in
// All different states handled client-side
//
app.get('/players/:id', sse.head(), sse.ticker({seconds: 15}), function(req, res) {
  players.get(req.params.id, function(err, player) {
    if (err) res.redirect('/');
    else res.render('game-inplay');
  });
});

//
// SSE stream for player updates
//
app.get('/players/:id/events', sse.head(), sse.ticker({seconds: 15}), function(req, res) {
  players.get(req.params.id, function(err, player) {
    if (err) return res.send(400);
    sockets.attach(req.params.id, req, res);
  });
});

//
// Player choosing an answer
//
app.post('/players/:id/answers/:question', function(req, res) {
  players.get(req.params.id, function(err, player) {
    if (err) return res.send(400);
    // TODO: save the answer
    sendPlayerState(player);
  })
});

app.post('/game/start', function(req, res) {
  game.start();
  updateAllPlayers();
});

function sendAllStates() {
  // for each player: sendPlayerState
}

function sendPlayerState(player) {
  // TODO: merge game state and player state
  const status = {
    score: 20,
    question: 4,
    choice: 'B',
    answer: null
  };
  sockets.send(player.id, 'status', status);
}

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
