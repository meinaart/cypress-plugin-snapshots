const {
  merge,
  cloneDeep
} = require('lodash');
const applyReplace = require('../utils/tasks/applyReplace');
const {
  getSnapshot,
  updateSnapshot,
} = require('../utils/tasks/textSnapshots');
const {
  createDiff,
  formatDiff,
  getSnapshotFilename,
  subjectToSnapshot,
} = require('../utils/textSnapshots');
const keepKeysFromExpected = require('../utils/keepKeysFromExpected');
const {
  getConfig
} = require('../config');

function matchTextSnapshot({
  commandName,
  dataType,
  options,
  snapshotTitle,
  subject,
  testFile,
} = {}) {
  const config = merge({}, cloneDeep(getConfig()), options);
  const snapshotFile = getSnapshotFilename(testFile);
  const expectedRaw = getSnapshot(snapshotFile, snapshotTitle, dataType);
  const expected = applyReplace(expectedRaw, config.replace);
  const actual = keepKeysFromExpected(subjectToSnapshot(subject, dataType), expected, config);

  const exists = expected !== false;

  const autoPassed = (config.autopassNewSnapshots && expected === false);
  const passed = (expected && formatDiff(expected) === formatDiff(actual));
  const diff = createDiff(expected, actual, snapshotTitle);

  let updated = false;

  if ((config.updateSnapshots && !passed) || expected === false) {
    updateSnapshot(snapshotFile, snapshotTitle, actual, dataType);
    updated = true;
  }

  const result = {
    actual,
    commandName,
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

module.exports = matchTextSnapshot;
