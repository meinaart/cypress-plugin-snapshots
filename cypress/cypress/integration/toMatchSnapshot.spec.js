const { runSuites } = require('../fixtures/test-data');

describe('toMatchSnapshot', () => {
  it('html escaping', () => {
    cy.visit('/static/input.html')
      .then(() => {
        cy.get('#input-element').toMatchSnapshot();
      });
  });

  runSuites('toMatchSnapshot', function (item) {
    cy.wrap(item).toMatchSnapshot();
  });
});
