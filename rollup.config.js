import vue from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'lib/index.js',
  dest: 'index.js',
  format: 'iife',
  moduleName: 'ActionMaker',
  sourceMap: false,
  useStrict: false,
  intro: "process = { env: { NODE_ENV: window } };",
  globals: {
    vue: 'Vue'
  },
  plugins: [
    resolve({
        vue: true
    }),
    vue({compileTemplate: true})
  ]
}
