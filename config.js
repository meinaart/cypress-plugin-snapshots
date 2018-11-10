const crypto = require('crypto');
const { merge, cloneDeep } = require('lodash');

function createToken() {
  return crypto.randomBytes(64).toString('hex');
}

const DEFAULT_CONFIG = Object.freeze({
  autoCleanUp: false,
  autopassNewSnapshots: true,
  diffLines: 3,
  excludeFields: [],
  ignoreExtraFields: false,
  ignoreExtraArrayItems: false,
  normalizeJson: true,
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

function getServerUrl(suppliedConfig) {
  const cfg = suppliedConfig || getConfig();
  return `http://${cfg.serverHost}:${cfg.serverPort}/?token=${cfg.token}`;
}

module.exports = {
  CONFIG_KEY,
  initConfig,
  getServerUrl,
  getConfig
};
