# Changelog
All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### Releases
## [1.1.3] - 2018-11-17
- Fixing the ["Unicode Problem"](https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem) present in `atob`/`btoa` by switching to [js-base64](https://www.npmjs.com/package/js-base64) for base64 encoding/decoding. Thanks to [ddfx](https://github.com/ddffx) for fixing this.
- Reformatted the Changelog.

## [1.1.2] - 2018-11-11
- Fixed included `files` property in `package.json`

## [1.1.1] - 2018-11-11
- Added a file cache for loading the CSS & Javascript #performance
- Removed unneeded log in the command log
- Fixed date of release of 1.1.0 below

## [1.1.0] / 2018-11-11
- **IMPORTANT:** Changed format of `.snap` files to have a nicer format for diffing HTML in `git`
- Made sure config is always available (fixes #2)
- Resolve dependency paths relative to plugin location (fixes #3)
- Moved CSS to `assets/styles.css`
- Moved javascript to `assets/script.js`
- Clicking on passed snapshot now shows snapshot
- Added support for DOM elements
- Added [prettier](https://prettier.io/) for formatting HTML before comparing

## [1.0.6] - 2018-11-07
- Add example Cypress tests
- Publish to `npm` via [Travis](https://travis-ci.org/)
- Updated vulnerable dependencies
- Added diff to log output
- Run Cypress on [Travis](https://travis-ci.org/)
- Upgraded Cypress peer dependency to 3.1.1

## [1.0.5] - 2018-10-17
- Fix bug with `null` values

## [1.0.4] - 2018-10-16
- Fix bug in `replace` functionality

## [1.0.3] - 2018-10-16
- Add more documentation on `options` for `toMatchSnapshot`
- Add `replace` functionality

## [1.0.2] - 2018-10-16
- Add `ignoreExtraArrayItems` property to configuration
- Add [Travis](https://travis-ci.org/) integration
- Add linter config
- Add Jest unit tests

## [1.0.1] - 2018-10-15
- Make `ignoreExtraFields` also work for (nested) arrays

## [1.0.0] / 2018-10-15
- Rename `minimalMatch` to `ignoreExtraFields`

## [0.1.5] / 2018-10-15
- Add `minimalMatch` to global configuration

## [0.1.4] / 2018-10-15
- Fix bug with JSON normalization

## [0.1.3] / 2018-10-15
- Add `autoCleanUp` to configuration
- Add `excludeFields` to configuration
- Add `minimalMatch` as option for `toMatchSnapshot`
- Replace `json-normalize` dependency with own implementation

## [0.1.2] / 2018-10-15
- Fix config key

## [0.1.1] / 2018-10-13
- Fix path to resources in external modules

## [0.1.0] / 2018-10-13
- released version 0.1.0
