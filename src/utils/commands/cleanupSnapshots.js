/* globals Cypress, before, after, cy */
/* eslint-env browser */
const { formatNormalizedJson, } = require('../../utils/json');
const getTextSnapshotFilename = require('../text/getSnapshotFilename');
const { snapshotTitleIsUsed } = require('../../utils/snapshotTitles');
const getConfig = require('./getConfig');
const getSpec = require('./getSpec');
const { NO_LOG } = require('../../constants');

// Removes unused snapshots from snapshot file
function cleanUpSnapshots() {
  const config = getConfig();
  if (!config.autoCleanUp) {
    return;
  }

  getSpec().then((spec) => {
    const filename = getTextSnapshotFilename(spec.relative);
    Cypress.backend('read:file', filename).then((content) => {
      if (content) {
        const snapshot = JSON.parse(content);
        const keys = Object.keys(snapshot);

        const cleanSnapshot = keys
          .filter(snapshotTitleIsUsed)
          .reduce((result, key) => {
            result[key] = snapshot[key];
            return result;
          }, {});

        Cypress.backend('write:file', filename,
          formatNormalizedJson(cleanSnapshot));
      }
    });
  });
}

module.exports = cleanUpSnapshots;
