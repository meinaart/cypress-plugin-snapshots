const { Cypress } = global;
const rewire = require('rewire');

const DEFAULT_CONFIG = rewire('../../../src/config').__get__('DEFAULT_CONFIG');

describe('utils/command', () => {
  describe('should retrieve config', () => {
    const CONFIG = {
      foo: 'bar',
    };

    it('with string config', () => {
      let returnValue = JSON.stringify(DEFAULT_CONFIG);
      Cypress.env = (name, value) => {
        if (value) {
          returnValue = value;
        }
        return returnValue;
      };

      const getConfig = require('../../../src/utils/commands/getConfig');
      expect(getConfig()).toMatchObject(DEFAULT_CONFIG);
    });

    it('with config', () => {
      Cypress.env = () => CONFIG;
      const getConfig = require('../../../src/utils/commands/getConfig');
      expect(getConfig()).toMatchObject(CONFIG);
    });

    it('without config - error should be thrown', () => {
      Cypress.env = () => undefined;
      const getConfig = require('../../../src/utils/commands/getConfig');
      expect(() => { getConfig(); }).toThrow();
    });
  });
});
