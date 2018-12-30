  const io = require('socket.io-client');

  function getClientSocket(config) {
    return io(`http://${config.serverHost}:${config.serverPort}`, {
      query: {
        token: config.token
      }
    });
  }

  module.exports = getClientSocket;
