module.exports = {
    label: 'English',
    selectText: 'Languages',
    ariaLabel: 'Select language',
    editLinkText: 'Edit this page',
    lastUpdated: 'Last Updated',
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