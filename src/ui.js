/* eslint-env browser */
const { getServerUrl, CONFIG_KEY } = require('./config');

const {
  GET_FILE,
} = require('./tasks/taskNames');
const {
  SAVE_TEXT,
  SAVE_IMAGE,
} = require('./server/actions');
const {
  PATH_CSS,
  PATH_DIFF_CSS,
  PATH_DIFF_JS,
  PATH_JS,
  PATH_SOCKET_JS,
  PATH_BASE64_JS,
} = require('./paths');
const { NO_LOG } = require('./constants');

const FILE_CACHE = {};

function readFile(fileType) {
  if (!FILE_CACHE[fileType]) {
    FILE_CACHE[fileType] = cy.task(GET_FILE, fileType, NO_LOG);
  }
  return FILE_CACHE[fileType];
}

function initUi() {
  const $head = Cypress.$(window.parent.window.document.head);
  const config = Cypress.env(CONFIG_KEY);

  if ($head.find('#cypress-plugin-snapshot').length > 0) {
    return;
  }

  readFile(PATH_DIFF_CSS).then((content) => {
    $head.append(`<style>${content}</style>`);
  });

  $head.append(`<style>
  .snapshot-image--diff .snapshot-image__wrapper {
    background-blend-mode: ${config.backgroundBlend ? config.backgroundBlend : 'difference'}
  }
  </style>`);

  readFile(PATH_BASE64_JS).then((content) => {
    $head.append(`<script>${content}</script>`);
  });

  readFile(PATH_DIFF_JS).then((content) => {
    $head.append(`<script>${content}</script>`);
  });

  if (config.serverEnabled) {
    readFile(PATH_SOCKET_JS).then((content) => {
      $head.append(`<script>
      ${content}

      var saveSnapshot = ((data) => {
        var socket = io('${getServerUrl(config)}');

        return (data) => {
          const action = data.isImage ? '${SAVE_IMAGE}' : '${SAVE_TEXT}';
          socket.emit(action, data);
        };
      })();
      </script>`);
    });
  }

  readFile(PATH_CSS).then((content) => {
    $head.append(`<style id="cypress-plugin-snapshot">${content}</style>`);
  });

  readFile(PATH_JS).then((content) => {
    $head.append(`<script>${content}</script>`);
  });
}

module.exports = {
  initUi,
};
