import { Chart } from 'chart.js';
import { Context } from '../context';
import { Options } from '../options';

const options: Options = {
	align: (ctx: Context) => { return 'end'; },
	anchor: (ctx: Context) => { return 'end'; },
	backgroundColor: (ctx: Context) => { return 'blue'; },
	borderColor: (ctx: Context) => { return 'blue'; },
	borderRadius: (ctx: Context) => { return 42; },
	borderWidth: (ctx: Context) => { return 42; },
	clamp: (ctx: Context) => { return false; },
	clip: (ctx: Context) => { return false; },
	color: (ctx: Context) => { return 'blue'; },
	display: (ctx: Context) => { return true; },
	font: (ctx: Context) => { return {size: 42}; },
	labels: {
		foo: {},
		bar: null,
		bla: {
			align: (ctx: Context) => { return 'end'; },
			anchor: (ctx: Context) => { return 'end'; },
			backgroundColor: (ctx: Context) => { return 'blue'; },
			borderColor: (ctx: Context) => { return 'blue'; },
			borderRadius: (ctx: Context) => { return 42; },
			borderWidth: (ctx: Context) => { return 42; },
			clamp: (ctx: Context) => { return false; },
			clip: (ctx: Context) => { return false; },
			color: (ctx: Context) => { return 'blue'; },
			display: (ctx: Context) => { return true; },
			font: (ctx: Context) => { return {size: 42}; },
			offset: (ctx: Context) => { return 42; },
			opacity: (ctx: Context) => { return 0.42; },
			padding: (ctx: Context) => { return 42; },
			rotation: (ctx: Context) => { return 42; },
			textAlign: (ctx: Context) => { return 'end'; },
			textStrokeColor: (ctx: Context) => { return 'blue'; },
			textStrokeWidth: (ctx: Context) => { return 42; },
			textShadowBlur: (ctx: Context) => { return 42; },
			textShadowColor: (ctx: Context) => { return 'blue'; }
		}
	},
	offset: (ctx: Context) => { return 42; },
	opacity: (ctx: Context) => { return 0.42; },
	padding: (ctx: Context) => { return 42; },
	rotation: (ctx: Context) => { return 42; },
	textAlign: (ctx: Context) => { return 'end'; },
	textStrokeColor: (ctx: Context) => { return 'blue'; },
	textStrokeWidth: (ctx: Context) => { return 42; },
	textShadowBlur: (ctx: Context) => { return 42; },
	textShadowColor: (ctx: Context) => { return 'blue'; },
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
