/* globals cy */
/* eslint-env browser */
const { merge } = require('lodash');
const { MATCH_IMAGE } = require('../tasks/taskNames');
const getTaskData = require('../utils/commands/getTaskData');
const logMessage = require('../utils/commands/logMessage');
const { NO_LOG } = require('../constants');
const { COMMAND_MATCH_IMAGE_SNAPSHOT: commandName } = require('./commandNames');
const getImageData = require('../utils/image/getImageData');
const { getImageConfig, getConfig, getScreenshotConfig, getCustomName, getCustomSeparator } = require('../config');

function afterScreenshot(taskData) {
  return ($el, props) => {
    // See this url for contents of `props`:
    // https://docs.cypress.io/api/commands/screenshot.html#Get-screenshot-info-from-the-onAfterScreenshot-callback
    const win = $el.get(0).ownerDocument.defaultView;
    taskData.image = getImageData(props, win.devicePixelRatio);
    taskData.isImage = true;
    delete taskData.subject;
  };
}

async function toMatchImageSnapshot(subject, commandOptions) {
  const options = merge({}, getConfig(), { imageConfig: getImageConfig(commandOptions), screenshotConfig: getScreenshotConfig(commandOptions), pixelMatchConfig: commandOptions.pixelMatch});
  const { screenshotConfig } = options;
  const customName = getCustomName(commandOptions);
  const customSeparator = getCustomSeparator(commandOptions);

  const taskData = await getTaskData({
    commandName,
    options,
    customName,
    customSeparator,
    subject,
  });

  const afterScreenshotFn = afterScreenshot(taskData);
  if (screenshotConfig.onAfterScreenshot) {
    const afterScreenshotCallback = screenshotConfig.onAfterScreenshot;
    screenshotConfig.onAfterScreenshot = (...args) => {
      afterScreenshotFn.apply(this, args);
      afterScreenshotCallback.apply(this, args);
    }
  } else {
    screenshotConfig.onAfterScreenshot = afterScreenshotFn;
  }

  return cy.wrap(subject, NO_LOG)
    .screenshot(taskData.snapshotTitle, screenshotConfig)
    .then(() => cy.task(
        MATCH_IMAGE,
        taskData,
        NO_LOG
      ).then(logMessage)
    );
}

module.exports = toMatchImageSnapshot;
