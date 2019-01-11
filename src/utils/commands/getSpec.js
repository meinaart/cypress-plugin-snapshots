async function getSpec() {
  if (Cypress.spec.absolute === '__all') {
    throw new Error(`cypress-plugin-snapshots does not work when running all tests, this will be fixed once this bug is resolved: https://github.com/cypress-io/cypress/issues/3090`);
  }

  return Promise.resolve(Cypress.spec);
}

module.exports = getSpec;
