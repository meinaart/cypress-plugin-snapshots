/* eslint-disable */
Cypress.$(document.body).on('click', 'a[href^="#cypress-plugin-snapshot-"]', function (e) {
  e.preventDefault();

  var data = JSON.parse(atob(e.currentTarget.getAttribute('href').replace('#cypress-plugin-snapshot-', '')));
  if (data && data.diff) {
    var diffHtml = Diff2Html.getPrettyHtml(
      data.diff, {
        inputFormat: 'diff',
        outputFormat: 'side-by-side',
        synchronisedScroll: true
      }
    );

    var updateButton = window.saveSnapshot ?
        '<button class="snapshot-btn-approve"><i class="fa fa-check"></i> Update snapshot</button>'
      : '';

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
