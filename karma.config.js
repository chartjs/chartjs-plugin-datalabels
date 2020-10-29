const commonjs = require('rollup-plugin-commonjs');
const istanbul = require('rollup-plugin-istanbul');
const resolve = require('rollup-plugin-node-resolve');
const builds = require('./rollup.config');

module.exports = function(karma) {
	const args = karma.args || {};
	const regex = args.watch ? /s\.js$/ : /s\.min\.js$/;
	const output = builds[0].output.filter((v) => v.file.match(regex))[0];
	const build = Object.assign({}, builds[0], {output: output});

	if (args.watch) {
		build.output.sourcemap = 'inline';
	}

	karma.set({
		browsers: ['firefox'],
		frameworks: ['jasmine'],
		reporters: ['spec', 'kjhtml'],
		logLevel: karma.LOG_WARN,

		files: [
			{pattern: './test/fixtures/**/*.js', included: false},
			{pattern: './test/fixtures/**/*.png', included: false},
			'node_modules/chart.js/dist/chart.js',
			'test/index.js',
			'src/plugin.js'
		].concat(args.inputs),

		// Explicitly disable hardware acceleration to make image
		// diff more stable when ran on Travis and dev machine.
		// https://github.com/chartjs/Chart.js/pull/5629
		customLaunchers: {
			firefox: {
				base: 'Firefox',
				prefs: {
					'layers.acceleration.disabled': true
				}
			}
		},

		preprocessors: {
			'test/fixtures/**/*.js': ['fixtures'],
			'test/specs/**/*.js': ['rollup'],
			'test/index.js': ['rollup'],
			'src/plugin.js': ['sources']
		},

		rollupPreprocessor: {
			plugins: [
				resolve(),
				commonjs()
			],
			external: [
				'chart.js'
			],
			output: {
				format: 'umd',
				globals: {
					'chart.js': 'Chart'
				}
			}
		},

		customPreprocessors: {
			fixtures: {
				base: 'rollup',
				options: {
					output: {
						format: 'iife',
						name: 'fixture'
					}
				}
			},
			sources: {
				base: 'rollup',
				options: build
			}
		}
	});

	if (args.coverage) {
		karma.reporters.push('coverage');
		karma.coverageReporter = {
			dir: 'coverage/',
			reporters: [
				{type: 'html', subdir: 'html'},
				{type: 'lcovonly', subdir: '.'}
			]
		};
		[
			karma.rollupPreprocessor,
			karma.customPreprocessors.sources.options
		].forEach((v) => {
			(v.plugins || (v.plugins = [])).push(
				istanbul({
					include: 'src/**/*.js'
				}));
		});
	}
};
