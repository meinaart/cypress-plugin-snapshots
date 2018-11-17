describe('toMatchImageSnapshot', () => {

  it('toMatchImageSnapshot - element', () => {
    cy.visit('/static/stub.html')
      .then(() => {
        cy.get('[data-test=test]').toMatchImageSnapshot();
      });
  });

  it('toMatchImageSnapshot - whole page', () => {
    cy.visit('/static/stub.html')
      .then(() => {
        cy.document().toMatchImageSnapshot();
      });
  });
});
