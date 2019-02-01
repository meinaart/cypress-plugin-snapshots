describe('utils/keepKeysFromExpected', () => {
  const expected = {
    field: 'value',
    undefined: undefined,
    null: null,
    items: [
      { name: 'item1', items: [{ name: 'subitem1' }] },
      { name: 'item2' },
      { name: 'item3' },
      { name: null },
      { name: undefined },
      null,
      undefined,
    ],
  };

  const actual = {
    field: 'value',
    undefined: undefined,
    null: null,
    extra: 'extra',
    extraUndefined: undefined,
    extraNull: null,
    items: [
      {
        name: 'item1',
        items: [
          { name: 'subitem1', extra: 'extra1' },
          {
            name: 'subitem2',
            extra: 'extra2',
            undefined: undefined,
            null: null,
            extraUndefined: undefined,
            extraNull: null,
          },
          null,
          undefined,
        ],
      },
      { name: 'item2' },
      { name: 'item3' },
      { name: null },
      { name: undefined },
      null,
      undefined,
      { name: 'item4' },
      { name: null },
      { name: undefined },
    ],
  };

  it('ignoreExtraFields: false, ignoreExtraArrayItems: false', () => {
    const config = {
      ignoreExtraFields: false,
      ignoreExtraArrayItems: false,
    };
    const keepKeysFromExpected = require('../../../src/utils/text/keepKeysFromExpected');
    const result = keepKeysFromExpected(actual, expected, config);
    expect(result).toMatchSnapshot();
  });

  it('ignoreExtraFields: true, ignoreExtraArrayItems: false', () => {
    const config = {
      ignoreExtraFields: true,
      ignoreExtraArrayItems: false,
    };
    const keepKeysFromExpected = require('../../../src/utils/text/keepKeysFromExpected');
    const result = keepKeysFromExpected(actual, expected, config);
    expect(result).toMatchSnapshot();
  });

  it('ignoreExtraFields: true, ignoreExtraArrayItems: true', () => {
    const config = {
      ignoreExtraFields: true,
      ignoreExtraArrayItems: true,
    };
    const keepKeysFromExpected = require('../../../src/utils/text/keepKeysFromExpected');
    const result = keepKeysFromExpected(actual, expected, config);
    expect(result).toMatchSnapshot();
  });

  it('ignoreExtraFields: false, ignoreExtraArrayItems: true', () => {
    const config = {
      ignoreExtraFields: false,
      ignoreExtraArrayItems: true,
    };
    const keepKeysFromExpected = require('../../../src/utils/text/keepKeysFromExpected');
    const result = keepKeysFromExpected(actual, expected, config);
    expect(result).toMatchSnapshot();
  });
});
