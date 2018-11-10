const {
  merge,
  cloneDeep
} = require('lodash');
const {
  updateSnapshot,
  getSnapshot
} = require('../utils/plugin');
const {
  createDiff,
  formatDiff,
  getSnapshotFilename,
  keepKeysFromExpected,
  subjectToSnapshot,
} = require('../utils/snapshots');
const {
  getConfig
} = require('../config');

/**
 * Apply optional `replace` functionality coming from `options` supplied to `toMatchSnapshot`.
 *
 * You can use either an object containing key/value pair or a function to handle replacement.
 *
 * @param {Object} expected - Object to replace values in
 * @param {Object=} replace - Object containing replacements
 * @returns {Object}
 */
function applyReplace(expected, replace) {
  if (typeof expected !== 'object' || !replace) {
    return expected;
  }

  if (typeof replace === 'object') {
    const jsonString = Object.keys(replace)
      .reduce((result, key) => result.replace(
        new RegExp(`\\$\\{${key}\\}`, 'g'),
        replace[key]
      ), JSON.stringify(expected));
    return JSON.parse(jsonString);
  }

  return expected;
}

function matchSnapshot({
  testFile,
  snapshotTitle,
  subject,
  options,
} = {}) {
  const config = merge({}, cloneDeep(getConfig()), options);
  const snapshotFile = getSnapshotFilename(testFile);
  const expectedRaw = getSnapshot(snapshotFile, snapshotTitle);
  const expected = applyReplace(expectedRaw, config.replace);
  const actual = keepKeysFromExpected(subjectToSnapshot(subject, config.normalizeJson), expected, config);

  const exists = expected !== false;

  const autoPassed = (config.autopassNewSnapshots && expected === false);
  const passed = (expected && formatDiff(expected) === formatDiff(actual));
  const diff = passed || autoPassed ? undefined : createDiff(expected, actual, snapshotTitle);

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
    subject,
    updated,
  };

  return result;
}

function saveSnapshot({
  snapshotFile,
  snapshotTitle,
  subject
}) {
  return updateSnapshot(snapshotFile, snapshotTitle, subject);
}

module.exports = {
  applyReplace,
  matchSnapshot,
  saveSnapshot,
}
