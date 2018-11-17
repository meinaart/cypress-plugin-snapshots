/**
 * Apply optional `replace` functionality coming from `options` supplied to `toMatchSnapshot`.
 *
 * You can use either an object containing key/value pair or a function to handle replacement.
 *
 * @param {Object} expected - Object to replace values in
 * @param {Object=} replace - Object containing replacements
 * @returns {Object}
 */
function applyReplace(expected, replace) {
  if (typeof expected !== 'object' || !replace) {
    return expected;
  }

  if (typeof replace === 'object') {
    const jsonString = Object.keys(replace)
      .reduce((result, key) => result.replace(
        new RegExp(`\\$\\{${key}\\}`, 'g'),
        replace[key]
      ), JSON.stringify(expected));
    return JSON.parse(jsonString);
  }

  return expected;
}

module.exports = applyReplace;
