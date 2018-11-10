/* globals Cypress, before, after, cy */
/* eslint-env browser */
const { merge, cloneDeep } = require('lodash');
const { MATCH } = require('./tasks/task-names');
const { initUi } = require('./ui');
const {
  formatNormalizedJson, getTestTitle, getSnapshotTitle, getSnapshotFilename, snapshotTitleIsUsed,
} = require('./utils/snapshots');
const { CONFIG_KEY } = require('./config');

const URL_PREFIX = '#cypress-plugin-snapshot-';
const COMMAND_NAME = 'toMatchSnapshot';
const NO_LOG = { log: false };

function getConfig() {
  fixConfig();
  const config = Cypress.env(CONFIG_KEY);
  if (!config) {
    throw new Error('Config cannot be found.');
  }

  return config;
}

// Removes unused snapshots from snapshot file
function cleanUpSnapshots() {
  const config = getConfig();
  if (!config.autoCleanUp) {
    return;
  }

  const filename = getSnapshotFilename(Cypress.spec.relative);
  cy.readFile(filename, NO_LOG).then((content) => {
    if (content) {
      const snapshot = JSON.parse(content);
      const keys = Object.keys(snapshot);

      const cleanSnapshot = keys
        .filter(snapshotTitleIsUsed)
        .reduce((result, key) => {
          result[key] = snapshot[key];
          return result;
        }, {});

      cy.writeFile(filename,
        formatNormalizedJson(cleanSnapshot),
        NO_LOG);
    }
  });
}

function getTest() {
  return Cypress.mocha.getRunner().test;
}

function getTestForTask(test) {
  if (!test) {
    test = getTest();
  }
  return {
    id: test.id,
    title: test.title,
    parent: test.parent && test.parent.title ? getTestForTask(test.parent) : null,
  };
}

/**
 * Check if config in `Cypress.env` is stringified JSON.
 * If so parse it and set the parsed value back in `Cypress.env`.
 */
function fixConfig() {
  if (typeof Cypress.env(CONFIG_KEY) === 'string') {
    Cypress.env(CONFIG_KEY, JSON.parse(Cypress.env(CONFIG_KEY)));
  }
}

function initCommands() {
  fixConfig();

  // Inject CSS & JavaScript
  before(() => {
    initUi();
  });

  // Clean up unused snapshots
  after(() => {
    cleanUpSnapshots();
  });

  Cypress.Commands.add(COMMAND_NAME, { prevSubject: 'optional' }, (subject, taskOptions) => {
    if (!subject) {
      return subject;
    }

    const options = merge({}, cloneDeep(getConfig()), taskOptions);

    const test = getTestForTask();
    const testTitle = getTestTitle(test);
    const snapshotTitle = getSnapshotTitle(test);

    const toMatchSnapshot = (result) => {
      const args = window.parent.window.btoa(JSON.stringify(result));
      const passedMessage = result.expected ? 'Snapshots match' : 'Snapshot created, autopassed';
      const message = result.passed
        ? passedMessage
        : `[compare snapshot](${URL_PREFIX}${args})`;

      const log = Cypress.log({
        $el: subject,
        name: COMMAND_NAME,
        displayName: 'snapshot',
        message,
        consoleProps: () => result,
      });

      if (!result.passed) {
        log.set('state', 'failed');
        throw new Error(`Snapshots do not match:\n${result.diff}`);
      }

      return subject;
    };

    return cy.task(MATCH, {
      testTitle,
      testFile: Cypress.spec.absolute,
      snapshotTitle,
      subject,
      options,
    }, NO_LOG).then(toMatchSnapshot);
  });
}

module.exports = {
  initCommands,
};

if (!process.env.JEST_WORKER_ID) {
  initCommands();
}
