const {
  GET_FILE,
  MATCH_IMAGE,
  MATCH_TEXT,
  CLEANUP_FOLDERS,
  UPDATE_SNAPSHOT
} = require('./taskNames');
const getFile = require('./getFile');
const matchImageSnapshot = require('./matchImageSnapshot');
const matchTextSnapshot = require('./matchTextSnapshot');
const cleanupFolders = require('./cleanupFolders');
const updateSnapshot = require('./updateSnapshot');

module.exports = {
  [GET_FILE]: getFile,
  [MATCH_IMAGE]: matchImageSnapshot,
  [MATCH_TEXT]: matchTextSnapshot,
  [CLEANUP_FOLDERS]: cleanupFolders,
  [UPDATE_SNAPSHOT]: updateSnapshot
}
