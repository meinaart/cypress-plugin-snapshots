/* eslint-disable */

(function () {
  function htmlEncode(subject) {
    return typeof subject === 'string' ?
        subject.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      : JSON.stringify(subject, undefined, 2);
  }

  function formatResult(data) {
    if (data.passed) {
      // @TODO: make this nicer
      return `<div class="d2h-wrapper"><div id="d2h-891443" class="d2h-file-wrapper" data-lang=""><div class="d2h-file-header"><span class="d2h-file-name-wrapper"><span class="d2h-icon-wrapper"><svg aria-hidden="true" class="d2h-icon" height="16" version="1.1" viewBox="0 0 12 16" width="12"><path d="M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z"></path>
</svg></span><span class="d2h-file-name">${data.snapshotTitle}</span></span></div>
        <pre style="margin: 1em;">${htmlEncode(data.expected)}</pre>
      </div></div>`;
    } else if (data.diff) {
      return Diff2Html.getPrettyHtml(
        data.diff, {
          inputFormat: 'diff',
          outputFormat: 'side-by-side',
          synchronisedScroll: true
        }
      );
    }
  }

  Cypress.$(document.body).on('click', 'a[href^="#cypress-plugin-snapshot-"]', function (e) {
    e.preventDefault();

    var data = JSON.parse(Base64.decode(e.currentTarget.getAttribute('href').replace('#cypress-plugin-snapshot-', '')));
    if (data) {
      var diffHtml = formatResult(data);

      var updateButton = window.saveSnapshot && !data.passed ?
        '<button class="snapshot-btn-approve"><i class="fa fa-check"></i> Update snapshot</button>' :
        '';

      Cypress.$('<div class="snapshot-diff">' +
        '<header>' + updateButton +
        '<button class="snapshot-btn-close"><i class="fa fa-close"></i> Close</button>' +
        '</header>' +
        '<div class="snapshot-diff-content">' + diffHtml + '</div>' +
        '</div>').appendTo(document.body);

      Cypress.$('.snapshot-btn-close', parent.window.document).on('click', function () {
        Cypress.$('.snapshot-diff', parent.window.document).remove();
      });

      Cypress.$('.snapshot-btn-approve', parent.window.document).on('click', function () {
        window.saveSnapshot(data);
        Cypress.$('.snapshot-diff', parent.window.document).remove();
      });
    }

    return false;
  });
})();
