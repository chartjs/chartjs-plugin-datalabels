module.exports = {
    title: 'chartjs-plugin-datalabels',
    description: 'Display labels on data for any type of charts.',
    head: [
        ['link', { rel: 'icon', href: `/favicon.png` }],
    ],
    plugins: [
        ['@vuepress/google-analytics', {
            ga: 'UA-99068522-2'
        }]
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
            { text: 'Samples', link: 'https://chartjs-plugin-datalabels.netlify.com/samples/' }
        ],
        sidebar: [
            '/guide/',
            '/guide/getting-started',
            '/guide/options',
            '/guide/labels',
            '/guide/positioning',
            '/guide/formatting',
            '/guide/events'
        ]
    }
}
