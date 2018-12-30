const fs = require('fs-extra');
const rimraf = require('rimraf').sync;
const getSnapshotFilename = require('../utils/image/getSnapshotFilename');
const { IMAGE_TYPE_ACTUAL } = require('../constants');

function saveImageSnapshot(data) {
  const {
    testFile,
    snapshotTitle,
  } = data;
  const filename = getSnapshotFilename(testFile, snapshotTitle);
  const actualFilename = getSnapshotFilename(testFile, snapshotTitle, IMAGE_TYPE_ACTUAL);
  rimraf(filename);

  if (fs.existsSync(actualFilename)) {
    fs.moveSync(actualFilename, filename);
  }

  data.saved = true;
  return data;
}

module.exports = saveImageSnapshot;
