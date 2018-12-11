const crypto = require('crypto');
const { merge, cloneDeep } = require('lodash');
const { TYPE_JSON } = require('./dataTypes');

function createToken() {
  return crypto.randomBytes(64).toString('hex');
}

const DEFAULT_SCREENSHOT_CONFIG = {
  blackout: [],
  capture: 'fullPage',
  clip: null,
  disableTimersAndAnimations: true,
  log: false,
  scale: false,
  timeout: 30000,
};

const DEFAULT_IMAGE_CONFIG = {
  createDiffImage: true,
  resizeDevicePixelRatio: true,
  threshold: 0.1,
  thresholdType: 'percent', // can be 'percent' or 'pixel'
};

const DEFAULT_CONFIG = Object.freeze({
  autoCleanUp: false,
  autopassNewSnapshots: true,
  diffLines: 3,
  excludeFields: [],
  ignoreExtraArrayItems: false,
  ignoreExtraFields: false,
  normalizeJson: true,
  prettier: true,
  imageConfig: DEFAULT_IMAGE_CONFIG,
  prettierConfig: {
    html: {
      parser: 'html',
      tabWidth: 2,
      endOfLine: 'lf'
    },
  },
  screenshotConfig: DEFAULT_SCREENSHOT_CONFIG,
  serverEnabled: true,
  serverHost: 'localhost',
  serverPort: 2121,
  token: createToken(),
  updateSnapshots: false,
});

const CONFIG_KEY = 'cypress-plugin-snapshots';

let config = DEFAULT_CONFIG;

function initConfig(initialConfig) {
  config = cloneDeep(DEFAULT_CONFIG);
  if (initialConfig) {
    merge(config, initialConfig);
  }
  return config;
}

function getConfig() {
  return config;
}

function getImageConfig(options = {}) {
  return Object.keys(DEFAULT_IMAGE_CONFIG)
    .filter((key) => options && options[key] !== undefined)
    .reduce(
      (imageConfig, key) => {
        imageConfig[key] = options[key];
        return imageConfig;
      },
      merge({}, DEFAULT_IMAGE_CONFIG, config.imageConfig)
    );
}


function getScreenshotConfig(options = {}) {
  const screenshotConfig = Object.keys(DEFAULT_SCREENSHOT_CONFIG)
    .filter((key) => options && options[key] !== undefined)
    .reduce(
      (imageConfig, key) => {
        imageConfig[key] = options[key];
        return imageConfig;
      },
      merge({}, DEFAULT_SCREENSHOT_CONFIG, config.screenshotConfig)
    );

  screenshotConfig.blackout = (screenshotConfig.blackout || []);
  screenshotConfig.blackout.push('.snapshot-diff');
  return screenshotConfig;
}

function getServerUrl(suppliedConfig) {
  const cfg = suppliedConfig || getConfig();
  return `http://${cfg.serverHost}:${cfg.serverPort}/?token=${cfg.token}`;
}

function shouldNormalize(dataType) {
  return dataType === TYPE_JSON && config.normalizeJson;
}

function getPrettierConfig(dataType) {
  return config.prettier ? config.prettierConfig[dataType] : undefined;
}

module.exports = {
  CONFIG_KEY,
  DEFAULT_IMAGE_CONFIG,
  DEFAULT_SCREENSHOT_CONFIG,
  getConfig,
  getImageConfig,
  getPrettierConfig,
  getScreenshotConfig,
  getServerUrl,
  initConfig,
  shouldNormalize,
};
