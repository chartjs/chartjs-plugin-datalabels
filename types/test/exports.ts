// https://github.com/chartjs/chartjs-plugin-datalabels/issues/130
import {Chart} from 'chart.js';
import {Context} from '../index';
import Plugin from '../index';

// Plugin instance
Chart.register(Plugin);
Chart.unregister(Plugin);

const chart = new Chart('id', {
  data: {
    labels: [],
    datasets: []
  },
  options: {},
  type: 'bar',
  plugins: [Plugin]
});

// Scriptable context
const ctx: Context = {
  active: true,
  chart: chart,
  datasetIndex: 0,
  dataIndex: 0,
  dataset: {
    data: []
  }
};
