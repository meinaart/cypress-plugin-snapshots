/* eslint-env browser */
const { SAVE, URL_PREFIX } = require('./constants');
const { getServerUrl, CONFIG_KEY } = require('./config');

const NO_LOG = { log: false };

function initUi() {
  const $head = Cypress.$(window.parent.window.document.head);
  const config = Cypress.env(CONFIG_KEY);

  if ($head.find('#cypress-plugin-snapshot').length > 0) {
    return;
  }

  cy.readFile(config.DIFF_CSS_PATH, NO_LOG).then((content) => {
    $head.append(`<style>${content}</style>`);
  });

  cy.readFile(config.DIFF_JS_PATH, NO_LOG).then((content) => {
    $head.append(`<script>${content}</script>`);
  });

  if (config.serverEnabled) {
    cy.readFile(config.SOCKET_JS_PATH, NO_LOG).then((content) => {
      $head.append(`<script>
      ${content}

      var saveSnapshot = ((data) => {
        var socket = io('${getServerUrl(config)}');

        return (data) => {
          socket.emit('${SAVE}', data);
        };
      })();
      </script>`);
    });
  }

  $head.append(`<style id="cypress-plugin-snapshot">
  .command-name-toMatchSnapshot .command-method span {
    border-radius: 2px;
    padding: 0 3px;
    font-size: 11px;
    display: inline-block;
    height: 14px;
    line-height: 16px;
  }

  .command-name-toMatchSnapshot.command-state-passed .command-method span {
    background-color: #08c18d;
    color: white;
  }

  .command-name-toMatchSnapshot.command-state-failed .command-method span {
    background-color: #e94f5f;
    color: white;
  }

  .command-name-toMatchSnapshot.command-state-pending .command-method span {
    background-color: #428BCA;
    color: white;
  }

  .command-name-toMatchSnapshot.command-state-failed + .command-name-then.command-state-failed {
    display: none;
  }

  a[href^="${URL_PREFIX}"] {
    background: #fad7db;
    color: #e94f5f;
    border: 1px solid currentColor;
    border-radius: 2px;
    display: inline-block;
    font-size: 11px;
    height: 14px;
    line-height: 16px;
    padding: 0 3px;
    text-transform: uppercase;
  }

  .command-state-failed a[href^="${URL_PREFIX}"],
  a[href^="${URL_PREFIX}"]:active,
  a[href^="${URL_PREFIX}"]:hover,
  a[href^="${URL_PREFIX}"]:focus {
    color: white;
    text-decoration: none;
    background-color: #e94f5f;
    border-color: #e94f5f;
  }
  .command-state-failed a[href^="${URL_PREFIX}"]:hover {
    color: #fad7db;
  }

  a[href^="${URL_PREFIX}"]:before {
    content: "<> ";
    font-weight: bold;
  }
  .snapshot-diff {
    background: white;
    width: 75vw;
    height: 50vh;
    overflow-y: scroll;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 1px 3px #ccc;
  }
  .snapshot-diff .d2h-wrapper {
    margin: 1em;
  }

  .snapshot-diff header {
    position: fixed;
    left: 0;
    right: 0;
    height: 3em;
    box-sizing: border-box;
    background: #f8f8f8;
    display: block;
    padding: .75em 1em;
    border-bottom: 1px solid #ccc;
  }

  .snapshot-diff-content {
    overflow-y: scroll;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin-top: 3em;
  }

  .snapshot-diff header button {
    border: 0;
    background: transparent;
    font-size: .75em;
    padding: 6px;
    border-radius: 2px;
    cursor: pointer;
  }

  .snapshot-diff header button.snapshot-btn-approve {
    background: #08c18d;
    color: white;
    font-weight: bold;
  }

  .snapshot-diff header button.snapshot-btn-close {
    float: right;
  }
  </style>`);

  $head.append(`<script>
  Cypress.$(document.body).on('click', 'a[href^="${URL_PREFIX}"]', function(e) {
    e.preventDefault();

    var data = JSON.parse(atob(e.currentTarget.getAttribute('href').replace('${URL_PREFIX}', '')));
    if (data && data.diff) {
      var diffHtml = Diff2Html.getPrettyHtml(
        data.diff,
        {inputFormat: 'diff', outputFormat: 'side-by-side', synchronisedScroll: true}
      );

      var $element = Cypress.$('<div class="snapshot-diff">' +
        '<header>' +
            '${config.serverEnabled ? '<button class="snapshot-btn-approve"><i class="fa fa-check"></i> Update snapshot</button>' : ''}' +
            '<button class="snapshot-btn-close"><i class="fa fa-close"></i> Close</button>'+
          '</header>' +
        '<div class="snapshot-diff-content">' + diffHtml+ '</div>' +
        '</div>').appendTo(document.body);

      Cypress.$('.snapshot-btn-close', parent.window.document).on('click', function() {
        Cypress.$('.snapshot-diff', parent.window.document).remove();
      });

      Cypress.$('.snapshot-btn-approve', parent.window.document).on('click', function() {
        saveSnapshot(data);
        Cypress.$('.snapshot-diff', parent.window.document).remove();
      });
    }

    return false;
  });
  </script>`);
}

module.exports = {
  initUi,
};
