const fs = require('fs-extra');
const rimraf = require('rimraf').sync;
const { getImageSnapshotFilename } = require('../utils/imageSnapshots');
const { IMAGE_TYPE_ACTUAL } = require('../constants');

function saveImageSnapshot(data) {
  const {
    testFile,
    snapshotTitle,
  } = data;
  const filename = getImageSnapshotFilename(testFile, snapshotTitle);
  const actualFilename = getImageSnapshotFilename(testFile, snapshotTitle, IMAGE_TYPE_ACTUAL);
  rimraf(filename);

  if (fs.existsSync(actualFilename)) {
    fs.moveSync(actualFilename, filename);
  }

  data.saved = true;
  return data;
}

module.exports = saveImageSnapshot;
