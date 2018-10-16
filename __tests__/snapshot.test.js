const { subjectToSnapshot } = require('../snapshot');

describe('snapshot', () => {
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