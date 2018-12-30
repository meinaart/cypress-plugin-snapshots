const {
  GET_FILE,
  MATCH_IMAGE,
  MATCH_TEXT
} = require('./taskNames');
const getFile = require('./getFile');
const matchImageSnapshot = require('./matchImageSnapshot');
const matchTextSnapshot = require('./matchTextSnapshot');

module.exports = {
  [GET_FILE]: getFile,
  [MATCH_IMAGE]: matchImageSnapshot,
  [MATCH_TEXT]: matchTextSnapshot,
}
