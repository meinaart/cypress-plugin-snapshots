/* globals Cypress, before, after, cy */
/* eslint-env browser */
const {
  formatNormalizedJson,
  getSnapshotFilename,
  snapshotTitleIsUsed,
} = require('../utils/snapshots');
const {
  CONFIG_KEY
} = require('../config');

const NO_LOG = {
  log: false
};

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

function isElement(obj) {
  return obj && (obj instanceof Element || (obj.nodeType && obj.nodeType === 1));
}

function isCollection(obj) {
  return obj && (
    obj instanceof NodeList ||
    obj instanceof HTMLCollection
  );
}

function getSubject(testSubject) {
  if (testSubject) {
    if (isJQuery(testSubject)) {
      if (testSubject.length === 1) {
        return getSubject(testSubject.get(0));
      }

      if (testSubject.length > 1) {
        return getSubject(Array.from(testSubject));
      }

      return undefined;
    }

    if (isCollection(testSubject)) {
      return getSubject(Array.from(testSubject));
    }

    const isArray = !isJQuery && Array.isArray(testSubject);
    if (isArray && testSubject.length && isElement(testSubject[0])) {
      return testSubject.map(getSubject);
    }

    if (isElement(testSubject)) {
      return testSubject.outerHTML;
    }
  }

  return testSubject;
}

function isJQuery(subject) {
  return subject && subject.constructor.name === 'jQuery'
}

function isHtml(subject) {
  return isJQuery(subject) ||
          (Array.isArray(subject) && subject.length && isElement(subject[0])) ||
          isCollection(subject) ||
          isElement(subject);
}

module.exports = {
  cleanUpSnapshots,
  fixConfig,
  getConfig,
  getSubject,
  getTest,
  getTestForTask,
  isHtml
}
