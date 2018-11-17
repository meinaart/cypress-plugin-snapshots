/* eslint no-template-curly-in-string: 0 */
const configModule = require('../src/config');

jest.mock("../src/config.js");

jest.spyOn(configModule, 'initConfig')
  .mockImplementation((config) => config);

global.Cypress = {
  env: () => {},
  config: () => {},
  Commands: {
    add: jest.fn(),
  },
};

global.cy = {};

describe('plugin', () => {
  it('initPlugin', () => {
    const globalConfig = {
      env: {
        "cypress-plugin-snapshots": {
          "serverEnabled": false,
        }
      }
    };
    jest.spyOn(configModule, 'getConfig')
      .mockImplementation(() => globalConfig.env['cypress-plugin-snapshots']);
    const on = jest.fn();

    const { initPlugin } = require('../plugin');

    initPlugin(on, globalConfig);
    expect(on).toBeCalledTimes(1);
  });
});
