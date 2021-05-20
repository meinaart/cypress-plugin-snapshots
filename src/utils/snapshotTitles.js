const getTestTitle = require('./getTestTitle');

const SNAPSHOTS_TEXT = {};
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

  const id = name + test.currentRetry;

  if (snapshots[id] !== undefined) {
    snapshots[id] += 1;
  } else {
    snapshots[id] = 0;
  }

  const snapshotTitle = `${name}${separator}${snapshots[id]}`;
  (isImage ? SNAPSHOT_TITLES_IMAGE : SNAPSHOT_TITLES_TEXT).push(snapshotTitle);
  return snapshotTitle;
}

module.exports = {
  getSnapshotTitle,
  snapshotTitleIsUsed,
};
