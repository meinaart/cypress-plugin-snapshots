const { initCommands } = require('../commands');

global.Cypress = {
  env: () => {},
  config: () => {},
  Commands: {
    add: jest.fn(),
  },
};

global.cy = {};

describe('command', () => {
  it('should create command', () => {
    global.before = jest.fn();
    global.after = jest.fn();

    initCommands();
    global.cy.task = jest.fn().mockResolvedValue({ pass: true });

    expect(global.Cypress.Commands.add).toBeCalled();
    expect(global.Cypress.Commands.add.mock.calls.length).toEqual(1);
    expect(global.Cypress.Commands.add.mock.calls[0][0]).toEqual('toMatchSnapshot');
    expect(global.after).toBeCalled();
    expect(global.before).toBeCalled();
  });
});
