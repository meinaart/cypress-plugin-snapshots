const { Base64 } = require('js-base64');
const { cloneDeep } = require('lodash');
const { URL_PREFIX } = require('../../constants');

function cleanupImage(image) {
  if (image) {
    image.path = image.relativePath;
    delete image.relativePath;
  }
}

function getLogMessage(result) {
  const linkResult = cloneDeep(result);
  if (linkResult.isImage) {
    linkResult.expected.relativePath = linkResult.expected.relativePath || linkResult.snapshotFile;
    cleanupImage(linkResult.actual);
    cleanupImage(linkResult.expected);
    cleanupImage(linkResult.diff);
  }

  const args = Base64.encode(JSON.stringify(linkResult));
  return `[ ](${URL_PREFIX}${args})`;
}

function logMessage(result) {
  const {
    passed,
    exists,
    updated
  } = result;

  if (passed) {
    result.state = 'passed';
  } else if(!exists) {
    result.state = 'new';
  } else if (updated) {
    result.state = 'updated';
  } else {
    result.state = 'failed';
  }

  const log = Cypress.log({
    name: result.commandName,
    displayName: 'snapshot',
    message: getLogMessage(result),
    consoleProps: () => result
  });

  log.set('state', result.state);

  if (!passed) {
    throw new Error('Snapshots do not match.');
  }

  return result;
}

module.exports = logMessage;
