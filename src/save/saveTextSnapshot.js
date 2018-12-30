const { merge } = require('lodash');
const { updateSnapshot } = require('../utils/tasks/textSnapshots');

function saveTextSnapshot(data) {
  const {
    snapshotFile,
    snapshotTitle,
    subject
  } = data;
  updateSnapshot(snapshotFile, snapshotTitle, subject);
  return merge({}, data, {
    saved: true
  });
}

module.exports = saveTextSnapshot;
