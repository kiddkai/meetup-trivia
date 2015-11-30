const sse = require('tiny-sse');
const connected = {};

module.attach = function(playerId, req, res) {
  connected[playerId] = {
    req: req,
    res: res
  };
};

module.send = function(playerId, eventName, data) {
  var p = connected[playerId];
  if (p) {
    sse.send({event: eventName, data: data})(req, res);
  }
};
