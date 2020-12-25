module.exports = {
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
		locales: {
				'/': {
						lang: 'en-US',
						title: 'chartjs-plugin-datalabels',
    				description: 'Display labels on data for any type of charts.',
				},
				'/zh/': {
						lang: 'zh-CN',
						title: 'chartjs-plugin-datalabels',
    				description: '支持任意类型的图表显示文本标签',
				}
		},
    themeConfig: {
        repo: 'chartjs/chartjs-plugin-datalabels',
        logo: '/favicon.png',
        editLinks: true,
        docsDir: 'docs',
        algolia: {
            apiKey: '7224f458f773f7cf4cbbc4c53621d30c',
            indexName: 'chartjs-plugin-datalabels'
        },
				locales: {
						'/': require('./locales/en.js'),
						'/zh/': require('./locales/zh.js')
				}
    }
}
