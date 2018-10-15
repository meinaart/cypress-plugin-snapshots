# cypress-plugin-snapshots
Plugin for snapshot tests in [Cypress.io](https://www.cypress.io/).

## Installation
`npm i cypress-plugin-snapshots -S`

## Usage
```javascript
describe('data test', () => {
  it('test data', () => {
    return cy.request('data.json')
      .its('body')
      .toMatchSnapshot();
  });
});
```

## Config Cypress.io
Add this to your `cypress.json` configuration file:
```json
"ignoreTestFiles": [
  "**/*.snap",
  "**/__snapshot__/*"
]
```
### Plugin
Find your `cypress/plugins/index.js` file and change it to look like this:

```javascript
const { initPlugin } = require('cypress-plugin-snapshots/plugin');

module.exports = (on, config) => {
  initPlugin(on, config);
  return config;
};
```

### Command
Find your `cypress/support/index.js` file and add the following line:

```javascript
import 'cypress-plugin-snapshots/commands';
```


### Make changes to default configuration
You can customize the configuration in the `cypress.json` file in the root of your Cypress project.

Add the configuration below to your `cypress.json` file to make changes to the default values.

```javascript
"env": {
  "cypress-plugin-snapshots": {
    "autopassNewSnapshots": true,  // Automatically save & pass new/non-existing snapshots
    "diffLines": 3,                // How many lines to include in the diff modal
    "normalizeJson": true,         // Alphabetically sort keys in JSON?
    "serverEnabled": true,         // Enable "update snapshot" server and button in diff modal
    "serverHost": "localhost",     // Hostname for "update snapshot server"
    "serverPort": 2121,            // Port number for  "update snapshot server"
    "updateSnapshots": false       // Automatically update snapshots, useful if you have lots of changes
  }
}
```

## Roadmap
Below is a list of functionality that is under consideration for implementing in a next version.

- Add basic Cypress test for demonstration
- Add screenshots/screen recording to README
- Optionally exclude fields from snapshot compare, both per test and globally
- Make `toMatchSnapshot` work for DOM elements
- Optionally ignore extra fields in expected object. Basically only match what's defined in the snapshot.
- Disable "update snapshots" server in headless mode
- Contact Cypress team to be included in [official plugin list on Cypress.io](https://docs.cypress.io/plugins/index.html)
- Add unit tests
- Consider moving configuration to `initPlugin`.
- Extract CSS and javascript to separate files
- Add [JSDoc](http://usejsdoc.org/) documentation
- Add [Travis](https://travis-ci.org/) integration based on [Cypress Travis example](https://github.com/cypress-io/cypress-example-kitchensink/blob/master/.travis.yml)
- Investigate code coverage tests with [Coveralls](https://coveralls.io/) and [Istanbul](http://gotwarlost.github.io/istanbul/)
- Consider implementing visual snapshots with [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.

## License
This plugin is released under the MIT license.