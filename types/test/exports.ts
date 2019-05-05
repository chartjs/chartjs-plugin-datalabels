// https://github.com/chartjs/chartjs-plugin-datalabels/issues/130
import { Chart } from 'chart.js'
import { Context } from '../index'
import Plugin from '../index'

// Plugin instance
Chart.plugins.register(Plugin)
Chart.plugins.unregister(Plugin)

const chart = new Chart('id', {
    plugins: [Plugin]
})

// Scriptable context
const ctx: Context = {
    active: true,
    chart: chart,
    datasetIndex: 0,
    dataIndex: 0,
    dataset: {}
}
