module.exports = {
    label: '简体中文',
    selectText: '选择语言',
    ariaLabel: '选择语言',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    nav: [
        { text: '首页', link: '/zh/' },
        { text: '指南', link: '/zh/guide/' },
        { text: '例子', link: '/zh/samples/charts/line' },
    ],
    sidebar: {
        '/zh/guide/': [
            '',
            'getting-started',
            'options',
            'labels',
            'positioning',
            'formatting',
            'events',
        ],
        '/zh/samples/': [
            {
                title: '图表类型',
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
                title: '脚本配置项',
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
                title: '事件',
                collapsable: false,
                children: [
                    'events/listeners',
                    'events/highlight',
                    'events/selection',
                ],
            },
            {
                title: '高级用法',
                collapsable: false,
                children: [
                    'advanced/multiple-labels',
                    'advanced/custom-labels',
                ],
            }
        ]
    }
}