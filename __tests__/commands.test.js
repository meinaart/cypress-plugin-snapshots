const { after, Cypress, cy } = global;
const { initCommands } = require('../commands');

describe('commands', () => {
  it('initCommands', () => {

    cy.task = jest.fn().mockResolvedValueOnce({ passed: true });

    initCommands();

    expect(Cypress.Commands.add).toBeCalled();
    expect(Cypress.Commands.add.mock.calls.length).toEqual(2);
    expect(Cypress.Commands.add.mock.calls[0][0]).toEqual('toMatchSnapshot');
    expect(after).toBeCalled();
  });
});
