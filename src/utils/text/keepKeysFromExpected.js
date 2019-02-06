/**
 * Create new object based on `subject` that do only contains fields that exist in `expected`
 * @param {Object} subject
 * @param {Object} expected
 * @returns {Object}
 */
function keepKeysFromExpected(subject, expected, keepConfig) {
  const cfg = keepConfig;

  if (Array.isArray(expected) && Array.isArray(subject)) {
    const origin = cfg.ignoreExtraArrayItems ? expected : subject;

    const result = origin
      .filter((value, index) => index < subject.length)
      .map((value, index) => keepKeysFromExpected(subject[index], expected[index] || value, cfg));

    // Add extra items not existing in expected from subject to result
    if (!cfg.ignoreExtraArrayItems && subject.length > expected.length) {
      return [...result, ...subject.slice(result.length, subject.length)];
    }

    return result;
  }
  if (expected && subject && typeof expected === 'object' && typeof subject === 'object') {
    const origin = cfg.ignoreExtraFields ? expected : subject;
    return Object.keys(origin)
      .reduce((result, key) => {
        result[key] = keepKeysFromExpected(subject[key], expected[key], cfg);
        return result;
      }, {});
  }

  return subject;
}

module.exports = keepKeysFromExpected;
