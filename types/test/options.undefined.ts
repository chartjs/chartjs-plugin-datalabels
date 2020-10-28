import { Chart } from 'chart.js';

new Chart('id', {
	type: 'bar',
	data: {
		labels: [],
		datasets: [
			{
				data: [],
				// no datalabels options
			}
		]
	},
	options: {
		plugins: {
			// no datalabels options
		}
	}
});
