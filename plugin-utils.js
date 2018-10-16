const path = require('path');
const fs = require('fs-extra');
const { merge } = require('lodash');
const { getConfig } = require('./config');
const { formatNormalizedJson, subjectToSnapshot } = require('./snapshot');

function getSnapshot(filename, snapshotTitle) {
  fs.ensureDirSync(path.dirname(filename));

  if (fs.existsSync(filename)) {
    const snapshots = fs.readJSONSync(filename);
    if (snapshots[snapshotTitle]) {
      return subjectToSnapshot(snapshots[snapshotTitle], getConfig().normalizeJson);
    }
  } else {
    fs.writeFileSync(filename, '{}');
  }

  return false;
}

function updateSnapshot(filename, snapshotTitle, subject) {
  const store = fs.existsSync(filename) ? fs.readJSONSync(filename) : {};
  store[snapshotTitle] = subjectToSnapshot(subject, getConfig().normalizeJson);
  fs.writeFileSync(filename, formatNormalizedJson(store));
  return merge({}, subject, { saved: true });
}

function saveSnapshot(data) {
  return updateSnapshot(data.snapshotFile, data.snapshotTitle, data.subject);
}

module.exports = {
  getSnapshot,
  saveSnapshot,
  updateSnapshot,
};
