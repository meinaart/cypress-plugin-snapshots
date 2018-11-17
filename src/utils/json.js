function formatJson(subject) {
  return JSON.stringify(subject, undefined, 2);
}

function formatNormalizedJson(subject) {
  return formatJson(normalizeObject(subject));
}

function normalizeObject(subject) {
  if (Array.isArray(subject)) {
    return subject.map(normalizeObject);
  }

  if (typeof subject === 'object' && subject !== null) {
    const keys = Object.keys(subject);
    keys.sort();

    return keys.reduce((result, key) => {
      result[key] = normalizeObject(subject[key]);
      return result;
    }, {});
  }

  return subject;
}

module.exports = {
  formatNormalizedJson,
  formatJson,
  normalizeObject,
};
