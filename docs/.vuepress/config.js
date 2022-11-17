const path = require('path');

// https://docs.netlify.com/configure-builds/environment-variables/#git-metadata
const BRANCH = process.env.BRANCH || (process.env.NODE_ENV === 'development' ? 'local' : '');
const IS_DEV = BRANCH ? !BRANCH.match(/^v\d\.\d\.\d/) : false;
const REPO_NAME = 'chartjs/chartjs-plugin-datalabels';
const REPO_URL = `https://www.github.com/${REPO_NAME}`;

module.exports = {
  dest: 'dist/docs',
  theme: 'chartjs',
  title: 'chartjs-plugin-datalabels',
  description: 'Display labels on data for any type of charts',
  head: [
    ['link', {rel: 'icon', href: '/favicon.png'}],
  ],
  plugins: [
    ['@vuepress/google-analytics', {
      ga: 'UA-99068522-2'
    }],
    ['redirect', {
      redirectors: [
        // Default sample page when accessing /samples.
        {base: '/samples', alternative: ['charts/line']},
      ],
    }],
    ['@simonbrunel/vuepress-plugin-versions', {
      filters: {
        compat: (major) => +major < 2 ? 2 : 3,
        slug: (v) => v.replace(/\./g, '_'),
        suffix: (v) => v ? ` (${v})` : '',
      },
      menu: {
        text: IS_DEV ? `Development (${BRANCH})` : '{{version}}',
        items: [
          {
            text: 'Documentation',
            items: [
              {
                target: '_self',
                text: 'Development (master)',
                link: 'https://master--chartjs-plugin-datalabels.netlify.app/',
              },
              {
                type: 'versions',
                text: '{{major}}.{{minor}}.x - Chart.js v{{major|compat}}',
                link: 'https://v{{version|slug}}--chartjs-plugin-datalabels.netlify.app/',
                target: '_self',
                group: 'major',
              },
            ],
          },
          {
            text: 'Release notes',
            items: [
              {
                type: 'versions',
                text: 'v{{version}}{{tag|suffix}}',
                link: `${REPO_URL}/releases/tag/v{{version}}`,
                group: 'major',
              },
              {
                text: 'All releases',
                link: `${REPO_URL}/releases`,
              },
            ],
          },
        ],
      }
    }]
  ],
  chainWebpack(config) {
    config.module
      .rule('chart.js')
      .include.add(path.resolve('node_modules/chart.js')).end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        presets: ['@babel/preset-env']
      })
      .end();
  },
  themeConfig: {
    repo: REPO_NAME,
    docsDir: 'docs',
    editLinks: true,
    logo: '/favicon.png',
    lastUpdated: 'Last Updated',
    searchPlaceholder: 'Search...',
    algolia: {
      apiKey: '7224f458f773f7cf4cbbc4c53621d30c',
      indexName: 'chartjs-plugin-datalabels',
    },
    chart: {
      imports: [
        ['samples/register.js'],
        ['samples/defaults.js'],
        ['samples/utils.js', 'Utils'],
      ]
    },
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Guide', link: '/guide/'},
      {text: 'Samples', link: '/samples/'},
    ],
    sidebar: {
      '/guide/': [
        '',
        'getting-started',
        'options',
        'labels',
        'positioning',
        'formatting',
        'events',
        'typescript',
        'migration',
      ],
      '/samples/': [
        {
          title: 'Charts',
          children: [
            'charts/line',
            'charts/bar',
            'charts/doughnut',
            'charts/polar',
            'charts/radar',
            'charts/bubble',
          ],
        },
        {
          title: 'Scriptable',
          children: [
            'scriptable/interactions',
            'scriptable/data',
            'scriptable/dataset',
            'scriptable/indices',
            'scriptable/mirror',
          ],
        },
        {
          title: 'Events',
          children: [
            'events/listeners',
            'events/highlight',
            'events/selection',
          ],
        },
        {
          title: 'Advanced',
          children: [
            'advanced/multiple-labels',
            'advanced/custom-labels',
          ],
        }
      ]
    }
  }
};
