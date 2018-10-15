const { MATCH, URL_PREFIX } = require('./constants');
const { initUi } = require('./ui');
const { formatNormalizedJson, getTestTitle, getSnapshotTitle, getSnapshotFilename, snapshotTitleIsUsed } = require('./snapshot');
const { CONFIG_KEY } = require('./config');

const COMMAND_NAME = 'toMatchSnapshot';
const NO_LOG = {log: false};

// Inject CSS & JavaScript
before(() => {
  initUi();
});

// Clean up unused snapshots
after(() => {
  cleanUpSnapshots();
});

// Removes unused snapshots from snapshot file
function cleanUpSnapshots() {
  const config = Cypress.env(CONFIG_KEY);
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
    parent: test.parent && test.parent.title ? getTestForTask(test.parent): null
  }
}

Cypress.Commands.add(COMMAND_NAME, { prevSubject: 'optional' }, (subject, taskOptions) => {
  if (!subject) {
    return;
  }

  const options = taskOptions || {};
  const test = getTestForTask();
  const testTitle = getTestTitle(test);
  const snapshotTitle = getSnapshotTitle(test);
  let task;

  const toMatchSnapshot = (result) => {
    const args = parent.window.btoa(JSON.stringify(result));
    const message = result.passed ?
      result.expected ? 'Snapshots match' : 'Snapshot created, autopassed'
    : `[compare snapshot](${URL_PREFIX}${args})`;

    const log = Cypress.log({
      $el: subject,
      name: COMMAND_NAME,
      displayName: 'snapshot',
      message,
      consoleProps: () => {
        return result;
      }
    });

    if (!result.passed) {
      log.set('state', 'failed');
      throw new Error('Snapshots do not match');
    }

    return subject;
  };

  cy.task(MATCH, {
      testTitle,
      testFile: Cypress.spec.absolute,
      snapshotTitle,
      subject,
      options
    }, NO_LOG).then(toMatchSnapshot);

  return task;
});
