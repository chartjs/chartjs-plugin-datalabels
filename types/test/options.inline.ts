import { Chart } from 'chart.js';
import { Context } from '../context';

new Chart('id', {
	data: {
		datasets: [
			{
				datalabels: {
					align: 'start',
					labels: {
						foo: {},
						bar: null,
						bla: {
							align: 'end',
							listeners: {
								click(ctx: Context) { return true; }
							}
						}
					},
					listeners: {
						click(ctx: Context) { return true; }
					}
				}
			}
		]
	},
	options: {
		plugins: {
			datalabels: {
				align: 'start',
				labels: {
					foo: {},
					bar: null,
					bla: {
						align: 'end',
						listeners: {
							click(ctx: Context) { return true; }
						}
					}
				},
				listeners: {
					click(ctx: Context) { return true; }
				}
			}
		}
	}
});
