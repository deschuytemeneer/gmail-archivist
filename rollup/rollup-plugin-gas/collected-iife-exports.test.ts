import { loadFixture } from './test-utils';
import collectExports from './collect-iife-exports';
import { isIIFE } from './typechecks';

describe('collectIIFEExports', () => {
  it('finds all exports in a single iife', async () => {
    const ast = await loadFixture('given-single-iife.js', true);

    let globalExports: string[] = [];
    for (const globalStatement of ast.program.body) {
      if (isIIFE(globalStatement)) {
        globalExports = [...globalExports, ...collectExports(globalStatement).keys()];
      }
    }

    expect(globalExports).toEqual(['test']);
  });

  it('finds all exports in multiple iifes', async () => {
    const ast = await loadFixture('given-multiple-iife.js', true);

    let globalExports: string[] = [];
    for (const globalStatement of ast.program.body) {
      if (isIIFE(globalStatement)) {
        globalExports = [...globalExports, ...collectExports(globalStatement).keys()];
      }
    }

    expect(globalExports).toEqual(['computedName', 'test']);
  });
});
