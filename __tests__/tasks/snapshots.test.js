/* eslint no-template-curly-in-string: 0 */
describe('tasks/snapshots', () => {
  describe('applyReplace', () => {
    const {
      applyReplace
    } = require('../../tasks/snapshots');

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
  });
})
