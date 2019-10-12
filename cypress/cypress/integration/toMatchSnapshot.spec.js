const { runSuites } = require('../fixtures/test-data');

describe('toMatchSnapshot', () => {
  it('html escaping', () => {
    cy.visit('/static/input.html')
      .then(() => {
        cy.get('#input-element').toMatchSnapshot();
      });
  });

  /* bug #34 - [undefined, null, false] */
  /* bug #65 - [date, string] */
  runSuites('toMatchSnapshot', function (item) {
    cy.wrap(item).toMatchSnapshot();
  }, ['undefined', 'null', 'false', 'date', 'string']);
});
