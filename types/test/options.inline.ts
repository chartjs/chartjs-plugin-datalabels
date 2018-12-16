import { Chart } from 'chart.js';

new Chart('id', {
	data: {
		datasets: [
			{
				datalabels: {
					align: 'start',
					listeners: {}
				}
			}
		]
	},
	options: {
		plugins: {
			datalabels: {
				align: 'start'
			}
		}
	}
});
