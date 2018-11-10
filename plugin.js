
const { initConfig, CONFIG_KEY } = require('./config');
const { initServer } = require('./save-server');
const tasks = require('./tasks/index');

/**
 * Initializes the plugin:
 * - registers tasks for `toMatchSnapshot`.
 * - Make config accessible via `Cypress.env`.
 * @param {Function} on - Method to register tasks
 * @param {Object} globalConfig - Object containing global Cypress config
 */
function initPlugin(on, globalConfig = {}) {
  const config = initConfig(globalConfig.env[CONFIG_KEY]);
  initServer(config);

  // Adding objects/keys to `Cypress.env` that don't exist doesn't work.
  // That's why the config is stringifed and parsed again in `commands.js#fixConfig`.
  globalConfig.env[CONFIG_KEY] = JSON.stringify(config);

  on('task', tasks);
}

module.exports = {
  initPlugin
};
