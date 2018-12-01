
describe('utils/keepKeysFromExpected', () => {
  const expected = {
    field: "value",
    items: [
      {name: "item1", "items": [{name: "subitem1"}]},
      {name: "item2"},
      {name: "item3"},
    ]
  };

  const actual = {
    field: "value",
    extra: "extra",
    items: [
      {name: "item1", "items": [{name: "subitem1", extra: 'extra1'}, {name: "subitem2", extra: 'extra2'}]},
      {name: "item2"},
      {name: "item3"},
      {name: "item4"},
    ]
  };

  it('ignoreExtraFields: false, ignoreExtraArrayItems: false', () => {
    const config = {
      ignoreExtraFields: false,
      ignoreExtraArrayItems: false,
    };
    const keepKeysFromExpected = require('../../src/utils/keepKeysFromExpected');
    const result = keepKeysFromExpected(actual, expected, config);
    expect(result).toMatchSnapshot();
  });

  it('ignoreExtraFields: true, ignoreExtraArrayItems: false', () => {
    const config = {
      ignoreExtraFields: true,
      ignoreExtraArrayItems: false,
    };
    const keepKeysFromExpected = require('../../src/utils/keepKeysFromExpected');
    const result = keepKeysFromExpected(actual, expected, config);
    expect(result).toMatchSnapshot();
  });

  it('ignoreExtraFields: true, ignoreExtraArrayItems: true', () => {
    const config = {
      ignoreExtraFields: true,
      ignoreExtraArrayItems: true,
    };
    const keepKeysFromExpected = require('../../src/utils/keepKeysFromExpected');
    const result = keepKeysFromExpected(actual, expected, config);
    expect(result).toMatchSnapshot();
  });

  it('ignoreExtraFields: false, ignoreExtraArrayItems: true', () => {
    const config = {
      ignoreExtraFields: false,
      ignoreExtraArrayItems: true,
    };
    const keepKeysFromExpected = require('../../src/utils/keepKeysFromExpected');
    const result = keepKeysFromExpected(actual, expected, config);
    expect(result).toMatchSnapshot();
  });
});
