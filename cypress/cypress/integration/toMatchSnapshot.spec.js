describe('toMatchSnapshot', () => {
  it('toMatchSnapshot - json', () => {
    cy.request('/static/stub.json')
      .its('body')
      .toMatchSnapshot();
  });

  it('toMatchSnapshot - html', () => {
    cy.visit('/static/stub.html')
      .then(() => {
        cy.get('[data-test=test]').toMatchSnapshot();
      });
  });

  it('toMatchSnapshot - html escaping', () => {
    cy.visit('/static/input.html')
      .then(() => {
        cy.get('#input-element').toMatchSnapshot();
      });
  });
});
