const { runSuites } = require('../fixtures/test-data');

describe('toMatchSnapshot', () => {
  it('html escaping', () => {
    cy.visit('/static/input.html')
      .then(() => {
        cy.get('#input-element').toMatchSnapshot();
      });
  });

  /* bug #65 - [date, string] */
  runSuites('toMatchSnapshot', function (item) {
    cy.wrap(item).toMatchSnapshot();
  }, ['date', 'string']);
});
