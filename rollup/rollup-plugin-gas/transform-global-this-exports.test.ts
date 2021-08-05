import { loadFixture, normalize } from './test-utils';
import transformGlobalThisExports from './transform-global-this-exports';

describe('transformGlobalThisExports', () => {
  it('correctly transforms globalExports in a single IIFE', async () => {
    const given = await loadFixture('given-single-iife.js');
    const transformed = transformGlobalThisExports(given);
    const expected = await loadFixture('expected-single-iife.js');
    expect(normalize(transformed)).toMatch(normalize(expected));
  });

  it('correctly transforms globalExports in a multiple IIFEs', async () => {
    const given = await loadFixture('given-multiple-iife.js');
    const transformed = transformGlobalThisExports(given);
    const expected = await loadFixture('expected-multiple-iife.js');
    expect(normalize(transformed)).toMatch(normalize(expected));
  });

  it('throws an error when a globalThis export is duplicated', async () => {
    const given = await loadFixture('given-duplicate-error.js');
    expect(() => transformGlobalThisExports(given, { throwOnDuplicates: true })).toThrowError(
      /Duplicate globalThis export/
    );
  });

  it('throws an error when a globalThis export has a computed name but that name is missing', async () => {
    const given = await loadFixture('given-missing-computed-error.js');
    expect(() =>
      transformGlobalThisExports(given, { throwOnUndeclaredComputedProperties: true })
    ).toThrowError(/Undeclared variable/);
  });
});
