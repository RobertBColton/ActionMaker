import vue from 'rollup-plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import css from 'rollup-plugin-css-only';
import replace from 'rollup-plugin-replace';
import mkdirp from 'mkdirp';

// ensure output directory exists
mkdirp('bin');

export default {
	entry: 'lib/index.js',
	dest: 'bin/index.js',
	format: 'iife',
	moduleName: 'ActionMaker',
	sourceMap: false,
	useStrict: false,
	globals: {
		'vue': 'Vue'
	},
	plugins: [
		vue({styleToImports: true}),
		css({output: 'bin/index.css'}),
		resolve(),
		replace({
			'process.env.NODE_ENV': JSON.stringify( 'development' )
		})
	]
}
