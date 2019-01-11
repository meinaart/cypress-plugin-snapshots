const {
  initPlugin
} = require('cypress-plugin-snapshots/plugin');

module.exports = (on, config) => {
  initPlugin(on, config);

  const port = process.env.CYPRESS_TESTSERVER_PORT;
  if (port) {
    config.baseUrl = config.baseUrl.replace(':8080', `:${port}`)
  }

  return config;
}
