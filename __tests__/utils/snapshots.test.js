const { subjectToSnapshot } = require('../../utils/snapshots');
const configModule = require('../../config');

jest.mock("../../config.js");

jest.spyOn(configModule, 'initConfig')
  .mockImplementation((config) => config);

global.Cypress = {
  env: () => {},
  config: () => {},
  Commands: {
    add: jest.fn(),
  },
};

global.cy = {};

describe('utils/snapshot', () => {
  describe('keepKeysFromExpected', () => {
    const expected = {
      field: "value",
      items: [{
          name: "item1",
          "items": [{
            name: "subitem1"
          }]
        },
        {
          name: "item2"
        },
        {
          name: "item3"
        },
      ]
    };

    const actual = {
      field: "value",
      extra: "extra",
      items: [{
          name: "item1",
          "items": [{
            name: "subitem1",
            extra: 'extra1'
          }, {
            name: "subitem2",
            extra: 'extra2'
          }]
        },
        {
          name: "item2"
        },
        {
          name: "item3"
        },
        {
          name: "item4"
        },
      ]
    };

    it('ignoreExtraFields: false, ignoreExtraArrayItems: false', () => {
      const config = {
        ignoreExtraFields: false,
        ignoreExtraArrayItems: false,
      };
      jest.spyOn(configModule, 'getConfig').mockImplementation(() => config);

      const {
        keepKeysFromExpected
      } = require('../../utils/snapshots');

      const result = keepKeysFromExpected(actual, expected);
      expect(result).toMatchSnapshot();
    });

    it('ignoreExtraFields: true, ignoreExtraArrayItems: false', () => {
      const config = {
        ignoreExtraFields: true,
        ignoreExtraArrayItems: false,
      };
      jest.spyOn(configModule, 'getConfig').mockImplementation(() => config);

      const {
        keepKeysFromExpected
      } = require('../../utils/snapshots');
      const result = keepKeysFromExpected(actual, expected);
      expect(result).toMatchSnapshot();
    });

    it('ignoreExtraFields: true, ignoreExtraArrayItems: true', () => {
      const config = {
        ignoreExtraFields: true,
        ignoreExtraArrayItems: true,
      };
      jest.spyOn(configModule, 'getConfig').mockImplementation(() => config);
      const {
        keepKeysFromExpected
      } = require('../../utils/snapshots');

      const result = keepKeysFromExpected(actual, expected);
      expect(result).toMatchSnapshot();
    });

    it('ignoreExtraFields: false, ignoreExtraArrayItems: true', () => {
      const config = {
        ignoreExtraFields: false,
        ignoreExtraArrayItems: true,
      };
      jest.spyOn(configModule, 'getConfig').mockImplementation(() => config);

      const {
        keepKeysFromExpected
      } = require('../../utils/snapshots');

      const result = keepKeysFromExpected(actual, expected);
      expect(result).toMatchSnapshot();
    });
  });

  describe('subjectToSnapshot', () => {
    it('normalizes', () => {
      const normalized = subjectToSnapshot({
        foo: 'bar',
        bar: 'foo',
        sub: {
          foo: 'bar',
          bar: 'foo',
          asubsub: {
            foo: 'bar',
            bar: 'foo',
          }
        }
      }, true);

      expect(normalized).toMatchSnapshot();
    });
  });
});
