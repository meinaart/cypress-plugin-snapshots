const crypto = require('crypto');
const path = require('path');
const { merge, cloneDeep } = require('lodash');

function createToken() {
  return crypto.randomBytes(64).toString('hex');
}

const DEFAULT_CONFIG = {
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
};

const CONFIG_KEY = 'cypress-plugin-snapshots';

let config = cloneDeep(DEFAULT_CONFIG);

function resolveModulePath(filename) {
  const fullPath = require.resolve(filename);
  const parentDir = path.dirname(__dirname);
  return path.join(
    'node_modules/',
    path.relative(parentDir, fullPath),
  );
}

function initConfig(initialConfig = {}) {
  config = merge(config, cloneDeep(initialConfig));
  config.DIFF_CSS_PATH = resolveModulePath('diff2html/dist/diff2html.css');
  config.DIFF_JS_PATH = resolveModulePath('diff2html/dist/diff2html.js');
  config.SOCKET_JS_PATH = resolveModulePath('socket.io-client/dist/socket.io.js');
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
  getConfig,
};
