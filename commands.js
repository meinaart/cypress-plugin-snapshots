/* globals Cypress, before, after, cy */
/* eslint-env browser */
const { initUi, closeSnapshotModals } = require('./src/ui/ui');
const commands = require('./src/commands/index');
const cleanUpSnapshots = require('./src/utils/commands/cleanupSnapshots');
const { NO_LOG } = require('./src/constants');
const { CLEANUP_FOLDERS } = require('./src/tasks/taskNames');
const { initConfig, CONFIG_KEY, mergeConfig } = require('./src/config');

function addCommand(commandName, method) {
  Cypress.Commands.add(commandName, {
    prevSubject: true
  }, (commandSubject, taskOptions) => {
    if (commandSubject === undefined) {
      return commandSubject;
    }

    return cy.wrap(commandSubject, NO_LOG)
      .then((subject) => method(subject, mergeConfig(commandName, taskOptions)));
  });
}

function initCommands() {
  // Initialize config
  const config = initConfig(Cypress.env(CONFIG_KEY));
  Cypress.env(CONFIG_KEY, config);

  if (!Cypress.browser.isHeadless) {

    // Inject CSS & JavaScript
    before(() => {
      initUi();

      // Close snapshot modal before all test restart
      closeSnapshotModals();
    });
  }

  function clearFileCache() {
    Cypress.__readFileCache__ = {}; /* eslint-disable-line no-underscore-dangle */
  }

  // Close snapshot modal and reset image files cache before all test restart
  Cypress.on('window:before:unload', () => {
    clearFileCache();
  });

  // Add test icons and clean up unused snapshots
  after(() => {
    cleanUpSnapshots();
    cy.task(CLEANUP_FOLDERS, Cypress.config('screenshotsFolder'), NO_LOG).then(console.log);
  });

  // Add commands
  Object.keys(commands).forEach(key => addCommand(key, commands[key]));
}

module.exports = {
  initCommands
};

if (!process.env.JEST_WORKER_ID) {
  initCommands();
}
