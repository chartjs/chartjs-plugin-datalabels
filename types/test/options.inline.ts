import {Chart} from 'chart.js';
import {Context} from '../context';

const chart = new Chart('id', {
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
								click: (ctx: Context) => true
							}
						}
					},
					listeners: {
						click: (ctx: Context) => true
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
							click: (ctx: Context) => true
						}
					}
				},
				listeners: {
					click: (ctx: Context) => true
				}
			}
		}
	}
});
