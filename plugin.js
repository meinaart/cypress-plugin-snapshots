
const { MATCH, SAVE } = require('./constants');
const unidiff = require('unidiff');
const { updateSnapshot, getSnapshot } = require('./plugin-utils');
const { subjectToSnapshot, formatJson, getSnapshotFilename } = require('./snapshot');
const { initConfig, CONFIG_KEY, getConfig } = require('./config');
const { initServer } = require('./save-server');
const merge = require('lodash').merge;

let config = getConfig();

function formatDiff(subject) {
  if (typeof subject === 'object') {
    return formatJson(subject);
  }
  return String(subject || '');
}

function createDiff(expected, actual, snapshotTitle) {
  return unidiff.diffAsText(formatDiff(expected), formatDiff(actual), {
    aname: snapshotTitle,
    bname: snapshotTitle,
    context: config.diffLines
  });
}

/**
 * Create new object based on `subject` that do only contains fields that exist in `expected`
 * @param {object} subject
 * @param {object} expected
 * @returns {object}
 */
function keepKeysFromExpected(subject, expected) {
  if (Array.isArray(expected)) {
    return expected.map((item, index) => {
      return keepKeysFromExpected(subject[index], item);
    });
  } else if (typeof expected === 'object') {
    return Object.keys(expected)
      .reduce((result, key) => {
        result[key] = keepKeysFromExpected(subject[key], expected[key]);
        return result;
      }, {});
  }

  return subject;
}

function matchSnapshot(data = {}) {
  const snapshotFile = getSnapshotFilename(data.testFile);
  const snapshotTitle = data.snapshotTitle;
  const expected = getSnapshot(snapshotFile, snapshotTitle);
  let actual = subjectToSnapshot(data.subject, config.normalizeJson);

  if (data.options && data.options.ignoreExtraFields) {
    actual = keepKeysFromExpected(actual, expected);
  }

  const exists = expected !== false;

  const autoPassed = (config.autopassNewSnapshots && expected === false);
  const passed = (expected && formatDiff(expected) === formatDiff(actual));
  const diff = passed || autoPassed ? undefined : createDiff(expected, actual, data.snapshotTitle);

  let updated = false;

  if ((config.updateSnapshots && !passed) || expected === false) {
    updateSnapshot(snapshotFile, snapshotTitle, actual);
    updated = true;
  }

  const result = {
    actual,
    diff,
    exists,
    expected,
    passed: passed || autoPassed,
    snapshotFile,
    snapshotTitle,
    subject: data.subject,
    updated,
  };

  return result;
}

function saveSnapshot(data = {}) {
  return updateSnapshot(data.snapshotFile, data.snapshotTitle, data.subject);
}

function initPlugin(on, globalConfig = {}) {
  config = initConfig(globalConfig.env[CONFIG_KEY] || {});
  if (globalConfig.env[CONFIG_KEY]) {
    merge(globalConfig.env, {
      [CONFIG_KEY]: config
    });
  }

  initServer(config);

  on('task', {
    [MATCH]: matchSnapshot,
    [SAVE]: saveSnapshot
  });
}

module.exports = {
  initPlugin
};