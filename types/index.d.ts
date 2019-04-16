    
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
      replace: any
    }>): Chainable<null>;

    toMatchImageSnapshot(options?: Partial<{
      createDiffImage: boolean,
      threshold: number,
      thresholdType: "percent" | "pixels",
    }> & Partial<ScreenshotDefaultsOptions>): Chainable<null>;
  }
}