const {resolve} = require('path');

function render({renderer}) {
  const fence = renderer.rules.fence;
  renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];
    const lang = token.info.trim();

    return (/ chart-editor( |$)/).test(lang) ?
      `<chart-editor :code="\`${token.content}\`"/>` :
      fence(...args);
  };
}

function importsScripts(imports) {
  const names = imports.map(([, name]) => name).filter((name) => !!name);
  const lines = imports.map(([file, name]) => {
    const path = `@docs/${file}`;
    return name ?
      `import * as ${name} from '${path}'` :
      `import '${path}'`;
  });

  return `
    import Vue from 'vue';
    ${lines.join(';\n')};

    const imports = {
      ${names.join(',\n')}
    }

    Vue.mixin({
      created() {
        this.$chart = this.$chart || {};
        this.$chart.imports = imports;
      }
    })
  `;
}

module.exports = ({imports}) => {
  return {
    name: 'vuepress-plugin-chart-editor',
    enhanceAppFiles: [
      resolve(__dirname, 'global.js'),
      resolve(__dirname, 'enhancer.js'),
      {
        content: importsScripts(imports),
        name: 'chart-imports',
      }
    ],
    chainWebpack: (config) => {
      config.merge({
        externals: {
          moment: 'moment',
        },
        resolve: {
          alias: {
            '@docs': resolve(__dirname, '../../../'),
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
