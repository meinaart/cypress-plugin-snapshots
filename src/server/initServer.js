const http = require('http');
const socketio = require('socket.io');
const { GET_SPEC, SET_SPEC, SAVE_TEXT, SAVE_IMAGE } = require('./actions');
const { saveSnapshot } = require('../utils/tasks/textSnapshots');
const { saveImageSnapshot } = require('../utils/tasks/imageSnapshots');

function initServer(config) {
  const server = http.createServer();
  const io = socketio(server);
  let spec = {};

  io.on('connection', (client) => {
    const { token } = client.handshake.query;

    if (config.serverEnabled) {
      client.on(SAVE_IMAGE, (data) => {
        if (token === config.token) {
          saveImageSnapshot(data);
        }
      });

      client.on(SAVE_TEXT, (data) => {
        if (token === config.token) {
          saveSnapshot(data);
        }
      });
    }

    client.on(GET_SPEC, (fn) => {
      if (token === config.token) {
        fn(spec);
      }
    });

    client.on(SET_SPEC, (newSpec) => {
      if (token === config.token) {
        spec = newSpec;
      }
    })
  });

  server.listen(config.serverPort, config.serverHost);
}

module.exports = initServer;
