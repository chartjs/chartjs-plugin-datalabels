var commonjs = require('rollup-plugin-commonjs');
var resolve = require('rollup-plugin-node-resolve');

module.exports = function(karma) {
	var args = karma.args || {};

	karma.set({
		browsers: ['Firefox'],
		frameworks: ['jasmine'],
		reporters: ['spec', 'kjhtml'],

		files: [
			{pattern: './test/fixtures/**/*.js', included: false},
			{pattern: './test/fixtures/**/*.png', included: false},
			'node_modules/chart.js/dist/Chart.js',
			'test/index.js',
			'src/plugin.js'
		].concat(args.inputs),

		preprocessors: {
			'test/fixtures/**/*.js': ['fixtures'],
			'test/specs/**/*.js': ['rollup'],
			'test/index.js': ['rollup'],
			'src/plugin.js': ['rollup']
		},

		rollupPreprocessor: {
			format: 'umd',
			plugins: [
				resolve(),
				commonjs()
			],
			external: [
				'chart.js'
			],
			globals: {
				'chart.js': 'Chart'
			}
		},

		customPreprocessors: {
			fixtures: {
				base: 'rollup',
				options: {
					format: 'iife',
					name: 'fixture',
				}
			}
		}
	});
};
