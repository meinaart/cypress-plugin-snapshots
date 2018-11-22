const fs = require('fs-extra');
const rimraf = require('rimraf').sync;
const sharp = require('sharp');
const imageSize = require('image-size');

function resizeImage(filename, targetFile, devicePixelRatio = 1) {
  if (devicePixelRatio !== 1 && fs.existsSync(filename)) {
    const dimensions = imageSize(filename);
    const targetHeight = Math.floor(dimensions.height / devicePixelRatio);
    const targetWidth = Math.floor(dimensions.width / devicePixelRatio);

    return sharp(filename)
      .resize(targetWidth, targetHeight)
      .toFile(targetFile)
      .then(() => {
        rimraf(filename);
        return true;
      });
  }

  return Promise.resolve(false);
}

module.exports = resizeImage;