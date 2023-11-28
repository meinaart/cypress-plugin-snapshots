const getTestTitle = require('./getTestTitle');

let SNAPSHOTS_TEXT = {}
let SNAPSHOTS_IMAGE = {};

const SNAPSHOT_TITLES_TEXT = [];
const SNAPSHOT_TITLES_IMAGE = [];

function snapshotTitleIsUsed(snapshotTitle, isImage = false) {
  return (isImage ? SNAPSHOT_TITLES_IMAGE : SNAPSHOT_TITLES_TEXT).indexOf(snapshotTitle) !== -1;
}

function getSnapshotTitle(test, customName, customSeparator, isImage = false) {
  const name = customName || getTestTitle(test);
  const separator = customSeparator || ' #';
  const snapshots = isImage ? SNAPSHOTS_IMAGE : SNAPSHOTS_TEXT;

  if (snapshots[name] !== undefined) {
    snapshots[name] += 1;
  } else {
    snapshots[name] = 0;
  }

  const snapshotTitle = `${name}${separator}${snapshots[name]}`;
  (isImage ? SNAPSHOT_TITLES_IMAGE : SNAPSHOT_TITLES_TEXT).push(snapshotTitle);
  return snapshotTitle;
}

function resetSnapshotCounts() {
  // Only reset counters. Assume that the titles used will be consistent and fine with dupes.
  SNAPSHOTS_TEXT = {};
  SNAPSHOTS_IMAGE = {};
}

module.exports = {
  getSnapshotTitle,
  snapshotTitleIsUsed,
  resetSnapshotCounts
}
