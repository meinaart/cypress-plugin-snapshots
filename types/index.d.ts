/// <reference types="Cypress" />
/// <reference types="pixelmatch" />

// -- Example Usage:
// -- cypress/tsconfig.json
// {
//   "compilerOptions": {
//      "types": ["cypress", "cypress-plugin-snapshots"]
//    }
// }

declare namespace Cypress {
  type PixelmatchOptions = import('pixelmatch').PixelmatchOptions;
  interface Chainable<Subject = any> {
    toMatchSnapshot(options?: Partial<{
      ignoreExtralFields: boolean,
      ignoreExtraArrayItems: boolean,
      normalizeJson: boolean,
      replace: any,
      name: string
    }>): Chainable<null>;

    toMatchImageSnapshot(options?: Partial<{
      createDiffImage: boolean,
      threshold: number,
      thresholdType: "percent" | "pixels",
      name: string,
      pixelMatch: PixelmatchOptions;
    }> & Partial<ScreenshotDefaultsOptions>): Chainable<null>;
  }
}
