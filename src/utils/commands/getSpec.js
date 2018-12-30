const getSpecFromServer = require('../../server/getSpec');
const getConfig = require('./getConfig');

async function getSpec() {
  if (Cypress.spec.absolute === '__all') {
    return getSpecFromServer(getConfig());
  }

  return Promise.resolve(Cypress.spec);
}

module.exports = getSpec;
