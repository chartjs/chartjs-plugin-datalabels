import { Chart } from 'chart.js';
import { Options } from '../options';

const options: Options = {
	// all optional datalabels options
};

new Chart('id', {
	data: {
		datasets: [
			{
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
