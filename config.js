const crypto = require('crypto');
const merge = require('lodash').merge;
const clone = require('lodash').cloneDeep;

function createToken() {
  return crypto.randomBytes(64).toString('hex');
}

const DEFAULT_CONFIG = {
  autopassNewSnapshots: true,
  diffLines: 3,
  normalizeJson: true,
  serverEnabled: true,
  serverHost: 'localhost',
  serverPort: 2121,
  token: createToken(),
  updateSnapshots: false,
};

const CONFIG_KEY = 'cypress-plugin-snapshot';

let config = clone(DEFAULT_CONFIG);

function initConfig(initialConfig = {}) {
  config = merge(config, clone(initialConfig));
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