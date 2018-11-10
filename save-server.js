const http = require('http');
const socketio = require('socket.io');
const { SAVE } = require('./tasks/task-names');
const { saveSnapshot } = require('./utils/plugin');

function initServer(config) {
  if (!config.serverEnabled) {
    return;
  }

  const server = http.createServer();
  const io = socketio(server);

  io.on('connection', (client) => {
    const { token } = client.handshake.query;
    client.on(SAVE, (data) => {
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
