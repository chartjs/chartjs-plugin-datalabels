/*!
 * chartjs-plugin-datalabels
 * http://chartjs.org/
 * Version: 0.1.0
 *
 * Copyright 2017 Chart.js Contributors
 * Released under the MIT license
 * https://github.com/chartjs/chartjs-plugin-datalabels/blob/master/LICENSE.md
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js')) :
	typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
	(factory(global.Chart));
}(this, (function (Chart) { 'use strict';

Chart = Chart && Chart.hasOwnProperty('default') ? Chart['default'] : Chart;

/**
 * @module Options
 */

var helpers$1 = Chart.helpers;

var defaults = {
	/**
	 * The label box alignment relative to `anchor` ('start'|'center'|'end')
	 * @member {String|Array|Function}
	 * @default 'center'
	 */
	align: 'center',

	/**
	 * The label box alignment relative to the element ('start'|'center'|'end')
	 * @member {String|Array|Function}
	 * @default 'center'
	 */
	anchor: 'center',

	/**
	 * The color used to draw the background of the surrounding frame.
	 * @member {String|Array|Function|null}
	 * @default null (no background)
	 */
	backgroundColor: null,

	/**
	 * The color used to draw the border of the surrounding frame.
	 * @member {String|Array|Function|null}
	 * @default null (no border)
	 */
	borderColor: null,

	/**
	 * The border radius used to add rounded corners to the surrounding frame.
	 * @member {Number|Array|Function}
	 * @default 0 (not rounded)
	 */
	borderRadius: 0,

	/**
	 * The border width of the surrounding frame.
	 * @member {Number|Array|Function}
	 * @default 0 (no border)
	 */
	borderWidth: 0,

	/**
	 * The color used to draw the label text.
	 * @member {String|Array|Function}
	 * @default undefined (use Chart.defaults.global.defaultFontColor)
	 */
	color: undefined,

	/**
	 * Whether to display labels global (boolean) or per data (function)
	 * @member {Boolean|Array|Function}
	 * @default true
	 */
	display: true,

	/**
	 * The font options used to draw the label text.
	 * @member {Object|Array|Function}
	 * @prop {Boolean} font.family - defaults to Chart.defaults.global.defaultFontFamily
	 * @prop {Boolean} font.size - defaults to Chart.defaults.global.defaultFontSize
	 * @prop {Boolean} font.style - defaults to Chart.defaults.global.defaultFontStyle
	 * @prop {Boolean} font.weight - defaults to 'normal'
	 * @default Chart.defaults.global.defaultFont.*
	 */
	font: {
		family: undefined,
		size: undefined,
		style: undefined,
		weight: null
	},

	/**
	 * The line height (in pixel) to use for multi-lines labels.
	 * @member {Number|Array|Function|undefined}
	 * @default 1.2
	 */
	lineHeight: 1.2,

	/**
	 * The distance (in pixels) to pull the label away from the anchor point, the direction
	 * being determined by the `align` value (only applicable if `align` is `start` or `end`).
	 * @member {Number|Array|Function}
	 * @default 4
	 */
	offset: 4,

	/**
	 * The padding (in pixels) to apply between the text and the surrounding frame.
	 * @member {Number|Object|Array|Function}
	 * @prop {Number} padding.top - Space above the text.
	 * @prop {Number} padding.right - Space on the right of the text.
	 * @prop {Number} padding.bottom - Space below the text.
	 * @prop {Number} padding.left - Space on the left of the text.
	 * @default 4 (all values)
	 */
	padding: {
		top: 4,
		right: 4,
		bottom: 4,
		left: 4
	},

	/**
	 * Rotation of the label relative to its center.
	 * @member {Number|Array|Function}
	 * @default 0
	 */
	rotation: 0,

	/**
	 * Text alignment for multi-lines labels ('left'|'right'|'start'|'center'|'end').
	 * @member {String|Array|Function}
	 * @default 'start'
	 */
	textAlign: 'start',

	/**
	 * Allows to customize the label text by transforming input data.
	 * @member {Function|null}
	 * @prop {*} value - The data value
	 * @prop {Object} context - The function unique argument:
	 * @prop {Chart} context.chart - The current chart
	 * @prop {Number} context.dataIndex - Index of the current data
	 * @prop {Object} context.dataset - The current dataset
	 * @prop {Number} context.datasetIndex - Index of the current dataset
	 * @default data[index]
	 */
	formatter: function(value) {
		var label = value;
		var keys, klen, k;

		if (helpers$1.isObject(value)) {
			if (!helpers$1.isNullOrUndef(value.label)) {
				label = value.label;
			} else if (!helpers$1.isNullOrUndef(value.r)) {
				label = value.r;
			} else {
				label = '';
				keys = Object.keys(value);
				for (k = 0, klen = keys.length; k < klen; ++k) {
					label += (k !== 0 ? ', ' : '') + keys[k] + ': ' + value[keys[k]];
				}
			}
		}
		return '' + label;
	}
};

function orient(point, origin) {
	var x0 = origin.x;
	var y0 = origin.y;

	if (x0 === null) {
		return {x: 0, y: -1};
	}
	if (y0 === null) {
		return {x: 1, y: 0};
	}

	var dx = point.x - x0;
	var dy = point.y - y0;
	var ln = Math.sqrt(dx * dx + dy * dy);
	return {
		x: ln ? dx / ln : 0,
		y: ln ? dy / ln : -1
	};
}

var positioners = {
	arc: function(vm, anchor) {
		var angle = (vm.startAngle + vm.endAngle) / 2;
		var vx = Math.cos(angle);
		var vy = Math.sin(angle);
		var r0 = vm.innerRadius;
		var r1 = vm.outerRadius;
		var d;

		if (anchor === 'start') {
			d = r0;
		} else if (anchor === 'end') {
			d = r1;
		} else {
			d = (r0 + r1) / 2;
		}

		return {
			x: vm.x + vx * d,
			y: vm.y + vy * d,
			vx: vx,
			vy: vy
		};
	},

	point: function(vm, anchor, origin) {
		var v = orient(vm, origin);
		var r = vm.radius;
		var d = 0;

		if (anchor === 'start') {
			d = -r;
		} else if (anchor === 'end') {
			d = r;
		}

		return {
			x: vm.x + v.x * d,
			y: vm.y + v.y * d,
			vx: v.x,
			vy: v.y
		};
	},

	rect: function(vm, anchor, origin) {
		var horizontal = vm.horizontal;
		var size = Math.abs(vm.base - (horizontal ? vm.x : vm.y));
		var x = horizontal ? Math.min(vm.x, vm.base) : vm.x;
		var y = horizontal ? vm.y : Math.min(vm.y, vm.base);
		var v = orient(vm, origin);

		if (anchor === 'center') {
			if (horizontal) {
				x += size / 2;
			} else {
				y += size / 2;
			}
		} else if (anchor === 'start' && !horizontal) {
			y += size;
		} else if (anchor === 'end' && horizontal) {
			x += size;
		}

		return {
			x: x,
			y: y,
			vx: v.x,
			vy: v.y
		};
	},

	fallback: function(vm, anchor, origin) {
		var v = orient(vm, origin);
		return {
			x: vm.x,
			y: vm.y,
			vx: v.x,
			vy: v.y
		};
	}
};

/**
 * @see https://github.com/chartjs/Chart.js/issues/4176
 */

Chart.defaults.global.plugins.datalabels = defaults;

var helpers = Chart.helpers;
var MODEL_KEY = '$datalabels';

// @todo move this in Chart.helpers.toTextLines
function toTextLines(inputs) {
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
}

// @todo move this method in Chart.helpers.canvas.toFont (deprecates helpers.fontString)
// @see https://developer.mozilla.org/en-US/docs/Web/CSS/font
function toFontString(font) {
	if (!font || helpers.isNullOrUndef(font.size) || helpers.isNullOrUndef(font.family)) {
		return null;
	}

	return (font.style ? font.style + ' ' : '')
		+ (font.weight ? font.weight + ' ' : '')
		+ font.size + 'px '
		+ font.family;
}

// @todo move this in Chart.helpers.canvas.textSize
// @todo cache calls of measureText if font doesn't change?!
function textSize(ctx, lines, font) {
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
}

// @todo move this method in Chart.helpers.options.toFont
function parseFont(value) {
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

	font.string = toFontString(font);
	return font;
}

function coordinates(el, model) {
	var point = model.positioner(el._view, model.anchor, model.origin);

	if (model.align === 'center') {
		// if aligned center, we don't want to offset the center point
		return {x: point.x, y: point.y};
	}

	var padding = model.padding;
	var rotation = model.rotation;
	var th = model.size.height;
	var tw = model.size.width;
	var vx = point.vx;
	var vy = point.vy;
	var dx = 0;
	var dy = 0;

	if (model.align === 'start') {
		vx = -vx;
		vy = -vy;
	}

	// take in account the label rotation
	dx += Math.abs(tw / 2 * Math.cos(rotation)) + Math.abs(th / 2 * Math.sin(rotation));
	dy += Math.abs(tw / 2 * Math.sin(rotation)) + Math.abs(th / 2 * Math.cos(rotation));

	// ... and padding
	dx += vx > 0 ? padding.right : padding.left;
	dy += vy > 0 ? padding.bottom : padding.top;

	// ... and borders
	dx += model.borderWidth || 0;
	dy += model.borderWidth || 0;

	// ... and explicit offset
	dx += model.offset;
	dy += model.offset;

	return {
		x: point.x + dx * vx,
		y: point.y + dy * vy
	};
}

function boundingRects(size, padding) {
	var th = size.height;
	var tw = size.width;
	var tx = -tw / 2;
	var ty = -th / 2;

	return {
		frame: {
			x: tx - padding.left,
			y: ty - padding.top,
			w: tw + padding.width,
			h: th + padding.height,
		},
		text: {
			x: tx,
			y: ty,
			w: tw,
			h: th
		}
	};
}

function drawFrame(ctx, rect, model) {
	var bgColor = model.backgroundColor;
	var borderColor = model.borderColor;
	var borderWidth = model.borderWidth;

	if (!bgColor && (!borderColor || !borderWidth)) {
		return;
	}

	ctx.beginPath();

	helpers.canvas.roundedRect(
		ctx,
		Math.round(rect.x) - borderWidth / 2,
		Math.round(rect.y) - borderWidth / 2,
		Math.round(rect.w) + borderWidth,
		Math.round(rect.h) + borderWidth,
		model.borderRadius);

	ctx.closePath();

	if (bgColor) {
		ctx.fillStyle = bgColor;
		ctx.fill();
	}

	if (borderColor && borderWidth) {
		ctx.strokeStyle = borderColor;
		ctx.lineWidth = borderWidth;
		ctx.lineJoin = 'miter';
		ctx.stroke();
	}
}

function drawText(ctx, lines, rect, model) {
	var align = model.textAlign;
	var font = model.font;
	var lh = font.lineHeight;
	var color = model.color;
	var ilen = lines.length;
	var x, y, i;

	if (!ilen || !color) {
		return;
	}

	x = rect.x;
	y = rect.y + lh / 2;

	if (align === 'center') {
		x += rect.w / 2;
	} else if (align === 'end' || align === 'right') {
		x += rect.w;
	}

	ctx.font = model.font.string;
	ctx.fillStyle = color;
	ctx.textAlign = align;
	ctx.textBaseline = 'middle';

	for (i = 0; i < ilen; ++i) {
		ctx.fillText(
			lines[i],
			Math.round(x),
			Math.round(y),
			Math.round(rect.w));

		y += lh;
	}
}

function getPositioner(el) {
	if (el instanceof Chart.elements.Arc) {
		return positioners.arc;
	}
	if (el instanceof Chart.elements.Point) {
		return positioners.point;
	}
	if (el instanceof Chart.elements.Rectangle) {
		return positioners.rect;
	}
	return positioners.fallback;
}

function getScaleOrigin(el) {
	var horizontal = el._model.horizontal;
	var scale = el._scale || (horizontal && el._xScale) || el._yScale;

	if (!scale) {
		return null;
	}

	if (scale.xCenter !== undefined && scale.yCenter !== undefined) {
		return {x: scale.xCenter, y: scale.yCenter};
	}

	var pixel = scale.getBasePixel();
	return horizontal ?
		{x: pixel, y: null} :
		{x: null, y: pixel};
}

function modelize(el, index, ctx, config, context) {
	var resolve = Chart.helpers.options.resolve;
	if (!resolve([config.display, true], context, index)) {
		return null;
	}

	var value = context.dataset.data[index];
	var label = helpers.valueOrDefault(helpers.callback(config.formatter, [value, context]), value);
	var lines = helpers.isNullOrUndef(label) ? [] : toTextLines(label);
	if (!lines.length) {
		return null;
	}

	var font = parseFont(resolve([config.font, {}], context, index));
	var model = {
		align: resolve([config.align, 'center'], context, index),
		anchor: resolve([config.anchor, 'center'], context, index),
		backgroundColor: resolve([config.backgroundColor, null], context, index),
		borderColor: resolve([config.borderColor, null], context, index),
		borderRadius: resolve([config.borderRadius, 0], context, index),
		borderWidth: resolve([config.borderWidth, 0], context, index),
		color: resolve([config.color, Chart.defaults.global.defaultFontColor], context, index),
		font: font,
		lines: lines,
		offset: resolve([config.offset, 0], context, index),
		padding: helpers.options.toPadding(resolve([config.padding, 0], context, index)),
		rotation: resolve([config.rotation, 0], context, index) * (Math.PI / 180),
		textAlign: resolve([config.textAlign, 'start'], context, index),
		origin: getScaleOrigin(el),
		positioner: getPositioner(el),
		size: textSize(ctx, lines, font)
	};

	return model;
}

function configure(dataset, options) {
	var override = dataset.datalabels;
	var config = {};

	if (override === false) {
		return null;
	}
	if (override === true) {
		override = {};
	}

	return helpers.merge(config, [options, override]);
}

Chart.plugins.register({
	id: 'datalabels',

	afterDatasetUpdate: function(chart, args, options) {
		var dataset = chart.data.datasets[args.index];
		var config = configure(dataset, options);
		var display = config && config.display;
		var elements = args.meta.data || [];
		var ilen = elements.length;
		var ctx = chart.ctx;
		var i, el;

		ctx.save();

		for (i = 0; i < ilen; ++i) {
			el = elements[i];
			el[MODEL_KEY] = display && el && !el.hidden ?
				modelize(el, i, ctx, config, {
					chart: chart,
					dataIndex: i,
					dataset: dataset,
					datasetIndex: args.index
				}) :
				null;
		}

		ctx.restore();
	},

	afterDatasetDraw: function(chart, args) {
		var elements = args.meta.data || [];
		var ilen = elements.length;
		var ctx = chart.ctx;
		var i, el, model, center, rects;

		for (i = 0; i < ilen; ++i) {
			el = elements[i];
			model = el[MODEL_KEY];
			if (!model) {
				continue;
			}

			center = coordinates(el, model);
			rects = boundingRects(model.size, model.padding);

			ctx.save();
			ctx.translate(Math.round(center.x), Math.round(center.y));
			ctx.rotate(model.rotation);

			drawFrame(ctx, rects.frame, model);
			drawText(ctx, model.lines, rects.text, model);

			ctx.restore();
		}
	}
});

})));
