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

```json
"env": {
  "cypress-plugin-snapshot": {
    "autopassNewSnapshots": true, /* when true not existing snapshots are automatically saved & passed */
    "diffLines": 3, /* how many lines to include in the diff screenshot */
    "normalizeJson": true, /* Do you want sort keys in JSON */
    "serverEnabled": true, /* Do you want to enable the save server? */
    "serverHost": "localhost", /* Under which host should the save server run? */
    "serverPort": 2121, /* Under which port should the save server run? */
    "updateSnapshots": false /* Automatically save changed snapshots, can be handy if you want to update a bunch of snapshots */
  }
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.

## License
This plugin is released under the MIT license.