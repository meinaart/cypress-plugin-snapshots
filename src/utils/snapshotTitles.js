const getTestTitle = require('./getTestTitle');

const SNAPSHOTS_TEXT = {}
const SNAPSHOTS_IMAGE = {};

const SNAPSHOT_TITLES_TEXT = [];
const SNAPSHOT_TITLES_IMAGE = [];

function snapshotTitleIsUsed(snapshotTitle, isImage = false) {
  return (isImage ? SNAPSHOT_TITLES_IMAGE : SNAPSHOT_TITLES_TEXT).indexOf(snapshotTitle) !== -1;
}

function getSnapshotTitle(test, isImage = false) {
  const testTitle = getTestTitle(test);
  const snapshots = isImage ? SNAPSHOTS_IMAGE : SNAPSHOTS_TEXT;

  if (snapshots[testTitle] !== undefined) {
    snapshots[testTitle] += 1;
  } else {
    snapshots[testTitle] = 0;
  }

  const snapshotTitle = `${testTitle} #${snapshots[testTitle]}`;
  (isImage ? SNAPSHOT_TITLES_IMAGE : SNAPSHOT_TITLES_TEXT).push(snapshotTitle);
  return snapshotTitle;
}

module.exports = {
  getSnapshotTitle,
  snapshotTitleIsUsed
}
