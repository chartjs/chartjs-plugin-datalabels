/**
 * @see https://github.com/chartjs/Chart.js/issues/4176
 */

'use strict';

import Chart from 'chart.js';
import defaults from './options.js';
import positioners from './positioners.js';

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
			lines.unshift(''+input);
		}
	}

	return lines;
}

// @todo move this method in Chart.helpers.canvas.toFont (deprecates helpers.fontString)
function toFontString(font) {
	if (!font || helpers.isNullOrUndef(font.size) || helpers.isNullOrUndef(font.family)) {
		return null;
	}

	return (font.style? font.style + ' ' : '')
		+ (font.weight? font.weight + ' ' : '')
		+ font.size + 'px '
		+ font.family;
}

// @todo move this in Chart.helpers.canvas.textSize
// @todo cache calls of measureText if font doesn't change?!
function textSize(ctx, lines, font, lineHeight) {
	var items = [].concat(lines);
	var ilen = items.length;
	var width = 0;
	var item, i;

	ctx.font = font;

	for (i=0; i<ilen; ++i) {
		item = items[i];
		width = Math.max(ctx.measureText(item).width, width);
	}

	return {
		height: items.length*lineHeight,
		width: width
	};
}

// @todo move this method in Chart.helpers.options.toPadding
function parsePadding(value) {
	var t, r, b, l;

	if (helpers.isObject(value)) {
		t = parseFloat(value.top) || 0;
		r = parseFloat(value.right) || 0;
		b = parseFloat(value.bottom) || 0;
		l = parseFloat(value.left) || 0;
	} else {
		t = r = b = l = parseFloat(value) || 0;
	}

	return {
		top: t,
		right: r,
		bottom: b,
		left: l,
		height: t+b,
		width: l+r
	};
}

// @todo move this method in Chart.helpers.options.toFont
function parseFont(value) {
	var global = Chart.defaults.global;
	var font = {
		family: helpers.valueOrDefault(value.family, global.defaultFontFamily),
		size: helpers.valueOrDefault(value.size, global.defaultFontSize),
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
	dx += Math.abs(tw/2 * Math.cos(rotation)) + Math.abs(th/2 * Math.sin(rotation));
	dy += Math.abs(tw/2 * Math.sin(rotation)) + Math.abs(th/2 * Math.cos(rotation));

	// ... and padding
	dx += vx > 0? padding.right : padding.left;
	dy += vy > 0? padding.bottom : padding.top;

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
	var tx = -tw/2;
	var ty = -th/2;

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
		Math.round(rect.x) - borderWidth/2,
		Math.round(rect.y) - borderWidth/2,
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
	var lh = model.lineHeight;
	var color = model.color;
	var ilen = lines.length;
	var x, y, i;

	if (!ilen || !color) {
		return;
	}

	x = rect.x;
	y = rect.y + lh/2;

	if (align === 'center') {
		x += rect.w/2;
	} else if (align === 'end') {
		x += rect.w;
	}

	ctx.font = model.font.string;
	ctx.fillStyle = color;
	ctx.textAlign = align;
	ctx.textBaseline = 'middle';

	for (i=0; i<ilen; ++i) {
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
	return horizontal?
		{x: pixel, y: null} :
		{x: null, y: pixel};
}

// @todo could be moved in Chart.helpers.options.evaluate
function evaluate(input, index, context, defaultValue) {
	if (input === undefined) {
		return defaultValue;
	}
	if (context !== undefined && typeof input === 'function') {
		input = input(index, context);
	}
	if (index !== undefined && Array.isArray(input)) {
		input = input[index];
	}
	return input === undefined? defaultValue : input;
}

function modelize(el, index, ctx, config, context) {
	if (!evaluate(config.display, index, context, true)) {
		return null;
	}

	var value = context.value;
	var label = helpers.valueOrDefault(helpers.callback(config.formatter, [value, context]), value);
	var lines = helpers.isNullOrUndef(label)? [] : toTextLines(label);
	if (!lines.length) {
		return null;
	}

	var font = parseFont(evaluate(config.font, index, context, {}));
	var lineHeight = evaluate(config.lineHeight, index, context, font.size);
	var model = {
		align: evaluate(config.align, index, context, 'center'),
		anchor: evaluate(config.anchor, index, context, 'center'),
		backgroundColor: evaluate(config.backgroundColor, index, context, null),
		borderColor: evaluate(config.borderColor, index, context, null),
		borderRadius: evaluate(config.borderRadius, index, context, 0),
		borderWidth: evaluate(config.borderWidth, index, context, 0),
		color: evaluate(config.color, index, context, Chart.defaults.global.defaultFontColor),
		font: font,
		lineHeight: lineHeight,
		lines: lines,
		offset: evaluate(config.offset, index, context, 0),
		padding: parsePadding(evaluate(config.padding, index, context, 0)),
		rotation: evaluate(config.rotation, index, context, 0) * (Math.PI/180),
		textAlign: evaluate(config.textAlign, index, context, 'start'),
		origin: getScaleOrigin(el),
		positioner: getPositioner(el),
		size: textSize(ctx, lines, font.string, lineHeight)
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
		var data = dataset.data;
		var ctx = chart.ctx;
		var i, el;

		ctx.save();

		for (i=0; i<ilen; ++i) {
			el = elements[i];
			el[MODEL_KEY] = display && el && !el.hidden?
				modelize(el, i, ctx, config, {
					datasetIndex: args.index,
					dataIndex: i,
					value: data[i]
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

		for (i=0; i<ilen; ++i) {
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
