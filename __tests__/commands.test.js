const { before, after, Cypress } = global;
const configMock = require('../src/config');

describe('commands', () => {
  const initConfigSpy = jest.spyOn(configMock, 'initConfig');

  it('initCommands - isHeadless = true', () => {
    const { initCommands } = require('../commands');
    initCommands();

    expect(Cypress.Commands.add).toBeCalled();
    expect(Cypress.Commands.add.mock.calls.length).toEqual(2);
    expect(Cypress.Commands.add.mock.calls[0][0]).toEqual('toMatchSnapshot');
    expect(before).not.toBeCalled(); // isHeadless = true
    expect(after).toBeCalled();
  });

  it('initCommands - isHeadless = false', () => {
    const { initCommands } = require('../commands');
    Cypress.browser.isHeadless = false;
    initCommands();
    expect(before).toBeCalled(); // isHeadless = false
  });

  [
    {
      title: 'empty config',
      config: {}
    },
    {
      title: 'custom config',
      config: {
        autoCleanUp: true,
        excludeFields: ['exclude'],
        imageConfig: {
          createDiffImage: false
        },
        screenshotConfig: {
          blackout: ['blackout']
        }
      }
    }
  ].forEach((item) => {
    it(item.title, () => {
      Cypress.env.mockReturnValueOnce(item.config);
      const { initCommands } = require('../commands');
      initCommands();

      const actual = initConfigSpy.mock.results[0].value;

      expect(actual).toMatchSnapshot();
    });
  });
});
