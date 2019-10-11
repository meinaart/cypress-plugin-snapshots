/* eslint-disable camelcase */
/* https://github.com/rtfpessoa/diff2html/tree/master/src/templates */

const fileTag = '<span class="d2h-tag"></span>';

const icon_file =
  `<svg aria-hidden="true" class="d2h-icon" height="16" viewBox="0 0 12 16" width="12">
		<path d="M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z">
		</path>
	</svg>`;

function diff2HtmlTemplate(data, diffs) {

  const generic_file_path =
    `<span class="d2h-file-name-wrapper">
			${icon_file}
			<span class="d2h-file-name">${data.snapshotTitle}</span>
			${fileTag}
		</span>`;

  const line_by_line_file_diff =
    `<div class="d2h-file-wrapper">
			<div class="d2h-file-header">${generic_file_path}</div>
			<div class="d2h-file-diff">
				<div class="d2h-code-wrapper">
					${diffs}
				</div>
			</div>
		</div>`;

  return `<div class="d2h-wrapper">${line_by_line_file_diff}</div>`;
}

module.exports = diff2HtmlTemplate;
