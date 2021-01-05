const {resolve} = require('path');

module.exports = ({defaults}) => {
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
          Chart.helpers.merge(Chart.defaults, ${JSON.stringify(defaults)});
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
