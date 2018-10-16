
const unidiff = require('unidiff');
const { merge } = require('lodash');
const { MATCH, SAVE } = require('./constants');
const { updateSnapshot, getSnapshot } = require('./plugin-utils');
const { subjectToSnapshot, formatJson, getSnapshotFilename } = require('./snapshot');
const { initConfig, CONFIG_KEY, getConfig } = require('./config');
const { initServer } = require('./save-server');

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
 * @param {object} subject
 * @param {object} expected
 * @returns {object}
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
  } if (typeof expected === 'object' && typeof subject === 'object') {
    const origin = cfg.ignoreExtraFields ? expected : subject;
    return Object.keys(origin)
      .reduce((result, key) => {
        result[key] = keepKeysFromExpected(subject[key], expected[key], cfg);
        return result;
      }, {});
  }

  return subject;
}

function matchSnapshot({
  testFile, snapshotTitle, subject, options,
} = {}) {
  const config = getConfig();
  const snapshotFile = getSnapshotFilename(testFile);
  const expected = getSnapshot(snapshotFile, snapshotTitle);
  const actual = keepKeysFromExpected(subjectToSnapshot(subject, config.normalizeJson), expected, merge({
    ignoreExtraArrayItems: config.ignoreExtraArrayItems,
    ignoreExtraFields: config.ignoreExtraFields
  }, options));

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

function saveSnapshot({ snapshotFile, snapshotTitle, subject }) {
  return updateSnapshot(snapshotFile, snapshotTitle, subject);
}

function initPlugin(on, globalConfig = {}) {
  const config = initConfig(globalConfig.env[CONFIG_KEY] || {});
  if (globalConfig.env[CONFIG_KEY]) {
    merge(globalConfig.env, {
      [CONFIG_KEY]: config,
    });
  }

  initServer(config);

  on('task', {
    [MATCH]: matchSnapshot,
    [SAVE]: saveSnapshot,
  });
}

module.exports = {
  initPlugin,
  keepKeysFromExpected,
};
