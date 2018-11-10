const unidiff = require('unidiff');
const path = require('path');
const { getConfig } = require('../config');

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
    context: getConfig().diffLines,
  });
}

/**
 * Create new object based on `subject` that do only contains fields that exist in `expected`
 * @param {Object} subject
 * @param {Object} expected
 * @returns {Object}
 */
function keepKeysFromExpected(subject, expected, keepConfig) {
  const cfg = keepConfig || getConfig();

  if (Array.isArray(expected) && Array.isArray(subject)) {
    const origin = cfg.ignoreExtraArrayItems ? expected : subject;

    const result = origin
      .filter((value, index) => index < subject.length)
      .map((value, index) => keepKeysFromExpected(subject[index], expected[index] || value, cfg));

    // Add extra items not existing in expected from subject to result
    if (!cfg.ignoreExtraArrayItems && subject.length > expected.length) {
      return [...result, ...subject.slice(result.length, subject.length)];
    }

    return result;
  }
  if (typeof expected === 'object' && typeof subject === 'object') {
    const origin = cfg.ignoreExtraFields ? expected : subject;
    return Object.keys(origin)
      .reduce((result, key) => {
        result[key] = keepKeysFromExpected(subject[key], expected[key], cfg);
        return result;
      }, {});
  }

  return subject;
}

module.exports = {
  createDiff,
  formatDiff,
  formatJson,
  formatNormalizedJson,
  getSnapshotFilename,
  getSnapshotTitle,
  getTestTitle,
  keepKeysFromExpected,
  snapshotTitleIsUsed,
  subjectToSnapshot,
};
