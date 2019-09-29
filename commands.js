/* globals Cypress, before, after, cy */
/* eslint-env browser */
const { merge, cloneDeep } = require('lodash');
const { initUi, closeSnapshotModals } = require('./src/ui');
const commands = require('./src/commands/index');
const cleanUpSnapshots = require('./src/utils/commands/cleanupSnapshots');
const getConfig = require('./src/utils/commands/getConfig');
const { NO_LOG } = require('./src/constants');
const { CLEANUP_FOLDERS } = require('./src/tasks/taskNames');

function addCommand(commandName, method) {
  Cypress.Commands.add(commandName, {
    prevSubject: true
  }, (commandSubject, taskOptions) => {
    if (!commandSubject) {
      return commandSubject;
    }

    const options = merge({}, cloneDeep(getConfig()), taskOptions);
    return cy.wrap(commandSubject, NO_LOG)
      .then((subject) => method(subject, options));
  });
}

function initCommands() {
  // Initialize config by getting it once
  getConfig();

  if (!Cypress.browser.isHeadless) {

    // Inject CSS & JavaScript
    before(() => {
      initUi();

      // Close snapshot modal before all test restart
      closeSnapshotModals();
    });
  }

  function clearFileCache() {
    Cypress.__readFileCache__ = {};
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
  initCommands,
};

if (!process.env.JEST_WORKER_ID) {
  initCommands();
}
