const {resolve} = require('path');

module.exports = ({ defaults }) => {
	function render(md) {
		const fence = md.renderer.rules.fence;
		md.renderer.rules.fence = (...args) => {
			const [tokens, idx] = args;
			const token = tokens[idx];
			const lang = token.info.trim();

			if (!(/ chart-editor( |$)/).test(lang)) {
				return fence(...args);
			}

			return `<chart-editor :code="\`${token.content}\`"/>`;
		};
	}

	return {
		name: 'vuepress-plugin-chart-editor',
		enhanceAppFiles: [
			{
				name: 'chart-defaults',
				content: `
					import Chart from 'chart.js';
					Chart.defaults.set(${JSON.stringify(defaults)});
				`
			},
			resolve(__dirname, 'global.js'),
			resolve(__dirname, 'enhancer.js'),
		],
		chainWebpack: (config) => {
			config.merge({
				externals: {
					moment: 'moment',
				},
				resolve: {
					alias: {
						// Don't use the Chart.js ESM build since it's not yet
						// compatible with the current plugin implementation.
						'chart.js': 'chart.js/dist/chart.js'
					}
				}
			});
		},
		chainMarkdown: (config) => {
			config
				.plugin('chart-editor')
				.use(render)
				.end();
		},
	};
};
