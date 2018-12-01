const fs = require('fs');
const path = require('path');
const PATHS = require('../paths');

function getFile(filename) {
  if (Object.values(PATHS).indexOf(filename) === -1) {
    throw new Error(`Path not allowed: ${filename}`);
  }

  const fullPath = filename.match(/^\.\//) ?
    path.join(path.resolve(__dirname, '../../', filename)) :
    require.resolve(filename);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File '${filename}' cannot be found. Location: '${fullPath}'`);
  }

  return fs.readFileSync(fullPath, {encoding: 'utf8'});
}

module.exports = getFile;
