/* eslint-disable */

function closeSnapshotModal() {
  Cypress.$('.snapshot-diff', top.document).remove();
};

(function () {
  function htmlEncode(subject) {
    return typeof subject === 'string' ?
        subject.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      : JSON.stringify(subject, undefined, 2);
  }

  // Bug: `cy.readFile` only works first time, as a fix I wrap it in a cached `Cypress.Promise`.
  // @TODO: file a bug report about this.
  function readFile(fullPath, encoding = 'base64', options = { log: false }) {
    if (!Cypress.__readFileCache__) Cypress.__readFileCache__ = {};
    if (!Cypress.__readFileCache__[encoding]) {
      Cypress.__readFileCache__[encoding] = {};
    }

    const cache = Cypress.__readFileCache__[encoding];
    if (!cache[fullPath]) {
      cache[fullPath] = new Cypress.Promise((resolve) => {
        cy.readFile(fullPath, encoding, options).then(resolve);
      });
    }

    return cache[fullPath];
  }

  function getImageDataUri(url) {
    return readFile(url, 'base64')
      .then((image) => {
        return `data:image/png;base64,${image}`;
      });
  }

  function formatPreview(title, content) {
    return `<div class="d2h-wrapper"><div id="d2h-891443" class="d2h-file-wrapper" data-lang=""><div class="d2h-file-header"><span class="d2h-file-name-wrapper"><span class="d2h-icon-wrapper"><svg aria-hidden="true" class="d2h-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z"></path>
</svg></span><span class="d2h-file-name">${title}</span></span></div>
        <pre style="margin: 1em; position: relative;">${content}</pre>
      </div></div>`
  }

  function wrapImageStyle(imageStyle, image = '') {
    if (imageStyle) {
      return `<div class="snapshot-image__wrapper" style="${imageStyle}">${image||''}</div>`;
    }
    return image;
  }

  function wrapImage(type, title, dataUri = '', imageStyle = '') {
    const imageTitle = type === 'actual' ? 'Actual result' : 'Expected result';
    const htmlTitle = `<h2 class="snapshot-image__title">${imageTitle}</h2>`;

    return `<div class="snapshot-image snapshot-image--${type}">${htmlTitle}` +
      wrapImageStyle(
        imageStyle,
        dataUri ? `<img src="${dataUri}" alt="${title}" class="snapshot-image__image">` : ''
      ) +
      '</div>';
  }

  function createImageDiff(title, expectedImage, diffImage, imageStyle) {
    // Overlay expected and diff image on top of each other
    const diffStyle = `${imageStyle} background: ` +
        `url(${expectedImage}) top left no-repeat, ` +
        `url(${diffImage}) top left no-repeat; ` +
        `background-size: 100% auto, 100% auto;`;

    return wrapImage('diff', title, '', diffStyle);
  }

  function formatImageResult(data) {
    const title = data.snapshotTitle;
    if (data.passed) {
      return getImageDataUri(data.expected.path)
        .then((dataUri) =>
          formatPreview(title, wrapImage('single', title, dataUri))
        );
    }

    const imageHeight = data.diff ? data.diff.height : Math.max(data.actual.height, data.expected.height);
    const imageWidth = data.diff ? data.diff.width : Math.max(data.actual.width, data.expected.width);
    const imageRatio = Math.round(imageHeight / imageWidth * 10000) / 100;
    const imageStyle = `padding-top: ${imageRatio}%;`;

    const promises = [
      getImageDataUri(data.expected.path),
      getImageDataUri(data.actual.path),
    ];
    if (data.diff) {
      promises.push(getImageDataUri(data.diff.path));
    }

    return Cypress.Promise.all(promises)
      .then(([expectedImage, actualImage, diffImage = '']) => {
        return formatPreview(title,
          wrapImage('expected', title, expectedImage, imageStyle) +
          wrapImage('actual', title, actualImage, imageStyle) +
          (diffImage ? createImageDiff(title, expectedImage, diffImage, imageStyle) : '')
        );
      });
  }

  function formatResult(data) {
    const title = data.snapshotTitle;
    if (data.isImage) {
      return formatImageResult(data);
    } else if (data.diff && !data.passed) {
      return Cypress.Promise.resolve(Diff2Html.getPrettyHtml(
        data.diff, {
          inputFormat: 'diff',
          outputFormat: 'side-by-side',
          synchronisedScroll: true
        }
      ));
    }

    return Cypress.Promise.resolve(formatPreview(title, htmlEncode(data.actual)));
  }

  Cypress.$(document.body).on('click', 'a[href^="#cypress-plugin-snapshot-"]', function (e) {
    e.preventDefault();

    const data = JSON.parse(Base64.decode(e.currentTarget.getAttribute('href').replace('#cypress-plugin-snapshot-', '')));
    if (data) {
      formatResult(data).then((diffHtml) => {
        const updateButton = window.saveSnapshot && !data.passed ?
          '<button class="snapshot-btn-approve"><i class="fa fa-check"></i> Update snapshot</button>' :
          '';

        Cypress.$(`<div class="snapshot-diff${data.isImage?' snapshot-diff--image':''}">` +
          '<header>' + updateButton +
          '<button class="snapshot-btn-close"><i class="fa fa-close"></i> Close</button>' +
          '</header>' +
          '<div class="snapshot-diff-content">' + diffHtml + '</div>' +
          '</div>').appendTo(top.document.body);

        Cypress.$('.snapshot-btn-close', top.document).on('click', closeSnapshotModal);

        Cypress.$('.snapshot-btn-approve', top.document).on('click', function() {
          window.saveSnapshot(data);
          closeSnapshotModal();
        });
      });
    }

    return false;
  });
})();
