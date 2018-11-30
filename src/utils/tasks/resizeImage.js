const Jimp = require('jimp');
const fs = require('fs-extra');
const imageSize = require('image-size');

function resizeImage(filename, targetFile, devicePixelRatio) {
  if (devicePixelRatio !== 1 && fs.existsSync(filename)) {
    const dimensions = imageSize(filename);
    const height = Math.floor(dimensions.height / devicePixelRatio);
    const width = Math.floor(dimensions.width / devicePixelRatio);

    return Jimp.read(filename)
      .then(image => image
        .resize(width, height)
        .writeAsync(targetFile))
      .then(() => fs.remove(filename))
      .then(() => true)
      .catch(err => {
        throw new Error(err);
      });
  }

  return Promise.resolve(false);
}

module.exports = resizeImage;
