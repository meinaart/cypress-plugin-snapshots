const path = require('path');
const JSONNormalize = require('json-normalize');

const SNAPSHOTS = [];
const SNAPSHOT_TITLES = [];

function getSnapshotFilename(testFile) {
  const dir = path.join(path.dirname(testFile), '__snapshots__');
  const filename = path.basename(testFile) + '.snap';
  return path.join(dir, filename);
}

function getTestTitle(test) {
  return (test.parent && test.parent.title ? getTestTitle(test.parent) + ' > ' : '') + test.title;
}

function snapshotTitleIsUsed(snapshotTitle) {
  return SNAPSHOT_TITLES.indexOf(snapshotTitle) !== -1;
}

function getSnapshotTitle(test) {
  const testTitle = getTestTitle(test);

  if (SNAPSHOTS[testTitle] !== undefined) {
    SNAPSHOTS[testTitle]++;
  } else {
    SNAPSHOTS[testTitle] = 0;
  }

  const snapshotTitle = testTitle + ' #' + SNAPSHOTS[testTitle];
  SNAPSHOT_TITLES.push(snapshotTitle);
  return snapshotTitle;
}

function formatJson(subject) {
  return JSON.stringify(subject, undefined, 2);
}

function formatNormalizedJson(subject) {
  return formatJson(normalizeObject(subject));
}

function normalizeObject(subject) {
  return JSON.parse(JSONNormalize.stringifySync(subject));
}

function subjectToSnapshot(subject, normalize = true) {
  if (typeof subject === 'object') {
    return normalize ? normalizeObject(subject) : subject;
  }

  return String(subject);
}

module.exports = {
  formatJson,
  formatNormalizedJson,
  getSnapshotFilename,
  getSnapshotTitle,
  getTestTitle,
  subjectToSnapshot,
  snapshotTitleIsUsed
}