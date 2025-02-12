import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json';

const config = [
  {
    input: 'src/index.tsx',
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        useTsconfigDeclarationDir: true,
        exclude: [
          '**/*.stories.tsx',
          '**/stories/**',
          '**/__stories__/**',
          'src/stories/**',
          '.storybook/**',
          'storybook-static/**',
        ],
      }),
      terser(),
    ],
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
  },
];
export default config;
