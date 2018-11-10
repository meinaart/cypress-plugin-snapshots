const rewire = require('rewire');

const DEFAULT_CONFIG = rewire('../../config').__get__('DEFAULT_CONFIG');

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

      const commands = rewire('../../utils/commands');
      commands.__set__('Cypress', global.Cypress);

      const getConfig = commands.__get__('getConfig');
      const config = getConfig();
      expect(config).toMatchObject(DEFAULT_CONFIG);
    });

    it('with config', () => {
      global.Cypress.env = () => CONFIG;
      const commands = rewire('../../utils/commands');
      commands.__set__('Cypress', global.Cypress);

      const getConfig = commands.__get__('getConfig');
      expect(getConfig()).toMatchObject(CONFIG);
    });

    it('without config - error should be thrown', () => {
      global.Cypress.env = () => undefined;
      const commands = rewire('../../utils/commands');
      commands.__set__('Cypress', global.Cypress);

      const getConfig = commands.__get__('getConfig');
      expect(() => { getConfig(); }).toThrow();
    });
  });
});
