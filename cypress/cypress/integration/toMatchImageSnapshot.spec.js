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

    it('toMatchImageSnapshot - clipped element', () => {
      cy.visit('/static/stub2.html')
        .then(() => {
          cy.wait(1000); // seems a bug with webfonts that requires this
          cy.get('[data-test=test]').toMatchImageSnapshot({
            threshold: 0.1,
            clip: { x: 0, y: 0, width: 100, height: 100 },
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

    it('toMatchImageSnapshot - no base snapshot', () => {
      cy.visit('/static/stub.html')
        .then(() => {
          cy.wait(1000); // seems a bug with webfonts that requires this
          cy.document().toMatchImageSnapshot({
            threshold: 0.1
          });
        });
    });

    it('toMatchImageSnapshot - with custom name', () => {
      cy.visit('/static/stub.html')
        .then(() => {
          cy.wait(1000); // seems a bug with webfonts that requires this
          cy.get('[data-test=test]').toMatchImageSnapshot({
            threshold: 0.1,
            name: 'screenshot with custom name'
          });
        });
    });
  });
