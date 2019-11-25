global.before = jest.fn();
global.after = jest.fn();

global.Cypress = {
  $: () => ({}),
  browser: {
    isHeadless: true
  },
  env: jest.fn().mockReturnValue({}),
  on: () => ({}),
  config: () => { },
  Commands: {
    add: jest.fn()
  }
};

global.cy = {};
