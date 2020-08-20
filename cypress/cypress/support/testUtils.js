const { _ } = Cypress;

export const getSnapshotName = () => {
  const specPath = Cypress.spec.relative;
  const lastIndex = specPath.lastIndexOf('/');
  const specDir = specPath.slice(0, lastIndex);
  const specBasename = specPath.slice(lastIndex + 1);
  return `${specDir}/__snapshots__/${specBasename}.snap`;
};

export const getTitlePath = () =>
  cy
    .state('test')
    .titlePath()
    .join(' > ');

export const failBeforeRetry = n =>
  cy.then(() => expect(cy.state('test').currentRetry(), 'currentRetry').eq(n));

export function verifySnapshots(arr, include) {
  include = include != null ? include : true;
  const titlePath = getTitlePath();
  cy.readFile(getSnapshotName()).then(snapshotContents => {
    arr.forEach(item => {
      const match = item.startsWith('#') ? `${titlePath} ${item}` : item;
      if (include) {
        expect(snapshotContents).includes(match);
        return;
      }
      expect(snapshotContents).not.includes(match);
    });
  });
}

export const verifySnapshotsExclude = _.curryRight(verifySnapshots)(false);
