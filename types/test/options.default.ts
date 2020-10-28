import { Chart } from 'chart.js';
import { Options } from '../options';

const options: Options = {
	// all optional datalabels options
};

new Chart('id', {
	type: 'bar',
	data: {
		labels: [],
		datasets: [
			{
				data: [],
				datalabels: options
			}
		]
	},
	options: {
		plugins: {
			datalabels: options
		}
	}
});
