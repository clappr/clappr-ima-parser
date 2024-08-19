import { createBabelInputPluginFactory } from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import serve from 'rollup-plugin-serve'
import filesize from 'rollup-plugin-filesize'
import namedDirectory from 'rollup-plugin-named-directory'
import size from 'rollup-plugin-sizes'
import visualize from 'rollup-plugin-visualizer'
import { terser } from 'rollup-plugin-terser'
import babelConfig from './babel.config.json'

const babelPluginForUMDBundle = createBabelInputPluginFactory()
const babelPluginForESMBundle = createBabelInputPluginFactory()
const babelPluginOptions = { ...babelConfig, exclude: 'node_modules/**', babelHelpers: 'bundled' }
const aliasPluginOptions = { entries: { '@': `${__dirname}/src` } }

const plugins = [
  alias(aliasPluginOptions),
  namedDirectory(),
  size(),
  filesize(),
  !!process.env.DEV && serve({ contentBase: ['dist', 'public'], host: '0.0.0.0', port: '8080' }),
  !!process.env.ANALYZE_BUNDLE && visualize({ open: true }),
]

const browserBundle = {
  input: 'src/ima-parser.js',
  external: ['@clappr/core'],
  output: [
    {
      name: 'IMAParser',
      exports: 'named',
      file: 'dist/clappr-ima-parser.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
    },
    !!process.env.MINIMIZE && {
      name: 'IMAParser',
      exports: 'named',
      file: 'dist/clappr-ima-parser.min.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
      plugins: terser(),
    },
  ],
  plugins: [babelPluginForUMDBundle(babelPluginOptions), resolve({ browser: true }), commonjs(), ...plugins],
}

const nodeBundle = {
  input: 'src/ima-parser.js',
  external: ['@clappr/core'],
  output: [
    {
      name: 'IMAParser',
      exports: 'named',
      file: 'dist/clappr-ima-parser-node.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
    },
    !!process.env.MINIMIZE && {
      name: 'IMAParser',
      exports: 'named',
      file: 'dist/clappr-ima-parser-node.min.js',
      format: 'umd',
      globals: { '@clappr/core': 'Clappr' },
      plugins: terser(),
    },
  ],
  plugins: [babelPluginForUMDBundle(babelPluginOptions), resolve(), commonjs(), ...plugins],
}

const esmBundle = {
  input: 'src/ima-parser.js',
  external: ['@clappr/core', /@babel\/runtime/],
  output: {
    name: 'IMAParser',
    exports: 'named',
    file: 'dist/clappr-ima-parser.esm.js',
    format: 'esm',
    globals: { '@clappr/core': 'Clappr' },
  },
  plugins: [
    babelPluginForESMBundle({
      ...babelPluginOptions,
      plugins: ['@babel/plugin-transform-runtime'],
      babelHelpers: 'runtime',
    }),
    ...plugins,
  ],
}

export default [browserBundle, nodeBundle, esmBundle]
