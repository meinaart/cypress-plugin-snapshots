/* eslint no-template-curly-in-string: 0 */
describe('utils/tasks/applyReplace', () => {
  const applyReplace = require('../../../src/utils/tasks/applyReplace');

  it('object replace', () => {
    const expected = {
      "text": "Hi ${name} & ${name}",
      "text2": "Hi ${name}",
    };
    const result = applyReplace(expected, {
      name: 'Meinaart',
    });
    expect(result).toMatchSnapshot();
  });
})
