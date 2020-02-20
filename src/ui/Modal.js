const { Diff2Html } = require('diff2html');
const { Base64 } = require('js-base64');
const diff2HtmlTemplate = require('./diff2html-templates');
const { URL_PREFIX } = require('../constants');
const { UPDATE_SNAPSHOT } = require('../tasks/taskNames');
const { CONFIG_KEY } = require('../config');

const { $ } = Cypress;
const diffFormat = Cypress.env(CONFIG_KEY.diffFormat) || 'side-by-side';

function Modal(data, win, target) {
  this.max = false;
  this.win = win;

  const that = this;
  let diffHtml;

  if (data.isImage) {
    formatImageResult(data).then(function (diff) {
      diffHtml = diff2HtmlTemplate(data, diff);
      that.show(data, diffHtml, target);
    });
  } else {
    diffHtml = Diff2Html.getPrettyHtml(data.diff, {
      inputFormat: 'diff',
      outputFormat: data.passed || data.updated ? 'line-by-line' : diffFormat,
      synchronisedScroll: true
    });
    this.show(data, diffHtml, target);
  }
}

Modal.prototype.show = function (data, diffHtml, target) {
  const {
    commandName,
    updated,
    passed,
    isImage,
    state
  } = data;

  // Modal
  const modal = $(diffHtml)
    .addClass(`${commandName} state-${state}`)
    .appendTo(this.win);

  // Header
  const header = modal.find('.d2h-file-name-wrapper');
  header.find('.d2h-tag').text('').removeClass('d2h-changed-tag');

  const buttonsRight = $('<div class="btn-group-right" style="margin-left:auto;"></div>').appendTo(header);

  // Background blend mode
  if (isImage && !passed && !updated) {
    $('<select><option>difference</option><option>screen</option><option>overlay</option></select>')
      .change(function () {
        modal.find('.snapshot-image--diff div')
          .css('background-blend-mode', $(this).val());
      })
      .val(Cypress.env(CONFIG_KEY).backgroundBlend).prop('selected', true)
      .appendTo(buttonsRight);
  }

  // Update snapshot button
  if (!passed && !updated) {
    $('<button class="snapshot-btn-approve"><i class="fa fa-check"></i> Update snapshot</button>')
      .on('click', function () {
        Cypress.backend('task', {
          task: UPDATE_SNAPSHOT,
          arg: data,
          timeout: 5000
        }).then(function (updatedData) {
          $(target).addClass('updated')
            .attr('href', `${URL_PREFIX}${Base64.encode(JSON.stringify(updatedData))}`);

          closeSnapshotModal();
        });
      })
      .appendTo(buttonsRight);
  }

  const btnGroup1 = $('<div class="btn-group"/>').appendTo(buttonsRight);

  // Maximize button
  const that = this;
  $('<button class="snapshot-btn-max"><i class="fa fa-expand"></i></button>')
    .on('click', function () {
      if (that.max) {
        modal.css({ 'height': 'unset', 'width': 'unset' });
      } else {
        modal.css({ 'height': '100vh', 'width': '100vw' });
      }
      that.max = !that.max;
    }).appendTo(btnGroup1);

  // Close button
  $('<button class="snapshot-btn-close"><i class="fa fa-close"></i></button>')
    .on('click', closeSnapshotModal).appendTo(btnGroup1);
};

function closeSnapshotModal() {
  $(window.parent.window.document).find('.d2h-wrapper').remove();
};


function getImageDataUri(filePath) {
  return Cypress.backend('read:file', filePath, { encoding: 'base64' })
    .then(function (result) {
      return `data:image/png;base64,${result.contents}`;
    }).catch(function (err) {
      console.log(err);
      return false;
    });
}

function formatImageResult(data) {
  const {
    passed,
    updated,
    expected,
    actual,
    diff
  } = data;

  if (passed || updated) {
    return getImageDataUri((expected || actual).path)
      .then((dataUri) => wrapImage('single', dataUri));
  }

  const promises = [
    getImageDataUri(expected.path),
    getImageDataUri(actual.path)
  ];

  if (diff) {
    promises.push(getImageDataUri(diff.path));
  }

  return Cypress.Promise.all(promises)
    .then(([ expectedImage, actualImage, diffImage ]) => {
      return (
        wrapImage('expected', expectedImage) +
        wrapImage('actual', actualImage) +
        createImageDiff(expectedImage, diffImage)
      );
    });
}

function createImageContainer(imageTitle, content) {
  return `<div class="snapshot-image snapshot-image--${imageTitle}">
      <h2 class="snapshot-image__title">${imageTitle}</h2>
      ${content}
    </div>`;
}

function wrapImage(imageTitle, dataUri = '') {
  return createImageContainer(imageTitle, `<img src="${dataUri}" alt="${imageTitle}">`);
}

function createImageDiff(expectedImage, diffImage) {
  // Overlay expected and diff image on top of each other
  if (diffImage) {
    const style = `background: url(${expectedImage}) top left no-repeat, url(${diffImage}) top left no-repeat;
			background-size: 100% auto, 100% auto;height:100%;`;

    return createImageContainer('diff', `<div style="${style}"></div>`);
  }
  return '';
}

module.exports = Modal;
