const rewire = require('rewire');

const DEFAULT_CONFIG = rewire('../../src/config').__get__('DEFAULT_CONFIG');

global.Cypress = {
  env: () => {},
  config: () => {},
  Commands: {
    add: jest.fn(),
  },
};

global.cy = {};

describe('utils/command', () => {
  describe('should retrieve config', () => {
    const CONFIG = {
      foo: 'bar',
    };

    it('with string config', () => {
      let returnValue = JSON.stringify(DEFAULT_CONFIG);
      global.Cypress.env = (name, value) => {
        if (value) {
          returnValue = value;
        }
        return returnValue;
      };

      const getConfig = require('../../src/utils/commands/getConfig');
      expect(getConfig()).toMatchObject(DEFAULT_CONFIG);
    });

    it('with config', () => {
      global.Cypress.env = () => CONFIG;
      const getConfig = require('../../src/utils/commands/getConfig');
      expect(getConfig()).toMatchObject(CONFIG);
    });

    it('without config - error should be thrown', () => {
      global.Cypress.env = () => undefined;
      const getConfig = require('../../src/utils/commands/getConfig');
      expect(() => { getConfig(); }).toThrow();
    });
  });
});
