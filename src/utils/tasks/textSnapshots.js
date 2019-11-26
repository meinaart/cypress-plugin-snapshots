const path = require('path');
const fs = require('fs-extra');
const unidiff = require('unidiff');
const prettier = require('prettier');
const { TYPE_JSON } = require('../../dataTypes');
const { getConfig } = require('../../config');
const removeExcludedFields = require('../text/removeExcludedFields');
const { formatJson, normalizeObject } = require('../json');

function shouldNormalize(dataType, cfg) {
  return dataType === TYPE_JSON && cfg.normalizeJson;
}

function getPrettierConfig(dataType, cfg) {
  return cfg.prettier && cfg.prettierConfig ? cfg.prettierConfig[dataType] : undefined;
}

function subjectToSnapshot(subject, dataType = TYPE_JSON, config = {}) {
  let result = subject;

  if (typeof subject === 'object' && shouldNormalize(dataType, config)) {
    result = normalizeObject(subject);
  }

  if (dataType === TYPE_JSON && config && config.excludeFields) {
    result = removeExcludedFields(result, config.excludeFields);
  }

  const prettierConfig = getPrettierConfig(dataType, config);
  if (prettierConfig) {
    try {
      if (typeof result === 'object') {
        result = formatJson(result, undefined, 2);
      }

      result = prettier.format(result.trim(), prettierConfig).trim();
    } catch(err) {
      throw new Error(`Cannot format subject: ${result}`);
    }
  } else if(dataType === TYPE_JSON && config.formatJson) {
    result = formatJson(result);
  }

  return result;
}

function formatDiff(subject) {
  if (typeof subject === 'object') {
    return formatJson(subject);
  }
  return String(subject || '');
}

function getDiff(expected, actual, snapshotTitle) {
  return unidiff.diffAsText(formatDiff(expected), formatDiff(actual), {
    aname: snapshotTitle,
    bname: snapshotTitle,
    context: getConfig().diffLines
  });
}

function createDiff(expected, actual, snapshotTitle) {
  return getDiff(expected, actual, snapshotTitle) || getDiff('', expected, snapshotTitle);
}

function getSnapshot(filename, snapshotTitle, dataType = TYPE_JSON, config = {}) {
  fs.ensureDirSync(path.dirname(filename));

  if (fs.existsSync(filename)) {
    const snapshots = readFile(filename);
    let snap = snapshots[snapshotTitle];
    if(snap === undefined) {
      return false;
    }
    if (snap && snap.replace) {
      snap = snap.replace(/^\n|\n$/g, '');
    }
    return subjectToSnapshot(snap, dataType, config);
  }

  fs.writeFileSync(filename, '{}');
  return false;
}

function readFile(filename) {
  if (fs.existsSync(filename)) {
    let content;
    try {
      delete require.cache[filename];
      content = require(filename); // eslint-disable-line import/no-dynamic-require
    } catch(ex) {
      // eslint-disable-next-line no-console
      console.warn(`Cannot read snapshot file "${filename}" as javascript, falling back to JSON parser:`, ex);
      const fileContents = fs.readFileSync(filename, 'utf8');

      if (!fileContents || !fileContents.trim() || fileContents.trim().slice(0, 1) !== '{') {
        throw new Error(`Cannot load snapshot file. File "${filename} does not contain valid JSON or javascript`);
      }

      try {
        content = JSON.parse(fileContents);
      } catch(jsonEx) {
        throw new Error(`Cannot read snapshot "${filename}" as JSON: ${jsonEx}`);
      }
    }

    return content;
  }

  return {};
}

function updateSnapshot(filename, snapshotTitle, subject, dataType = TYPE_JSON) {
  const store = readFile(filename);
  if (dataType === TYPE_JSON) {
    store[snapshotTitle] = JSON.parse(subject);
  } else {
    store[snapshotTitle] = subject;
  }


  // Reformat to `exports` format which is nicer for Git diffs
  const saveResult = Object.keys(store).reduce((result, key) => {
    let value = store[key];
    if (typeof value === 'string') {
      value = ` \`\n${value.trim().replace(/\\/g, '\\\\').replace(/`/g, '\\`')}\n\``;
    } else {
      value = `\n${formatJson(value)}`;
    }
    result += `exports[\`${key}\`] =${value}`;
    result += ';\n\n';

    return result;
  }, '');

  fs.writeFileSync(filename, `${saveResult.trim()}\n`);
}

module.exports = {
  createDiff,
  formatDiff,
  getSnapshot,
  subjectToSnapshot,
  updateSnapshot,
  getDiff
};
