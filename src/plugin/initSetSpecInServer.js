const browserify = require('@cypress/browserify-preprocessor');
const path = require('path');
const setSpec = require ('../server/setSpec');

// Cache for specs objects
const specs = {};

/**
 * `Cypress.spec` is incorrect when user clicks on "Run all specs".
 * Code below stores a `Cypress.spec` like object in the server.
 * `getSpec` returns a promise that resolves with a correct `Cypress.spec` object.
 */
function initSetSpecInServer(on, config) {
  const defaultPreprocessor = browserify();

  // A bit of a hack, abusing this event to know
  // which spec file is actually run by Cypress.
  on('file:preprocessor', (file) => {
    const { filePath, shouldWatch } = file;
    if (shouldWatch) {
      setSpec(config, createSpec(filePath));
    }

    // Make sure default preProcessor is called otherwise Cypress breaks
    // with error "Unexpected string"
    return defaultPreprocessor(file);
  });
}

function createSpec(filePath) {
  if (!specs[filePath]) {
    const spec = {};
    spec.absolute = filePath;
    spec.name = path.basename(filePath);
    spec.relative = path.relative(process.cwd(), filePath);
    specs[filePath] = spec;
  }

  return specs[filePath];
}

module.exports = initSetSpecInServer;
