import Chart from 'chart.js';

var helpers = Chart.helpers;

var PI = Math.PI;
var HALF_PI = PI / 2;

var devicePixelRatio = (function() {
	if (typeof window !== 'undefined') {
		if (window.devicePixelRatio) {
			return window.devicePixelRatio;
		}

		// devicePixelRatio is undefined on IE10
		// https://stackoverflow.com/a/20204180/8837887
		// https://github.com/chartjs/chartjs-plugin-datalabels/issues/85
		var screen = window.screen;
		if (screen) {
			return (screen.deviceXDPI || 1) / (screen.logicalXDPI || 1);
		}
	}

	return 1;
}());

var utils = {
	// @todo move this in Chart.helpers.toTextLines
	toTextLines: function(inputs) {
		var lines = [];
		var input;

		inputs = [].concat(inputs);
		while (inputs.length) {
			input = inputs.pop();
			if (typeof input === 'string') {
				lines.unshift.apply(lines, input.split('\n'));
			} else if (Array.isArray(input)) {
				inputs.push.apply(inputs, input);
			} else if (!helpers.isNullOrUndef(inputs)) {
				lines.unshift('' + input);
			}
		}

		return lines;
	},

	// @todo move this method in Chart.helpers.canvas.toFont (deprecates helpers.fontString)
	// @see https://developer.mozilla.org/en-US/docs/Web/CSS/font
	toFontString: function(font) {
		if (!font || helpers.isNullOrUndef(font.size) || helpers.isNullOrUndef(font.family)) {
			return null;
		}

		return (font.style ? font.style + ' ' : '')
			+ (font.weight ? font.weight + ' ' : '')
			+ font.size + 'px '
			+ font.family;
	},

	// @todo move this in Chart.helpers.canvas.textSize
	// @todo cache calls of measureText if font doesn't change?!
	textSize: function(ctx, lines, font) {
		var items = [].concat(lines);
		var ilen = items.length;
		var prev = ctx.font;
		var width = 0;
		var i;

		ctx.font = font.string;

		for (i = 0; i < ilen; ++i) {
			width = Math.max(ctx.measureText(items[i]).width, width);
		}

		ctx.font = prev;

		return {
			height: ilen * font.lineHeight,
			width: width
		};
	},

	// @todo move this method in Chart.helpers.options.toFont
	parseFont: function(value) {
		var global = Chart.defaults.global;
		var size = helpers.valueOrDefault(value.size, global.defaultFontSize);
		var font = {
			family: helpers.valueOrDefault(value.family, global.defaultFontFamily),
			lineHeight: helpers.options.toLineHeight(value.lineHeight, size),
			size: size,
			style: helpers.valueOrDefault(value.style, global.defaultFontStyle),
			weight: helpers.valueOrDefault(value.weight, null),
			string: ''
		};

		font.string = utils.toFontString(font);
		return font;
	},

	/**
	 * Returns value bounded by min and max. This is equivalent to max(min, min(value, max)).
	 * @todo move this method in Chart.helpers.bound
	 * https://doc.qt.io/qt-5/qtglobal.html#qBound
	 */
	bound: function(min, value, max) {
		return Math.max(min, Math.min(value, max));
	},

	/**
	 * Returns an array of pair [value, state] where state is:
	 * * -1: value is only in a0 (removed)
	 * *  1: value is only in a1 (added)
	 */
	arrayDiff: function(a0, a1) {
		var prev = a0.slice();
		var updates = [];
		var i, j, ilen, v;

		for (i = 0, ilen = a1.length; i < ilen; ++i) {
			v = a1[i];
			j = prev.indexOf(v);

			if (j === -1) {
				updates.push([v, 1]);
			} else {
				prev.splice(j, 1);
			}
		}

		for (i = 0, ilen = prev.length; i < ilen; ++i) {
			updates.push([prev[i], -1]);
		}

		return updates;
	},

	/**
	 * Creates a "path" for a rectangle with rounded corners at position (x, y) with a
	 * given size (width, height) and the same `radius` for all corners.
	 * @param {CanvasRenderingContext2D} ctx - The canvas 2D Context.
	 * @param {number} x - The x axis of the coordinate for the rectangle starting point.
	 * @param {number} y - The y axis of the coordinate for the rectangle starting point.
	 * @param {number} width - The rectangle's width.
	 * @param {number} height - The rectangle's height.
	 * @param {number} radius - The rounded amount (in pixels) for the four corners.
	 * @todo handle `radius` as top-left, top-right, bottom-right, bottom-left array/object?
	 */
	roundedRect: function(ctx, x, y, width, height, radius) {
		if (radius) {
			var r = Math.min(radius, height / 2, width / 2);
			var left = x + r;
			var top = y + r;
			var right = x + width - r;
			var bottom = y + height - r;

			ctx.moveTo(x, top);
			if (left < right && top < bottom) {
				ctx.arc(left, top, r, -PI, -HALF_PI);
				ctx.arc(right, top, r, -HALF_PI, 0);
				ctx.arc(right, bottom, r, 0, HALF_PI);
				ctx.arc(left, bottom, r, HALF_PI, PI);
			} else if (left < right) {
				ctx.moveTo(left, y);
				ctx.arc(right, top, r, -HALF_PI, HALF_PI);
				ctx.arc(left, top, r, HALF_PI, PI + HALF_PI);
			} else if (top < bottom) {
				ctx.arc(left, top, r, -PI, 0);
				ctx.arc(left, bottom, r, 0, PI);
			} else {
				ctx.arc(left, top, r, -PI, PI);
			}
			ctx.closePath();
			ctx.moveTo(x, y);
		} else {
			ctx.rect(x, y, width, height);
		}
	},

	/**
	 * https://github.com/chartjs/chartjs-plugin-datalabels/issues/70
	 */
	rasterize: function(v) {
		return Math.round(v * devicePixelRatio) / devicePixelRatio;
	}
};

export default utils;
