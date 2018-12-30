const path = require('path');
const sanitizeFilename = require('sanitize-filename');
const { DIR_IMAGE_SNAPSHOTS } = require('../../constants');

function getSnapshotFilename(testFile, snapshotTitle, type = '') {
  const dir = path.join(path.dirname(testFile), DIR_IMAGE_SNAPSHOTS);
  const fileType = type ? `.${type}` : '';
  const filename = sanitizeFilename(`${snapshotTitle}${fileType}.png`);
  return path.join(dir, filename);
}

module.exports = getSnapshotFilename;
