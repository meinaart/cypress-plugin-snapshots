const {
  GET_FILE,
  MATCH_IMAGE,
  MATCH_TEXT,
  SAVE_IMAGE,
  SAVE_TEXT,
} = require('./taskNames');
const getFile = require('./getFile');
const matchImageSnapshot = require('./matchImageSnapshot');
const matchTextSnapshot = require('./matchTextSnapshot');
const saveImageSnapshot = require('./saveImageSnapshot');
const saveTextSnapshot = require('./saveTextSnapshot');

module.exports = {
  [GET_FILE]: getFile,
  [MATCH_IMAGE]: matchImageSnapshot,
  [MATCH_TEXT]: matchTextSnapshot,
  [SAVE_IMAGE]: saveImageSnapshot,
  [SAVE_TEXT]: saveTextSnapshot,
}
