const { SAVE } = require('./constants');
const { saveSnapshot } = require('./plugin-utils');

function initServer(config) {
  if (!config.serverEnabled) {
    return;
  }

  const server = require('http').createServer();
  const io = require('socket.io')(server);

  io.on('connection', function(client) {
    let token = client.handshake.query.token;
    client.on(SAVE, function(data) {
      if (token === config.token) {
        saveSnapshot(data);
      }
    });
  });

  server.listen(config.serverPort, config.serverHost);
}

module.exports = {
  initServer,
};