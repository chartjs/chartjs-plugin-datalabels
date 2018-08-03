/*!
 * @license
 * chartjs-plugin-datalabels
 * http://chartjs.org/
 * Version: 0.4.0
 *
 * Copyright 2018 Chart.js Contributors
 * Released under the MIT license
 * https://github.com/chartjs/chartjs-plugin-datalabels/blob/master/LICENSE.md
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js')) :
	typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
	(factory(global.Chart));
}(this, (function (Chart) { 'use strict';

Chart = Chart && Chart.hasOwnProperty('default') ? Chart['default'] : Chart;

'use strict';

var helpers$2 = Chart.helpers;

var HitBox = function() {
	this._rect = null;
	this._rotation = 0;
};

helpers$2.extend(HitBox.prototype, {
	update: function(center, rect, rotation) {
		var margin = 1;
		var cx = center.x;
		var cy = center.y;
		var x = cx + rect.x;
		var y = cy + rect.y;

		this._rotation = rotation;
		this._rect = {
			x0: x - margin,
			y0: y - margin,
			x1: x + rect.w + margin * 2,
			y1: y + rect.h + margin * 2,
			cx: cx,
			cy: cy,
		};
	},

	contains: function(x, y) {
		var me = this;
		var rect = me._rect;
		var cx, cy, r, rx, ry;

		if (!rect) {
			return false;
		}

		cx = rect.cx;
		cy = rect.cy;
		r = me._rotation;
		rx = cx + (x - cx) * Math.cos(r) + (y - cy) * Math.sin(r);
		ry = cy - (x - cx) * Math.sin(r) + (y - cy) * Math.cos(r);

		return !(rx < rect.x0
			|| ry < rect.y0
			|| rx > rect.x1
			|| ry > rect.y1);
	}
});

'use strict';

var helpers$3 = Chart.helpers;

var devicePixelRatio = typeof window !== 'undefined'
	? window.devicePixelRatio
	: 1;

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
			} else if (!helpers$3.isNullOrUndef(inputs)) {
				lines.unshift('' + input);
			}
		}

		return lines;
	},

	// @todo move this method in Chart.helpers.canvas.toFont (deprecates helpers.fontString)
	// @see https://developer.mozilla.org/en-US/docs/Web/CSS/font
	toFontString: function(font) {
		if (!font || helpers$3.isNullOrUndef(font.size) || helpers$3.isNullOrUndef(font.family)) {
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
		var size = helpers$3.valueOrDefault(value.size, global.defaultFontSize);
		var font = {
			family: helpers$3.valueOrDefault(value.family, global.defaultFontFamily),
			lineHeight: helpers$3.options.toLineHeight(value.lineHeight, size),
			size: size,
			style: helpers$3.valueOrDefault(value.style, global.defaultFontStyle),
			weight: helpers$3.valueOrDefault(value.weight, null),
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
	 * https://github.com/chartjs/chartjs-plugin-datalabels/issues/70
	 */
	rasterize: function(v) {
		return Math.round(v * devicePixelRatio) / devicePixelRatio;
	}
};

'use strict';

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

function aligned(x, y, vx, vy, align) {
	switch (align) {
	case 'center':
		vx = vy = 0;
		break;
	case 'bottom':
		vx = 0;
		vy = 1;
		break;
	case 'right':
		vx = 1;
		vy = 0;
		break;
	case 'left':
		vx = -1;
		vy = 0;
		break;
	case 'top':
		vx = 0;
		vy = -1;
		break;
	case 'start':
		vx = -vx;
		vy = -vy;
		break;
	case 'end':
		// keep the natural orientation
		break;
	default:
		// clockwise rotation (in degree)
		align *= (Math.PI / 180);
		vx = Math.cos(align);
		vy = Math.sin(align);
		break;
	}

	return {
		x: x,
		y: y,
		vx: vx,
		vy: vy
	};
}

var positioners = {
	arc: function(vm, anchor, align) {
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

		return aligned(
			vm.x + vx * d,
			vm.y + vy * d,
			vx,
			vy,
			align);
	},

	point: function(vm, anchor, align, origin) {
		var v = orient(vm, origin);
		var r = vm.radius;
		var d = 0;

		if (anchor === 'start') {
			d = -r;
		} else if (anchor === 'end') {
			d = r;
		}

		return aligned(
			vm.x + v.x * d,
			vm.y + v.y * d,
			v.x,
			v.y,
			align);
	},

	rect: function(vm, anchor, align, origin) {
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

		return aligned(
			x,
			y,
			v.x,
			v.y,
			align);
	},

	fallback: function(vm, anchor, align, origin) {
		var v = orient(vm, origin);
		return aligned(
			vm.x,
			vm.y,
			v.x,
			v.y,
			align);
	}
};

'use strict';

var helpers$1 = Chart.helpers;
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

	helpers$1.canvas.roundedRect(
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

helpers$1.extend(Label.prototype, {
	/**
	 * @private
	 */
	_modelize: function(lines, config, context) {
		var me = this;
		var index = me._index;
		var resolve = helpers$1.options.resolve;
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
			padding: helpers$1.options.toPadding(resolve([config.padding, 0], context, index)),
			positioner: getPositioner(me._el),
			rotation: resolve([config.rotation, 0], context, index) * (Math.PI / 180),
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

		if (helpers$1.options.resolve([config.display, true], context, index)) {
			value = context.dataset.data[index];
			label = helpers$1.valueOrDefault(helpers$1.callback(config.formatter, [value, context]), value);
			lines = helpers$1.isNullOrUndef(label) ? [] : utils.toTextLines(label);
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

/**
 * @module Options
 */

'use strict';

var helpers$4 = Chart.helpers;

var defaults = {
	/**
	 * The label box alignment relative to `anchor` that can be expressed either by a number
	 * representing the clockwise angle (in degree) or by one of the following string presets:
	 * - 'start': before the anchor point, following the same direction
	 * - 'end': after the anchor point, following the same direction
	 * - 'center': centered on the anchor point
	 * - 'right': 0°
	 * - 'bottom': 90°
	 * - 'left': 180°
	 * - 'top': 270°
	 * @member {String|Number|Array|Function}
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
	 * Clip the label drawing to the chart area.
	 * @member {Boolean|Array|Function}
	 * @default false (no clipping)
	 */
	clip: false,

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
	 * @prop {String} font.family - defaults to Chart.defaults.global.defaultFontFamily
	 * @prop {Number} font.lineHeight - defaults to 1.2
	 * @prop {Number} font.size - defaults to Chart.defaults.global.defaultFontSize
	 * @prop {String} font.style - defaults to Chart.defaults.global.defaultFontStyle
	 * @prop {Number} font.weight - defaults to 'normal'
	 * @default Chart.defaults.global.defaultFont.*
	 */
	font: {
		family: undefined,
		lineHeight: 1.2,
		size: undefined,
		style: undefined,
		weight: null
	},

	/**
	 * The distance (in pixels) to pull the label away from the anchor point, the direction
	 * being determined by the `align` value (only applicable if `align` is `start` or `end`).
	 * @member {Number|Array|Function}
	 * @default 4
	 */
	offset: 4,

	/**
	 * The label global opacity, including the text, background, borders, etc., specified as
	 * a number between 0.0 (fully transparent) and 1.0 (fully opaque).
	 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalAlpha
	 * @member {Number|Array|Function}
	 * @default 1
	 */
	opacity: 1,

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
	 * Clockwise rotation of the label relative to its center.
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
		if (helpers$4.isNullOrUndef(value)) {
			return null;
		}

		var label = value;
		var keys, klen, k;
		if (helpers$4.isObject(value)) {
			if (!helpers$4.isNullOrUndef(value.label)) {
				label = value.label;
			} else if (!helpers$4.isNullOrUndef(value.r)) {
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
	},

	/**
	 * Event listeners, where the property is the type of the event to listen and the value
	 * a callback with a unique `context` argument containing the same information as for
	 * scriptable options. If a callback explicitly returns `true`, the label is updated
	 * with the current context and the chart re-rendered. This allows to implement visual
	 * interactions with labels such as highlight, selection, etc.
	 *
	 * Event currently supported are:
	 * - 'click': a mouse click is detected within a label
	 * - 'enter': the mouse enters a label
	 * -' leave': the mouse leaves a label
	 *
	 * @member {Object}
	 * @default {}
	 */
	listeners: {}
};

/**
 * @see https://github.com/chartjs/Chart.js/issues/4176
 */

'use strict';

var helpers = Chart.helpers;
var EXPANDO_KEY = '$datalabels';

Chart.defaults.global.plugins.datalabels = defaults;

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

function drawLabels(chart, datasetIndex) {
	var meta = chart.getDatasetMeta(datasetIndex);
	var elements = meta.data || [];
	var ilen = elements.length;
	var i, el, label;

	for (i = 0; i < ilen; ++i) {
		el = elements[i];
		label = el[EXPANDO_KEY];
		if (label) {
			label.draw(chart);
		}
	}
}

function labelAtXY(chart, x, y) {
	var items = chart[EXPANDO_KEY].labels;
	var i, j, labels, label;

	// Until we support z-index, let's hit test in the drawing reverse order
	for (i = items.length - 1; i >= 0; --i) {
		labels = items[i] || [];
		for (j = labels.length - 1; j >= 0; --j) {
			label = labels[j];
			if (label.contains(x, y)) {
				return {dataset: i, label: label};
			}
		}
	}

	return null;
}

function dispatchEvent(chart, listeners, target) {
	var callback = listeners && listeners[target.dataset];
	if (!callback) {
		return;
	}

	var label = target.label;
	var context = label.$context;

	if (helpers.callback(callback, [context]) === true) {
		// Users are allowed to tweak the given context by injecting values that can be
		// used in scriptable options to display labels differently based on the current
		// event (e.g. highlight an hovered label). That's why we update the label with
		// the output context and schedule a new chart render by setting it dirty.
		chart[EXPANDO_KEY].dirty = true;
		label.update(context);
	}
}

function dispatchMoveEvents(chart, listeners, previous, target) {
	var enter, leave;

	if (!previous && !target) {
		return;
	}

	if (!previous) {
		enter = true;
	} else if (!target) {
		leave = true;
	} else if (previous.label !== target.label) {
		leave = enter = true;
	}

	if (leave) {
		dispatchEvent(chart, listeners.leave, previous);
	}
	if (enter) {
		dispatchEvent(chart, listeners.enter, target);
	}
}

function handleMoveEvents(chart, event) {
	var expando = chart[EXPANDO_KEY];
	var listeners = expando.listeners;
	var previous, target;

	if (!listeners.enter && !listeners.leave) {
		return;
	}

	if (event.type === 'mousemove') {
		target = labelAtXY(chart, event.x, event.y);
	} else if (event.type !== 'mouseout') {
		return;
	}

	previous = expando.hovered;
	expando.hovered = target;
	dispatchMoveEvents(chart, listeners, previous, target);
}

function handleClickEvents(chart, event) {
	var handlers = chart[EXPANDO_KEY].listeners.click;
	var target = handlers && labelAtXY(chart, event.x, event.y);
	if (target) {
		dispatchEvent(chart, handlers, target);
	}
}

Chart.defaults.global.plugins.datalabels = defaults;

Chart.plugins.register({
	id: 'datalabels',

	beforeInit: function(chart) {
		chart[EXPANDO_KEY] = {
			actives: []
		};
	},

	beforeUpdate: function(chart) {
		var expando = chart[EXPANDO_KEY];
		expando.listened = false;
		expando.listeners = {};    // {event-type: {dataset-index: function}}
		expando.labels = [];       // [dataset-index: [labels]]
	},

	afterDatasetUpdate: function(chart, args, options) {
		var datasetIndex = args.index;
		var expando = chart[EXPANDO_KEY];
		var labels = expando.labels[datasetIndex] = [];
		var visible = chart.isDatasetVisible(datasetIndex);
		var dataset = chart.data.datasets[datasetIndex];
		var config = configure(dataset, options);
		var elements = args.meta.data || [];
		var ilen = elements.length;
		var ctx = chart.ctx;
		var i, el, label;

		ctx.save();

		for (i = 0; i < ilen; ++i) {
			el = elements[i];

			if (visible && el && !el.hidden && !el._model.skip) {
				labels.push(label = new Label(config, ctx, el, i));
				label.update(label.$context = {
					active: false,
					chart: chart,
					dataIndex: i,
					dataset: dataset,
					datasetIndex: datasetIndex
				});
			} else {
				label = null;
			}

			el[EXPANDO_KEY] = label;
		}

		ctx.restore();

		// Store listeners at the chart level and per event type to optimize
		// cases where no listeners are registered for a specific event
		helpers.merge(expando.listeners, config.listeners || {}, {
			merger: function(key, target, source) {
				target[key] = target[key] || {};
				target[key][args.index] = source[key];
				expando.listened = true;
			}
		});
	},

	// Draw labels on top of all dataset elements
	// https://github.com/chartjs/chartjs-plugin-datalabels/issues/29
	// https://github.com/chartjs/chartjs-plugin-datalabels/issues/32
	afterDatasetsDraw: function(chart) {
		for (var i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
			drawLabels(chart, i);
		}
	},

	beforeEvent: function(chart, event) {
		// If there is no listener registered for this chart, `listened` will be false,
		// meaning we can immediately ignore the incoming event and avoid useless extra
		// computation for users who don't implement label interactions.
		if (chart[EXPANDO_KEY].listened) {
			switch (event.type) {
			case 'mousemove':
			case 'mouseout':
				handleMoveEvents(chart, event);
				break;
			case 'click':
				handleClickEvents(chart, event);
				break;
			default:
			}
		}
	},

	afterEvent: function(chart) {
		var expando = chart[EXPANDO_KEY];
		var previous = expando.actives;
		var actives = expando.actives = chart.lastActive || [];  // public API?!
		var updates = utils.arrayDiff(previous, actives);
		var i, ilen, update, label;

		for (i = 0, ilen = updates.length; i < ilen; ++i) {
			update = updates[i];
			if (update[1]) {
				label = update[0][EXPANDO_KEY];
				if (label) {
					label.$context.active = (update[1] === 1);
					label.update(label.$context);
				}
			}
		}

		if ((expando.dirty || updates.length) && !chart.animating) {
			chart.render();
		}

		delete expando.dirty;
	}
});

})));
