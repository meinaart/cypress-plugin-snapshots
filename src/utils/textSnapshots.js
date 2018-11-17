const unidiff = require('unidiff');
const path = require('path');
const prettier = require('prettier');
const {
  getConfig,
  shouldNormalize,
  getPrettierConfig
} = require('../config');
const { TYPE_JSON } = require('../dataTypes');
const { DIR_SNAPSHOTS } = require('../constants');
const removeExcludedFields = require('./removeExcludedFields');
const { formatJson, normalizeObject } = require('./json');

function getSnapshotFilename(testFile) {
  const dir = path.join(path.dirname(testFile), DIR_SNAPSHOTS);
  const filename = `${path.basename(testFile)}.snap`;
  return path.join(dir, filename);
}

function subjectToSnapshot(subject, dataType = TYPE_JSON) {
  const config = getConfig();
  let result = subject;

  if (typeof subject === 'object' && shouldNormalize(dataType)) {
    result = normalizeObject(subject);
  }

  if (dataType === TYPE_JSON) {
    result = removeExcludedFields(result, config.excludeFields);
  }

  const prettierConfig = getPrettierConfig(dataType);
  if (prettierConfig) {
    try {
      if (typeof result === 'object') {
        result = JSON.stringify(result, undefined, 2);
      }

      result = prettier.format(result.trim(), prettierConfig).trim();
    } catch(err) {
      throw new Error(`Cannot format subject: ${result}`);
    }
  }

  return result;
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

module.exports = {
  createDiff,
  formatDiff,
  getSnapshotFilename,
  subjectToSnapshot,
};
