const path = require('path');
const fs = require('fs-extra');
const { merge } = require('lodash');
const {
  formatJson,
  subjectToSnapshot,
} = require('./snapshots');
const { TYPE_JSON } = require('../constants');

function getSnapshot(filename, snapshotTitle, dataType = TYPE_JSON) {
  fs.ensureDirSync(path.dirname(filename));

  if (fs.existsSync(filename)) {
    const snapshots = readFile(filename);
    if (snapshots[snapshotTitle]) {
      return subjectToSnapshot(snapshots[snapshotTitle], dataType);
    }
  } else {
    fs.writeFileSync(filename, '{}');
  }

  return false;
}

function readFile(filename) {
  if (fs.existsSync(filename)) {
    let content;
    try {
      // eslint-disable-next-line import/no-dynamic-require
      content = require(filename);
    } catch(ex) {
      content = JSON.parse(fs.readFileSync(filename, 'utf8'));
    }
    return content;
  }

  return {};
}

function updateSnapshot(filename, snapshotTitle, subject, dataType) {
  const store = readFile(filename);
  store[snapshotTitle] = subjectToSnapshot(subject, dataType);

  // Reformat to `exports` format which is nicer for Git diffs
  const saveResult = Object.keys(store).reduce((result, key) => {
    let value = store[key];
    if (typeof value === 'string') {
      value = `\`\n${value.replace(/`/g, '\\`')}\n\``;
    } else {
      value = `\n${formatJson(value)}`;
    }
    result += `exports[\`${key}\`] = ${value}`;
    result += ";\n\n";

    return result;
  }, '');

  fs.writeFileSync(filename, `${saveResult.trim()}\n`);
  return merge({}, subject, { saved: true });
}

function saveSnapshot(data) {
  return updateSnapshot(data.snapshotFile, data.snapshotTitle, data.subject, data.dataType);
}

module.exports = {
  getSnapshot,
  saveSnapshot,
  updateSnapshot,
};
