import {Chart, registerables} from 'chart.js';
import plugin from '../../dist/chartjs-plugin-datalabels.js';

Chart.register(...registerables);
Chart.register(plugin);
