  const getClientSocket = require('./getClientSocket');
  const { SET_SPEC } = require('./actions');

  // Store spec in save server
  function setSpec(config, spec) {
    getClientSocket(config).emit(SET_SPEC, spec);
  }

  module.exports = setSpec;
