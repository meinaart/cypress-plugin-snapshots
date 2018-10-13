
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

function matchSnapshot(data = {}) {
  const snapshotFile = getSnapshotFilename(data.testFile);
  const snapshotTitle = data.snapshotTitle;
  const expected = getSnapshot(snapshotFile, snapshotTitle);
  const exists = expected !== false;
  const actual = subjectToSnapshot(data.subject, config.normalizeJson);
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