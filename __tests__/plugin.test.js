/* eslint no-template-curly-in-string: 0 */
const { initPlugin } = require('../plugin');

describe('plugin', () => {
  it('initPlugin', () => {
    const on = jest.fn();

    initPlugin(on, { });
    expect(on).toBeCalledTimes(2);
  });
});
