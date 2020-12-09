module.exports = {
    title: 'chartjs-plugin-datalabels',
    description: 'Display labels on data for any type of charts.',
    head: [
        ['link', { rel: 'icon', href: `/favicon.png` }],
    ],
    plugins: [
        ['@vuepress/google-analytics', {
            ga: 'UA-99068522-2'
        }],
        ['redirect', {
            redirectors: [
                // Default sample page when accessing /samples.
                { base: '/samples', alternative: ['charts/line'] },
            ],
        }],
        [require('./plugins/chart-editor'), {
            defaults: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    },
                }
            }
        }],
    ],
    themeConfig: {
        repo: 'chartjs/chartjs-plugin-datalabels',
        logo: '/favicon.png',
        lastUpdated: 'Last Updated',
        editLinks: true,
        docsDir: 'docs',
        algolia: {
            apiKey: '7224f458f773f7cf4cbbc4c53621d30c',
            indexName: 'chartjs-plugin-datalabels'
        },
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/' },
            { text: 'Samples', link: '/samples/' },
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
            ],
            '/samples/': [
                {
                    title: 'Charts',
                    collapsable: false,
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
                    collapsable: false,
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
                    collapsable: false,
                    children: [
                        'events/listeners',
                        'events/highlight',
                        'events/selection',
                    ],
                },
                {
                    title: 'Advanced',
                    collapsable: false,
                    children: [
                        'advanced/multiple-labels',
                        'advanced/custom-labels',
                    ],
                }
            ]
        }
    }
}
