const { getImageConfig, getScreenshotConfig } = require('../src/config');

describe('config', () => {
  it('getImageConfig', () => {
    const config = {
      imageConfig: {
        threshold: 0.5,
        bar: 'should be ignored',
      },
      foo: 'should be ignored',
    };

    expect(getImageConfig(config)).toEqual({
      createDiffImage: true,
      resizeDevicePixelRatio: true,
      threshold: 0.5,
      thresholdType: 'percent',
    });
  });

  it('getScreenshotConfig', () => {
    const config = {
      log: true,
      clip: {
        x: 0,
        y: 0,
        height: 100,
        width: 100,
      }
    };

    expect(getScreenshotConfig(config)).toEqual({
      blackout: ['.snapshot-diff'],
      capture: 'fullPage',
      clip: {
        x: 0,
        y: 0,
        height: 100,
        width: 100,
      },
      disableTimersAndAnimations: true,
      log: true,
      scale: false,
      timeout: 30000,
    });
  });
});
