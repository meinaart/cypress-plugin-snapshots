const { GET_SPEC } = require('./actions');
const getClientSocket = require('./getClientSocket');

async function getSpec(config) {
  return new Promise((resolve) => {
    getClientSocket(config).emit(GET_SPEC, (spec) => {
      resolve(spec);
    });
  });
}

module.exports = getSpec;
