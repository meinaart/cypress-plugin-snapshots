const getTestTitle = require('./getTestTitle');

const SNAPSHOTS_TEXT = {}
const SNAPSHOTS_IMAGE = {};

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

function resetSnapshotIndex() {
  Object.keys(SNAPSHOTS_TEXT).forEach(key => delete SNAPSHOTS_TEXT[key]);
  Object.keys(SNAPSHOTS_IMAGE).forEach(key => delete SNAPSHOTS_IMAGE[key]);
}

module.exports = {
  getSnapshotTitle,
  snapshotTitleIsUsed,
  resetSnapshotIndex
}
