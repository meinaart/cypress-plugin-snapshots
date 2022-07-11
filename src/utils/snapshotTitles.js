const getTestTitle = require('./getTestTitle');

const SNAPSHOTS_TEXT = {}
const SNAPSHOTS_IMAGE = {};

const SNAPSHOT_TITLES_TEXT = [];
const SNAPSHOT_TITLES_IMAGE = [];
const SNAPSHOT_TEXT_ATTEMPTS = {};
const SNAPSHOT_IMAGE_ATTEMPTS = {};

function snapshotTitleIsUsed(snapshotTitle, isImage = false) {
  return (isImage ? SNAPSHOT_TITLES_IMAGE : SNAPSHOT_TITLES_TEXT).indexOf(snapshotTitle) !== -1;
}

function getSnapshotTitle(test, customName, customSeparator, isImage = false,attemptNumber) {
  const name = customName || getTestTitle(test);
  const separator = customSeparator || ' #';
  const snapshots = isImage ? SNAPSHOTS_IMAGE : SNAPSHOTS_TEXT;
  const snapshotsAttempts = isImage ? SNAPSHOT_IMAGE_ATTEMPTS : SNAPSHOT_TEXT_ATTEMPTS;
  
  const prevSnapshotTitle = `${name}${separator}${snapshots[name]||0}`;
  if(!snapshotsAttempts[prevSnapshotTitle])snapshotsAttempts[prevSnapshotTitle]=0

  if (snapshots[name] !== undefined) {
    if(snapshotsAttempts[prevSnapshotTitle] < attemptNumber) {
      snapshotsAttempts[prevSnapshotTitle]=attemptNumber
    }else{
      snapshots[name] += 1;
    }
  } else {
    snapshots[name] = 0;
  }

  const snapshotTitle = `${name}${separator}${snapshots[name]}`;
  (isImage ? SNAPSHOT_TITLES_IMAGE : SNAPSHOT_TITLES_TEXT).push(snapshotTitle);
  return snapshotTitle;
}

module.exports = {
  getSnapshotTitle,
  snapshotTitleIsUsed
}
