import { Plugin } from 'rollup';

import transformGlobalThisExports from './transform-global-this-exports';

export default function (): Plugin {
  return {
    name: 'rollup-plugin-gas',

    generateBundle(_, bundle) {
      for (const [, assetOrChunk] of Object.entries(bundle)) {
        if (assetOrChunk.type === 'chunk') {
          assetOrChunk.code = transformGlobalThisExports(assetOrChunk.code);
        }
      }
    },
  };
}
