module.exports = {
    title: 'chartjs-plugin-datalabels',
    description: 'Display labels on data for any type of charts.',
    ga: 'UA-99068522-2',
    head: [
        ['link', { rel: 'icon', href: `/favicon.png` }],
    ],
    themeConfig: {
        repo: 'chartjs/chartjs-plugin-datalabels',
        logo: '/favicon.png',
        lastUpdated: 'Last Updated',
        editLinks: true,
        docsDir: 'docs',
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/' },
            { text: 'Samples', link: 'https://chartjs-plugin-datalabels.netlify.com/samples/' }
        ],
        sidebar: [
            '/guide/',
            '/guide/installation',
            '/guide/options',
            '/guide/positioning',
            '/guide/formatting',
            '/guide/events'
        ]
    }
}
