'use strict';

import Chart from 'chart.js';
import HitBox from './hitbox';
import utils from './utils';
import positioners from './positioners';

var helpers = Chart.helpers;
var rasterize = utils.rasterize;

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
		rasterize(rect.x) - borderWidth / 2,
		rasterize(rect.y) - borderWidth / 2,
		rasterize(rect.w) + borderWidth,
		rasterize(rect.h) + borderWidth,
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
	ctx.shadowBlur = model.shadowBlur;
	ctx.shadowColor = model.shadowColor;
	ctx.fillStyle = color;
	ctx.textAlign = align;
	ctx.textBaseline = 'middle';

	for (i = 0; i < ilen; ++i) {
		ctx.fillText(
			lines[i],
			rasterize(x),
			rasterize(y),
			rasterize(rect.w));

		y += lh;
	}
}

var Label = function(config, ctx, el, index) {
	var me = this;

	me._hitbox = new HitBox();
	me._config = config;
	me._index = index;
	me._model = null;
	me._ctx = ctx;
	me._el = el;
};

helpers.extend(Label.prototype, {
	/**
	 * @private
	 */
	_modelize: function(lines, config, context) {
		var me = this;
		var index = me._index;
		var resolve = helpers.options.resolve;
		var font = utils.parseFont(resolve([config.font, {}], context, index));

		return {
			align: resolve([config.align, 'center'], context, index),
			anchor: resolve([config.anchor, 'center'], context, index),
			backgroundColor: resolve([config.backgroundColor, null], context, index),
			borderColor: resolve([config.borderColor, null], context, index),
			borderRadius: resolve([config.borderRadius, 0], context, index),
			borderWidth: resolve([config.borderWidth, 0], context, index),
			clip: resolve([config.clip, false], context, index),
			color: resolve([config.color, Chart.defaults.global.defaultFontColor], context, index),
			font: font,
			lines: lines,
			offset: resolve([config.offset, 0], context, index),
			opacity: resolve([config.opacity, 1], context, index),
			origin: getScaleOrigin(me._el),
			padding: helpers.options.toPadding(resolve([config.padding, 0], context, index)),
			positioner: getPositioner(me._el),
			rotation: resolve([config.rotation, 0], context, index) * (Math.PI / 180),
			shadowBlur: resolve([config.shadowBlur, 0], context, index),
			shadowColor: resolve([config.shadowColor, 'black'], context, index),
			size: utils.textSize(me._ctx, lines, font),
			textAlign: resolve([config.textAlign, 'start'], context, index)
		};
	},

	update: function(context) {
		var me = this;
		var model = null;
		var index = me._index;
		var config = me._config;
		var value, label, lines;

		if (helpers.options.resolve([config.display, true], context, index)) {
			value = context.dataset.data[index];
			label = helpers.valueOrDefault(helpers.callback(config.formatter, [value, context]), value);
			lines = helpers.isNullOrUndef(label) ? [] : utils.toTextLines(label);
			model = lines.length ? me._modelize(lines, config, context) : null;
		}

		me._model = model;
	},

	draw: function(chart) {
		var me = this;
		var ctx = chart.ctx;
		var model = me._model;
		var rects, center, area;

		if (!model || !model.opacity) {
			return;
		}

		rects = boundingRects(model.size, model.padding);
		center = coordinates(me._el, model, rects.frame);
		me._hitbox.update(center, rects.frame, model.rotation);

		ctx.save();

		if (model.clip) {
			area = chart.chartArea;
			ctx.beginPath();
			ctx.rect(
				area.left,
				area.top,
				area.right - area.left,
				area.bottom - area.top);
			ctx.clip();
		}

		ctx.globalAlpha = utils.bound(0, model.opacity, 1);
		ctx.translate(rasterize(center.x), rasterize(center.y));
		ctx.rotate(model.rotation);

		drawFrame(ctx, rects.frame, model);
		drawText(ctx, model.lines, rects.text, model);

		ctx.restore();
	},

	contains: function(x, y) {
		return this._hitbox.contains(x, y);
	}
});

export default Label;
