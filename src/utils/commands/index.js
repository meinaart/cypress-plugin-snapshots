/* globals Cypress */
/* eslint-env browser */
const { isElement } = require('lodash');

function getTest() {
  return Cypress.mocha.getRunner().test;
}

function getTestForTask(test) {
  if (!test) {
    test = getTest();
  }
  return {
    id: test.id,
    title: test.title,
    parent: test.parent && test.parent.title ? getTestForTask(test.parent) : null
  };
}

function getSubject(testSubject) {
  if (isHtml(testSubject)) {
    let result = '';
    Cypress.$(testSubject).each(function () {
      result += this.outerHTML;
    });
    return result;
  }
  return testSubject;
}

function isHtml(subject) {
  if (subject === undefined || subject === null) {
    return false;
  }
  return isElement(subject) ||
    subject.constructor.name === 'jQuery' || subject.constructor.prototype.jquery ||
    subject.constructor.name === 'HTMLCollection' || subject.constructor.name === 'NodeList' ||
    (Array.isArray(subject) && subject.length && isElement(subject[0]));
}

module.exports = {
  getSubject,
  getTest,
  getTestForTask,
  isHtml
};
