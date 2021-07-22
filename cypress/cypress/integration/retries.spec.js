/// <reference types="cypress" />

const {
  failBeforeRetry,
  verifySnapshotsExclude,
  verifySnapshots,
} = require('../support/testUtils');

if (+Cypress.version.slice(0, 1) < 5) {
  describe = function() {
    it('nothing to test, Cypress version < 5.0.0');
  };
}

describe('cypress retries', { retries: 2 }, () => {
  describe('textSnapshot', () => {
    it('retries after snapshot', () => {
      cy.wrap({ foo: true }).toMatchSnapshot();
      failBeforeRetry(2);
      verifySnapshots(['#0']);
      verifySnapshotsExclude(['#1']);
    });

    it('retries before snapshot', () => {
      failBeforeRetry(2);
      cy.wrap({ foo: true }).toMatchSnapshot();
      verifySnapshots(['#0']);
      verifySnapshotsExclude(['#1']);
    });

    it('retries between snapshots', () => {
      cy.wrap({ foo: true }).toMatchSnapshot();
      failBeforeRetry(2);
      cy.wrap({ foo: true }).toMatchSnapshot();
      verifySnapshots(['#0', '#1']);
      verifySnapshotsExclude(['#2']);
    });
  });
  describe('imageSnapshot', () => {
    it('retries after snapshot', () => {
      cy.visit('/static/stub.html');
      failBeforeRetry(2);
      cy.document().toMatchImageSnapshot({
        threshold: 0.1,
      });
      failBeforeRetry(2);
    });

    it('retries before snapshot', () => {
      cy.visit('/static/stub.html');
      cy.document().toMatchImageSnapshot({
        threshold: 0.1,
      });
      failBeforeRetry(2);
    });

    it('retries between snapshots', () => {
      cy.visit('/static/stub.html');
      cy.document().toMatchImageSnapshot({
        threshold: 0.1,
      });
      failBeforeRetry(2);
      cy.document().toMatchImageSnapshot({
        threshold: 0.1,
      });
    });

    it('retries with named snapshots', () => {
      cy.visit('/static/stub.html');
      cy.document().toMatchImageSnapshot({
        threshold: 0.1,
        name: 'foo',
      });
      failBeforeRetry(2);
    });
  });
});
