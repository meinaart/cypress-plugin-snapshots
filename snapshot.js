const path = require('path');
const { getConfig } = require('./config');

const SNAPSHOTS = [];
const SNAPSHOT_TITLES = [];

function getSnapshotFilename(testFile) {
  const dir = path.join(path.dirname(testFile), '__snapshots__');
  const filename = `${path.basename(testFile)}.snap`;
  return path.join(dir, filename);
}

function getTestTitle(test) {
  return (test.parent && test.parent.title ? `${getTestTitle(test.parent)} > ` : '') + test.title;
}

function snapshotTitleIsUsed(snapshotTitle) {
  return SNAPSHOT_TITLES.indexOf(snapshotTitle) !== -1;
}

function getSnapshotTitle(test) {
  const testTitle = getTestTitle(test);

  if (SNAPSHOTS[testTitle] !== undefined) {
    SNAPSHOTS[testTitle] += 1;
  } else {
    SNAPSHOTS[testTitle] = 0;
  }

  const snapshotTitle = `${testTitle} #${SNAPSHOTS[testTitle]}`;
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
  if (Array.isArray(subject)) {
    return subject.map(normalizeObject);
  }

  if (typeof subject === 'object' && subject !== null) {
    const keys = Object.keys(subject);
    keys.sort();

    return keys.reduce((result, key) => {
      result[key] = normalizeObject(subject[key]);
      return result;
    }, {});
  }

  return subject;
}

function removeExcludedFields(subject) {
  const excludedFields = getConfig().excludeFields;
  if (excludedFields) {
    if (Array.isArray(subject)) {
      return subject.map(removeExcludedFields);
    }

    if (typeof subject === 'object' && subject !== null) {
      return Object.keys(subject)
        .filter(key => excludedFields.indexOf(key) === -1)
        .reduce((result, key) => {
          result[key] = removeExcludedFields(subject[key]);
          return result;
        }, {});
    }
  }

  return subject;
}

function subjectToSnapshot(subject, normalize = true) {
  let result = subject;

  if (typeof subject === 'object') {
    result = normalize ? normalizeObject(subject) : subject;
  }

  return removeExcludedFields(result);
}

module.exports = {
  formatJson,
  formatNormalizedJson,
  getSnapshotFilename,
  getSnapshotTitle,
  getTestTitle,
  subjectToSnapshot,
  snapshotTitleIsUsed,
};
