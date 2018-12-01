  describe('toMatchImageSnapshot', () => {

    it('toMatchImageSnapshot - element', () => {
      cy.visit('/static/stub.html')
        .then(() => {
          cy.wait(1000); // seems a bug with webfonts that requires this
          cy.get('[data-test=test]').toMatchImageSnapshot({
            threshold: 0.1
          });
        });
    });

    it('toMatchImageSnapshot - whole page', () => {
      cy.visit('/static/stub.html')
        .then(() => {
          cy.wait(1000); // seems a bug with webfonts that requires this
          cy.document().toMatchImageSnapshot({
            threshold: 0.1
          });
        });
    });
  });
