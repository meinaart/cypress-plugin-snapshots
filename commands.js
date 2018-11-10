/* globals Cypress, before, after, cy */
/* eslint-env browser */
const { merge, cloneDeep } = require('lodash');
const { MATCH } = require('./tasks/task-names');
const { initUi } = require('./ui');
const {
  getTestTitle,
  getSnapshotTitle,
} = require('./utils/snapshots');
const {
  cleanUpSnapshots,
  fixConfig,
  getConfig,
  getTestForTask,
  getSubject,
  isHtml,
} = require('./utils/commands');
const {
  TYPE_JSON,
  TYPE_HTML
} = require('./constants');

const URL_PREFIX = '#cypress-plugin-snapshot-';
const COMMAND_NAME = 'toMatchSnapshot';
const NO_LOG = { log: false };

function commandToMatchSnapshot(testSubject, options) {
  const test = getTestForTask();
  const testTitle = getTestTitle(test);
  const testFile = Cypress.spec.absolute;
  const snapshotTitle = getSnapshotTitle(test);

  const subject = getSubject(testSubject);
  const dataType = isHtml(testSubject) ? TYPE_HTML : TYPE_JSON;

  const toMatchSnapshot = (result) => {
    const args = window.parent.window.btoa(JSON.stringify(result));
    const passedMessage = result.expected ? 'Snapshots match' : 'Snapshot created, autopassed';
    const message = result.passed ?
        `[${passedMessage}](${URL_PREFIX}${args})`
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
    dataType,
    options,
    snapshotTitle,
    subject,
    testFile,
    testTitle,
  }, NO_LOG).then(toMatchSnapshot);
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

  Cypress.Commands.add(COMMAND_NAME, { prevSubject: 'optional' }, (commandSubject, taskOptions) => {
    if (!commandSubject) {
      return commandSubject;
    }

    const options = merge({}, cloneDeep(getConfig()), taskOptions);
    return cy.wrap(commandSubject, NO_LOG)
      .then((subject) => commandToMatchSnapshot(subject, options));
  });
}

module.exports = {
  initCommands,
};

if (!process.env.JEST_WORKER_ID) {
  initCommands();
}
