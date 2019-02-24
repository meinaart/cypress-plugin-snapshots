const { merge } = require('lodash');
const { updateSnapshot } = require('../utils/tasks/textSnapshots');

function saveTextSnapshot(data) {
  const {
    snapshotFile,
    snapshotTitle,
    subject,
    dataType,
  } = data;
  updateSnapshot(snapshotFile, snapshotTitle, subject, dataType);
  return merge({}, data, {
    saved: true
  });
}

module.exports = saveTextSnapshot;
