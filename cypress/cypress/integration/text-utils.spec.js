const { cloneDeep } = require('lodash');
const { runSuites, dataRaw, dataFormatted } = require('../fixtures/test-data');
const { isHtml, getSubject } = require('../../../src/utils/commands/index');

describe('text - utils', () => {
  runSuites('isHtml', function (item, itemName, suiteName) {
    expect(isHtml(item)).to.equal(suiteName == 'html');
  });

  runSuites('getSubject', function (item, itemName, suiteName) {
    expect(getSubject(item)).to.equal(dataFormatted[suiteName][itemName]);
  });

  describe('normalizeObject', () => {
    it('true', () => {
      cy.wrap(dataRaw.json.object).toMatchSnapshot({ normalizeJson: true });
    });

    it('false', () => {
      cy.wrap(dataRaw.json.object).toMatchSnapshot({ normalizeJson: false });
    });
  });

  describe('removeExcludedFields', () => {
    it('removeExcludedFields', () => {
      const obj = {
        a: 1,
        ignore: 2,
        b: 3,
        ignore: 4,
        c: {
          a: 5,
          ignore: 6
        },
        d: [1, { ignore: 'a' }]
      };
      cy.wrap(obj).toMatchSnapshot();
    });
  });

  /* bug #32 */
  describe.skip('keepKeysFromExpected', ()=> {
    it('ignoreExtraFields: true, ignoreExtraArrayItems: false', () => {
      let obj = cloneDeep(dataRaw.json.object);
      obj.extraField = 'extraField';
      obj.nested.extraField = 'extraField';
      obj.array[4].extraField = 'extraField';
      obj.nested.array[6].extraField = 'extraField';

      cy.wrap(obj).toMatchSnapshot({
        ignoreExtraFields: true,
        ignoreExtraArrayItems: false
      });
    });

    it('ignoreExtraFields: false, ignoreExtraArrayItems: true', () => {
      let obj = cloneDeep(dataRaw.json.object);
      obj.array.push('extraItem');
      obj.nested.array.push('extraItem');

      cy.wrap(obj).toMatchSnapshot({
        ignoreExtraFields: false,
        ignoreExtraArrayItems: true
      });
    });

    it('ignoreExtraFields: true, ignoreExtraArrayItems: true', () => {
      let obj = cloneDeep(dataRaw.json.object);
      obj.extraField = 'extraField';
      obj.nested.extraField = 'extraField';
      obj.array[4].extraField = 'extraField';
      obj.nested.array[6].extraField = 'extraField';
      obj.array.push('extraItem');
      obj.nested.array.push('extraItem');

      cy.wrap(obj).toMatchSnapshot({
        ignoreExtraFields: true,
        ignoreExtraArrayItems: true
      });
    });
  });
});
