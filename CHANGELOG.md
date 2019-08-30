# Changelog
All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## Releases
### [1.2.9](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.2.8...v1.2.9) - 2019-08-30
- Upgraded Cypress to 3.4.1 & other dependencies to newer versions
- Publish the `types` folder (#57) (thanks @allout58)
- Bump eslint-utils from 1.3.1 to 1.4.2 (#56)  …
- feat: Adds ability to change background-blend-mode (#53) (thanks @johnmcclumpha)

### [1.2.8](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.2.7...v1.2.8) - 2019-08-13
- Fix `clip` argument for `toMatchImageSnapshot` (was broken in 1.2.7)


### [1.2.7](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.2.6...v1.2.7) - 2019-08-13
- Update dependencies with security vulnerabilities
- Fix imageConfig loading from cypress.json (#40) (thanks @rndmerle)
- Update readme to reflect proper thresholdTypes (#44) (thanks @bautistaaa)
- Added typescript definitions (thanks @basarat)
- Adds caveat section; mentions issue #10 (thanks @sgnl)
- Properly handle undefined path (thanks @renelux)

### [1.2.6](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.2.6...v1.2.6) - 2019-02-25
- fixed a bug that null values cause keepKeysFromExpected to fail (fixes #26)
- Fix escaping of slashes (fixes #28)
- Fixing caching of snapshot files (fixes #13)

### [1.2.5](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.2.4...v1.2.5) - 2019-01-11
- Breaking snapshot functionality when running all tests, previous fix breaks other functionality (Reopens #10) (Fixes #14)

### [1.2.4](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.2.3...v1.2.4) - 2019-01-04
- Fix broken `excludedFields` functionality

### [1.2.3](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.2.2...v1.2.3) - 2018-12-30
- Fixing snapshot filenames when running all tests (Fixes #10) (added my own `Cypress.spec` implementation)
- Renamed "save server" to "server"
- Moved code around a bit (refactoring, cleaner separation between text and image methods)
- Upgraded Cypress to 3.1.4

### [1.2.2](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.2.1...v1.2.2) - 2018-12-28
- Improve jQuery detection for `toMatchSnapshot`

### [1.2.1](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.2.0...v1.2.1) - 2018-12-11
- Expose screenshot settings to `toMatchImageSnapshot`
- Upgraded Cypress to 3.1.3
- Upgraded dependencies: `eslint`, `eslint-config-prettier`, `eslint-plugin-jest`, `prettier`, `socket.io` and `diff2html` to latest version

### [1.2.0](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.1.6...v1.2.0) - 2018-12-01
- Add `toMatchImageSnapshot` functionality

### [1.1.6](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.1.5...v1.1.6) - 2018-11-21
- Fix serious bug in parsing old JSON format `.js.snap` files, was completely broken.

### [1.1.5](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.1.4...v1.1.5) - 2018-11-20
- Add better error logging when snapshot file contains an error
- Run Travis tests against LTS version of node and latest version

### [1.1.4](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.1.3...v1.1.4) - 2018-11-19
- Read snapshot file as JSON when `require` throws an error (fixes handling of existing `.js.snap` files)

### [1.1.3](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.1.2...v1.1.3) - 2018-11-17
- Fixing the ["Unicode Problem"](https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem) present in `atob`/`btoa` by switching to [js-base64](https://www.npmjs.com/package/js-base64) for base64 encoding/decoding. Thanks to [ddfx](https://github.com/ddffx) for fixing this.
- Reformatted the changelog

### [1.1.2](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.1.1...v1.1.2) - 2018-11-11
- Fixed included `files` property in `package.json`

### [1.1.1](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.1.0...v1.1.1) - 2018-11-11
- Added a file cache for loading the CSS & Javascript #performance
- Removed unneeded log in the command log
- Fixed date of release of 1.1.0 below

### [1.1.0](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.0.6...v1.1.0) / 2018-11-11
- **IMPORTANT:** Changed format of `.snap` files to have a nicer format for diffing HTML in `git`
- Made sure config is always available (fixes #2)
- Resolve dependency paths relative to plugin location (fixes #3)
- Moved CSS to `assets/styles.css`
- Moved javascript to `assets/script.js`
- Clicking on passed snapshot now shows snapshot
- Added support for DOM elements
- Added [prettier](https://prettier.io/) for formatting HTML before comparing

### [1.0.6](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.0.5...v1.0.6) - 2018-11-07
- Add example Cypress tests
- Publish to `npm` via [Travis](https://travis-ci.org/)
- Updated vulnerable dependencies
- Added diff to log output
- Run Cypress on [Travis](https://travis-ci.org/)
- Upgraded Cypress peer dependency to 3.1.1

### [1.0.5](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.0.4...v1.0.5) - 2018-10-17
- Fix bug with `null` values

### [1.0.4](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.0.3...v1.0.4) - 2018-10-16
- Fix bug in `replace` functionality

### [1.0.3](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.0.2...v1.0.3) - 2018-10-16
- Add more documentation on `options` for `toMatchSnapshot`
- Add `replace` functionality

### [1.0.2](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.0.1...v1.0.2) - 2018-10-16
- Add `ignoreExtraArrayItems` property to configuration
- Add [Travis](https://travis-ci.org/) integration
- Add linter config
- Add Jest unit tests

### [1.0.1](https://github.com/meinaart/cypress-plugin-snapshots/compare/v1.0.0...v1.0.1) - 2018-10-15
- Make `ignoreExtraFields` also work for (nested) arrays

### [1.0.0](https://github.com/meinaart/cypress-plugin-snapshots/compare/v0.1.5...v1.0.0) / 2018-10-15
- Rename `minimalMatch` to `ignoreExtraFields`

### [0.1.5](https://github.com/meinaart/cypress-plugin-snapshots/compare/v0.1.4...v0.1.5) / 2018-10-15
- Add `minimalMatch` to global configuration

### [0.1.4](https://github.com/meinaart/cypress-plugin-snapshots/compare/v0.1.3...v0.1.4) / 2018-10-15
- Fix bug with JSON normalization

### [0.1.3](https://github.com/meinaart/cypress-plugin-snapshots/compare/v0.1.2...v0.1.3) / 2018-10-15
- Add `autoCleanUp` to configuration
- Add `excludeFields` to configuration
- Add `minimalMatch` as option for `toMatchSnapshot`
- Replace `json-normalize` dependency with own implementation

### [0.1.2](https://github.com/meinaart/cypress-plugin-snapshots/compare/v0.1.1...v0.1.2) / 2018-10-15
- Fix config key

### [0.1.1](https://github.com/meinaart/cypress-plugin-snapshots/compare/v0.1.0...v0.1.1) / 2018-10-13
- Fix path to resources in external modules

### 0.1.0 / 2018-10-13
- released version 0.1.0
