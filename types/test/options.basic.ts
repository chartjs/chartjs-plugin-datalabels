import { Chart } from 'chart.js';
import { Context } from '../context';
import { Options } from '../options';

const options: Options = {
	align: 'start',
	anchor: 'start',
	backgroundColor: 'blue',
	borderColor: 'blue',
	borderRadius: 42,
	borderWidth: 42,
	clamp: false,
	clip: false,
	color: 'blue',
	display: true,
	font: {
		family: 'foo',
		lineHeight: 1.42,
		size: 42,
		style: 'italic',
		weight: 200
	},
	formatter(v: any, ctx: Context) {
		return ctx.active ? '' + v : null;
	},
	labels: {
		foo: {},
		bar: null,
		bla: {
			align: 'end',
			anchor: 'end',
			backgroundColor: 'blue',
			borderColor: 'blue',
			borderRadius: 42,
			borderWidth: 42,
			clamp: false,
			clip: false,
			color: 'blue',
			display: true,
			font: {
				family: 'foo',
				lineHeight: 1.42,
				size: 42,
				style: 'italic',
				weight: 200
			},
			offset: 42,
			opacity: 0.42,
			listeners: {
				click(ctx: Context) { return true; },
				enter(ctx: Context) { return false; },
				leave(ctx: Context) {}
			},
			padding: {
				top: 42,
				right: 42,
				bottom: 42,
				left: 42
			},
			rotation: 42,
			textAlign: 'end',
			textStrokeColor: 'blue',
			textStrokeWidth: 42,
			textShadowBlur: 42,
			textShadowColor: 'blue'
		}
	},
	listeners: {
		click(ctx: Context) { return true; },
		enter(ctx: Context) { return false; },
		leave(ctx: Context) {}
	},
	offset: 42,
	opacity: 0.42,
	padding: {
		top: 42,
		right: 42,
		bottom: 42,
		left: 42
	},
	rotation: 42,
	textAlign: 'start',
	textStrokeColor: 'blue',
	textStrokeWidth: 42,
	textShadowBlur: 42,
	textShadowColor: 'blue'
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
