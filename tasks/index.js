const {
  GET_FILE,
  MATCH,
  SAVE
} = require('./task-names');
const { matchSnapshot, saveSnapshot } = require('./snapshots');
const { getFile } = require('./get-file');

module.exports = {
  [GET_FILE]: getFile,
  [MATCH]: matchSnapshot,
  [SAVE]: saveSnapshot,
}
