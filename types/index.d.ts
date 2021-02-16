    
// -- Example Usage: 
// -- cypress/tsconfig.json
// {
//   "compilerOptions": {
//      "types": ["cypress", "cypress-plugin-snapshots"]
//    }
// }

declare namespace Cypress {
  interface Chainable<Subject = any> {
    toMatchSnapshot(options?: Partial<{
      ignoreExtralFields: boolean,
      ignoreExtraArrayItems: boolean,
      normalizeJson: boolean,
      replace: any,
      name: string
    }>): Chainable<null>;

    toMatchImageSnapshot(options?: Partial<{
      imageConfig: Partial<{
        createDiffImage: boolean,
        threshold: number,
        thresholdType: "percent" | "pixels",
        resizeDevicePixelRatio: boolean
      }>,
      screenshotConfig: Partial<ScreenshotDefaultsOptions>,
      name: string,
      separator: string
    }>): Chainable<null>;
  }
}
