const { removeEmptyFoldersRecursively } = require('../utils/File');

// Removes empty folders created by snapshots
function cleanup(folderPath) {
	return removeEmptyFoldersRecursively(folderPath);
}

module.exports = cleanup;
