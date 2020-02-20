const { merge, cloneDeep, clone, pick } = require('lodash');
const { COMMAND_MATCH_SNAPSHOT } = require('./commands/commandNames');

const CONFIG_KEY = 'cypress-plugin-snapshots';

const DEFAULT_IMAGE_CONFIG = Object.freeze({
  failOnSnapshotDiff: true,
  createDiffImage: true,
  resizeDevicePixelRatio: true,
  threshold: 0.1,
  thresholdType: 'percent' // can be 'percent' or 'pixel'
});

const DEFAULT_CONFIG = Object.freeze({
  autoCleanUp: false,
  autopassNewSnapshots: true,
  diffLines: 3,
  excludeFields: [],
  formatJson: true,
  ignoreExtraArrayItems: false,
  ignoreExtraFields: false,
  imageConfig: clone(DEFAULT_IMAGE_CONFIG),
  normalizeJson: true,
  prettier: true,
  prettierConfig: {
    html: {
      parser: 'html',
      tabWidth: 2,
      endOfLine: 'lf'
    }
  },
  screenshotConfig: {
    blackout: ['.snapshot-diff'],
    log: false
  },
  updateSnapshots: false,
  backgroundBlend: 'difference',
  diffFormat: 'side-by-side'
});

let config = cloneDeep(DEFAULT_CONFIG);

function initConfig(initialConfig) {
  config = merge({}, DEFAULT_CONFIG, initialConfig);

  config.screenshotConfig.blackout = config.screenshotConfig.blackout || [];
  if (!config.screenshotConfig.blackout.includes('.snapshot-diff')) {
    config.screenshotConfig.blackout.push('.snapshot-diff');
  }
  return config;
}

function getConfig() {
  return config;
}

function mergeConfig(commandName, taskOptions) {
  const options = cloneDeep(config);

  if (commandName === COMMAND_MATCH_SNAPSHOT) {
    merge(options, taskOptions);
    return pick(options, Object.keys(DEFAULT_CONFIG));
  }

  const screenshotConfigOptions = [
    'log',
    'blackout',
    'capture',
    'clip',
    'disableTimersAndAnimations',
    'padding',
    'scale',
    'timeout',
    'onBeforeScreenshot',
    'onAfterScreenshot'
  ];

  merge(options.imageConfig, pick(taskOptions, Object.keys(DEFAULT_CONFIG.imageConfig)));
  merge(options.screenshotConfig, pick(taskOptions, screenshotConfigOptions));

  if (taskOptions && taskOptions.name) {
    options.name = taskOptions.name;
  }

  return options;
}

module.exports = {
  CONFIG_KEY,
  DEFAULT_IMAGE_CONFIG,
  initConfig,
  getConfig,
  mergeConfig
};
