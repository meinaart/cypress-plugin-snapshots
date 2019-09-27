const {
  GET_FILE,
  MATCH_IMAGE,
  MATCH_TEXT,
  CLEANUP_FOLDERS
} = require('./taskNames');
const getFile = require('./getFile');
const matchImageSnapshot = require('./matchImageSnapshot');
const matchTextSnapshot = require('./matchTextSnapshot');
const cleanupFolders = require('./cleanupFolders');

module.exports = {
  [GET_FILE]: getFile,
  [MATCH_IMAGE]: matchImageSnapshot,
  [MATCH_TEXT]: matchTextSnapshot,
  [CLEANUP_FOLDERS]: cleanupFolders
}
