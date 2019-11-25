const rewire = require('rewire');
const { cloneDeep } = require('lodash');
const { initCommands } = require('../commands');
const { getConfig, mergeConfig } = require('../src/config');
const { COMMAND_MATCH_SNAPSHOT, COMMAND_MATCH_IMAGE_SNAPSHOT } = require('../src/commands/commandNames');

const DEFAULT_CONFIG = cloneDeep(rewire('../src/config').__get__('DEFAULT_CONFIG')); /* eslint-disable-line */

describe('config', () => {
  it('verify default config', () => {
    initCommands({}); // set config to default config
    expect(getConfig()).toEqual(DEFAULT_CONFIG);
  });

  describe('toMatchSnapshot', () => {
    it('mergeConfig', () => {
      const config = mergeConfig(COMMAND_MATCH_SNAPSHOT, {
        ignoreExtraFields: true,
        ignoreExtraArrayItems: true,
        normalizeJson: false,
        foo: 'should be ignored'
      });

      expect(config).toMatchSnapshot();
    });

    it('config should not have changed', () => {
      expect(getConfig()).toEqual(DEFAULT_CONFIG);
    });
  });

  describe('toMatchImageSnapshot w/ custom name', () => {
    it('mergeConfig', () => {
      const config = mergeConfig(COMMAND_MATCH_IMAGE_SNAPSHOT, {
        createDiffImage: false,
        threshold: 0.5,
        name: 'custom image name',
        thresholdType: 'pixels',
        resizeDevicePixelRatio: false,
        blackout: ['.blackout'],
        log: true,
        clip: {
          x: 0,
          y: 0,
          height: 100,
          width: 100
        },
        foo: 'should be ignored'
      });

      expect(config).toMatchSnapshot();
    });

    it('config should not have changed', () => {
      expect(getConfig()).toEqual(DEFAULT_CONFIG);
    });
  });

  describe('toMatchImageSnapshot w/o custom name', () => {
    it('mergeConfig', () => {
      const config = mergeConfig(COMMAND_MATCH_IMAGE_SNAPSHOT, {
        createDiffImage: false,
        threshold: 0.5,
        thresholdType: 'pixels',
        resizeDevicePixelRatio: false,
        blackout: ['.blackout'],
        log: true,
        clip: {
          x: 0,
          y: 0,
          height: 100,
          width: 100
        },
        foo: 'should be ignored'
      });

      expect(config).toMatchSnapshot();
    });

    it('config should not have changed', () => {
      expect(getConfig()).toEqual(DEFAULT_CONFIG);
    });
  });
});
