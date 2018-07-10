export default {
	'jasmine-chart-area': {
		afterDraw: function(chart) {
			var ctx = chart.ctx;
			var area = chart.chartArea;

			ctx.save();
			ctx.beginPath();
			ctx.rect(
				area.left,
				area.top,
				area.right - area.left,
				area.bottom - area.top);
			ctx.strokeStyle = 'blue';
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.restore();
		}
	}
};
