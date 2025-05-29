import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
const pkg = require('./package.json');

export default {
  input: 'index.ts',
  plugins: [
    commonjs(),
    resolve(),
    typescript() 
  ],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      name: 'deepmerge',
      file: 'dist/umd.js',
      format: 'umd',
    },
  ],
};
