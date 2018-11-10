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
    // const content = fs.readFileSync(filename, {encoding: 'utf8'});
    // if (content[0] === '{') {
    //   return JSON.parse(content);
    // }

    // eslint-disable-next-line import/no-dynamic-require
    return require(filename);
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
