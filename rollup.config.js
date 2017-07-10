import vue from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import css from 'rollup-plugin-css-only';

export default {
  entry: './lib/index.js',
  dest: './bin/index.js',
  format: 'iife',
  moduleName: 'ActionMaker',
  sourceMap: false,
  useStrict: false,
  intro: "process = { env: { NODE_ENV: window } };",
  globals: {
    vue: 'Vue'
  },
  plugins: [
    vue({styleToImports: true}),
    css({output: './bin/index.css'}),
    resolve()
  ]
}
