import { RollupOptions } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

import gas from './rollup-plugin-gas';

const options: RollupOptions = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
    typescript({
      rootDir: 'src/',
    }),
    gas(),
    copy({
      targets: [{ src: 'src/appsscript.json', dest: 'dist/' }],
    }),
  ],
};

export default options;
