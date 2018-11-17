const path = require('path');
const sanitizeFilename = require('sanitize-filename');
const { DIR_IMAGE_SNAPSHOTS } = require('../constants');

function getImageData(props) {
  return props ? {
    height: props.height || props.dimensions && props.dimensions.height,
    path: props.path,
    relativePath: path.relative(process.cwd(), props.path),
    width: props.width || props.dimensions && props.dimensions.width,
  } : props;
}

function getImageSnapshotFilename(testFile, snapshotTitle, type = '') {
  const dir = path.join(path.dirname(testFile), DIR_IMAGE_SNAPSHOTS);
  const fileType = type ? `.${type}` : '';
  const filename = sanitizeFilename(`${snapshotTitle}${fileType}.png`);
  return path.join(dir, filename);
}

module.exports = {
  getImageData,
  getImageSnapshotFilename,
};
