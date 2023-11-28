  describe('toMatchImageSnapshot', () => {

    it('toMatchImageSnapshot - element', () => {
      cy.visit('/static/stub.html')
        .then(() => {
          cy.get('[data-test=test]').toMatchImageSnapshot({
            threshold: 0.1
          });
        });
    });

    it('toMatchImageSnapshot - clipped element', () => {
      cy.visit('/static/stub2.html')
        .then(() => {
          cy.get('[data-test=test]').toMatchImageSnapshot({
            threshold: 0.1,
            clip: {
              x: 0,
              y: 0,
              width: 100,
              height: 100
            },
          });
        });
    });

    it('toMatchImageSnapshot - whole page', () => {
      cy.visit('/static/stub.html')
        .then(() => {
          cy.document().toMatchImageSnapshot({
            threshold: 0.1
          });
        });
    });

    it('toMatchImageSnapshot - no base snapshot', () => {
      cy.visit('/static/stub.html')
        .then(() => {
          cy.document().toMatchImageSnapshot({
            threshold: 0.1
          });
        });
    });

    it('toMatchImageSnapshot - with custom name', () => {
      cy.visit('/static/stub.html')
        .then(() => {
          cy.get('[data-test=test]').toMatchImageSnapshot({
            threshold: 0.1,
            name: 'screenshot with custom name'
          });
        });
    });


    it('toMatchImageSnapshot - multiple in one test', () => {
      cy.visit('/static/stub.html')
        .then(() => {
          cy.get('[data-test=test]').toMatchImageSnapshot({
            threshold: 0.1,
          });

          cy.get('[data-test=test2]').toMatchImageSnapshot({
            threshold: 0.1,
          });
        });
    });
  });
