const pkg = require('./package.json');

const banner = `/*!
 * @license
 * ` + pkg.name + `
 * http://chartjs.org/
 * Version: ` + pkg.version + `
 *
 * Copyright ` + (new Date().getFullYear()) + ` Chart.js Contributors
 * Released under the MIT license
 * https://github.com/chartjs/` + pkg.name + `/blob/master/LICENSE.md
 */`;

export default {
	input: 'src/plugin.js',
	banner: banner,
	format: 'umd',
	external: [
		'chart.js'
	],
	globals: {
		'chart.js': 'Chart'
	}
};
