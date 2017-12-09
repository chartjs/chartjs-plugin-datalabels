/**
 * @see https://github.com/chartjs/Chart.js/issues/4176
 */

'use strict';

import Chart from 'chart.js';
import defaults from './defaults.js';
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

function coordinates(el, model, rect) {
	var point = model.positioner(el._view, model.anchor, model.align, model.origin);
	var vx = point.vx;
	var vy = point.vy;

	if (!vx && !vy) {
		// if aligned center, we don't want to offset the center point
		return {x: point.x, y: point.y};
	}


	// include borders to the bounding rect
	var borderWidth = model.borderWidth || 0;
	var w = (rect.w + borderWidth * 2);
	var h = (rect.h + borderWidth * 2);

	// take in account the label rotation
	var rotation = model.rotation;
	var dx = Math.abs(w / 2 * Math.cos(rotation)) + Math.abs(h / 2 * Math.sin(rotation));
	var dy = Math.abs(w / 2 * Math.sin(rotation)) + Math.abs(h / 2 * Math.cos(rotation));

	// scale the unit vector (vx, vy) to get at least dx or dy equal to w or h respectively
	// (else we would calculate the distance to the ellipse inscribed in the bounding rect)
	var vs = 1 / Math.max(Math.abs(vx), Math.abs(vy));
	dx *= vx * vs;
	dy *= vy * vs;

	// finally, include the explicit offset
	dx += model.offset * vx;
	dy += model.offset * vy;

	return {
		x: point.x + dx,
		y: point.y + dy
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

			rects = boundingRects(model.size, model.padding);
			center = coordinates(el, model, rects.frame);

			ctx.save();
			ctx.translate(Math.round(center.x), Math.round(center.y));
			ctx.rotate(model.rotation);

			drawFrame(ctx, rects.frame, model);
			drawText(ctx, model.lines, rects.text, model);

			ctx.restore();
		}
	}
});
