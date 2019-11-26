const applyReplace = require('../utils/text/applyReplace');
const {
  createDiff,
  formatDiff,
  getSnapshot,
  subjectToSnapshot,
  updateSnapshot
} = require('../utils/tasks/textSnapshots');
const getSnapshotFilename = require('../utils/text/getSnapshotFilename');
const keepKeysFromExpected = require('../utils/text/keepKeysFromExpected');

function matchTextSnapshot({
  commandName,
  dataType,
  options,
  snapshotTitle,
  subject,
  testFile
} = {}) {
  const snapshotFile = getSnapshotFilename(testFile);
  const expectedRaw = getSnapshot(snapshotFile, snapshotTitle, dataType, options);
  let expected = applyReplace(expectedRaw, options.replace);
  const actual = keepKeysFromExpected(subjectToSnapshot(subject, dataType, options), expected, options);

  const exists = expectedRaw !== false;

  const autoPassed = options.autopassNewSnapshots && !exists;
  const passed = expected && formatDiff(expected) === formatDiff(actual);
  const diff = createDiff(expected, actual, snapshotTitle);

  let updated = false;

  if ((options.updateSnapshots && !passed) || autoPassed) {
    updateSnapshot(snapshotFile, snapshotTitle, actual, dataType);
    updated = true;
  }

  if (autoPassed) {
    expected = actual;
  }

  const result = {
    actual,
    commandName,
    dataType,
    diff,
    exists,
    expected,
    passed: passed || autoPassed,
    snapshotFile,
    snapshotTitle,
    subject,
    updated
  };

  return result;
}

module.exports = matchTextSnapshot;
