/* eslint-env browser */
const { Base64 } = require('js-base64');
const { CONFIG_KEY } = require('../config');
const { GET_FILE } = require('../tasks/taskNames');
const { PATH_CSS, PATH_DIFF_CSS } = require('../paths');
const { NO_LOG, URL_PREFIX } = require('../constants');

const FILE_CACHE = {};

function readFile(fileType) {
  if (!FILE_CACHE[fileType]) {
    FILE_CACHE[fileType] = cy.task(GET_FILE, fileType, NO_LOG);
  }
  return FILE_CACHE[fileType];
}

function initUi() {
  const Modal = require('./Modal'); // placed inside function for Jest testing

  const $head = Cypress.$(window.parent.window.document.head);
  const config = Cypress.env(CONFIG_KEY);

  Cypress.$(window.parent.window.document).on('click', `a[href^="${URL_PREFIX}"]`, function (e) {
    e.preventDefault();

    const data = JSON.parse(Base64.decode(e.currentTarget.getAttribute('href').replace(URL_PREFIX, '')));
    new Modal(data, e.delegateTarget.body, this); /* eslint-disable-line no-new */
  });

  if ($head.find('#cypress-plugin-snapshot').length > 0) {
    return;
  }

  readFile(PATH_DIFF_CSS).then((content) => {
    $head.append(`<style>${content}</style>`);
  });

  $head.append(`<style>
  .snapshot-image--diff div {
    background-blend-mode: ${config.backgroundBlend ? config.backgroundBlend : 'screen, difference'}
  }
  </style>`);

  readFile(PATH_CSS).then((content) => {
    $head.append(`<style id="cypress-plugin-snapshot">${content}</style>`);
  });
}

function closeSnapshotModals() {
  try {
    Cypress.$(window.parent.window.document).find('.d2h-wrapper').remove();
  } catch (ex) {
    console.log(ex);
  }
}

module.exports = {
  initUi,
  closeSnapshotModals
};
