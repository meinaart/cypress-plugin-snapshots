const { Base64 } = require('js-base64');
const { cloneDeep } = require('lodash');
const { URL_PREFIX } = require('../../constants');
const { TYPE_IMAGE } = require('../../dataTypes');

function getErrorMessage(result) {
  if (result.dataType === TYPE_IMAGE) {
    return `Snapshots do not match.`;
  }

  return `Snapshots do not match:\n${result.diff}`;
}

function cleanupImage(image) {
  if (image) {
    image.path = image.relativePath;
    delete image.relativePath;
  }
}

function getLogMessage(result) {
  const linkResult = cloneDeep(result);
  if (linkResult.isImage) {
    cleanupImage(linkResult.actual);
    cleanupImage(linkResult.expected);
    cleanupImage(linkResult.diff);
  }

  const args = Base64.encode(JSON.stringify(linkResult));
  const passedMessage = result.expected ? 'Snapshots match' : 'Snapshot created, autopassed';
  const message = result.passed ?
    `[${passedMessage}](${URL_PREFIX}${args})` :
    `[compare snapshot](${URL_PREFIX}${args})`;

  return message;
}

function logMessage(result) {
  const { subject } = result;
  const message = getLogMessage(result);
  const log = Cypress.log({
    $el: subject,
    name: result.commandName,
    displayName: 'snapshot',
    message,
    consoleProps: () => result,
  });

  if (!result.passed) {
    log.set('state', 'failed');
    throw new Error(getErrorMessage(result));
  }

  return subject;
}

module.exports = logMessage;
