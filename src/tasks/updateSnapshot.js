const textSnapshots = require('../utils/tasks/textSnapshots');
const { saveImageSnapshot } = require('../utils/tasks/imageSnapshots');

function updateSnapshot(data) {
	if(data.isImage) {
		saveImageSnapshot(data);
	} else {
		const {
			snapshotFile,
			snapshotTitle,
			actual,
			dataType
		} = data;

		textSnapshots.updateSnapshot(snapshotFile, snapshotTitle, actual, dataType);			
		data.diff = textSnapshots.getDiff('', actual, snapshotTitle);
	}

	data.updated = true;
	return data;
}

module.exports = updateSnapshot;