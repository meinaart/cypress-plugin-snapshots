/* globals Cypress, before, after, cy */
/* eslint-env browser */
const { MATCH_TEXT } = require('../tasks/taskNames');
const getTaskData = require('../utils/commands/getTaskData');
const logMessage = require('../utils/commands/logMessage');
const { NO_LOG } = require('../constants');
const { COMMAND_MATCH_SNAPSHOT: commandName } = require('./commandNames');

function toMatchSnapshot(subject, options, isRetry = false) {
  return getTaskData({
      commandName,
      options,
      subject,
      isRetry,
    }).then(taskData => cy.task(
        MATCH_TEXT,
        taskData,
        NO_LOG
      ).then((result) => {
        if (!result.passed && options.retryCount > 0) {
          return cy.wait(options.retryDelay).then(() => {
            const newOptions = {
              ...options,
              retryCount: options.retryCount - 1,
            };
            toMatchSnapshot(subject, newOptions, true);
          });
        }
        return logMessage(result);
      })
    );
}

module.exports = toMatchSnapshot;
