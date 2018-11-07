describe('Test', () => {
  it('toMatchSnapshot', () => {
    cy.request('/static/stub.json')
      .its('body')
      .toMatchSnapshot();
  });
});
