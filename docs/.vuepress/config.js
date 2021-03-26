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
  ],
  themeConfig: {
    repo: 'chartjs/chartjs-plugin-datalabels',
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
