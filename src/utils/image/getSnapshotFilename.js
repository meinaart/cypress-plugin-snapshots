const path = require('path');
const { DIR_IMAGE_SNAPSHOTS } = require('../../constants');

function getSnapshotFilename(testFile, snapshotTitle, type = '') {
  const dir = path.join(path.dirname(testFile), DIR_IMAGE_SNAPSHOTS);
  const fileType = type ? `.${type}` : '';
  return path.join(dir, `${snapshotTitle}${fileType}.png`);
}

module.exports = getSnapshotFilename;
