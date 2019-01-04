function removeExcludedFields(subject, excludedFields) {
  if (excludedFields) {
    if (Array.isArray(subject)) {
      return subject.map(item => removeExcludedFields(item, excludedFields));
    }

    if (typeof subject === 'object' && subject !== null) {
      return Object.keys(subject)
        .filter(key => excludedFields.indexOf(key) === -1)
        .reduce((result, key) => {
          result[key] = removeExcludedFields(subject[key], excludedFields);
          return result;
        }, {});
    }
  }

  return subject;
}

module.exports = removeExcludedFields;
