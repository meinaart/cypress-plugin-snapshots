const path = require('path');
const { DIR_SNAPSHOTS } = require('../../constants');

function getSnapshotFilename(testFile) {
  const dir = path.join(path.dirname(testFile), DIR_SNAPSHOTS);
  const filename = `${path.basename(testFile)}.snap`;
  return path.join(dir, filename);
}

module.exports = getSnapshotFilename;
