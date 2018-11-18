const { merge, cloneDeep } = require('lodash');
const rimraf = require('rimraf').sync;
const path = require('path');
const { getConfig } = require('../config');
const { getImageSnapshotFilename, getImageData } = require('../utils/imageSnapshots');
const saveImageSnapshot = require('./saveImageSnapshot');
const { getImageObject, compareImages, moveActualImageToSnapshotsDirectory, createDiffObject } = require('../utils/tasks/imageSnapshots');
const { IMAGE_TYPE_DIFF } = require('../constants');

function matchImageSnapshot(data = {}) {
  const {
    commandName,
    dataType,
    image,
    options,
    snapshotTitle,
    subject,
    testFile,
  } = data;
  const diffFilename = getImageSnapshotFilename(testFile, snapshotTitle, IMAGE_TYPE_DIFF);
  moveActualImageToSnapshotsDirectory(data);

  const config = merge({}, cloneDeep(getConfig()), options);
  const snapshotFile = getImageSnapshotFilename(testFile, snapshotTitle);
  const expected = getImageObject(snapshotFile);
  const exists = expected !== false;
  const autoPassed = (config.autopassNewSnapshots && expected === false);
  const actual = exists ? getImageObject(image.path) : image;
  const passed = expected && compareImages(expected, actual, diffFilename, options);

  let updated = false;

  if ((config.updateSnapshots && !passed) || expected === false) {
    saveImageSnapshot({ testFile, snapshotTitle, actual });
    updated = true;
  }

  if (passed) {
    rimraf(actual.path);
  }

  const diff = passed || autoPassed || !options.createDiffImage ?
    undefined : createDiffObject(diffFilename);

  const result = {
    actual: getImageData(actual),
    commandName,
    dataType,
    diff,
    exists,
    expected: getImageData(expected),
    passed: passed || autoPassed,
    snapshotFile: path.relative(process.cwd(), snapshotFile),
    snapshotTitle,
    subject,
    updated,
    isImage: true,
  };

  return result;
}

module.exports = matchImageSnapshot;
