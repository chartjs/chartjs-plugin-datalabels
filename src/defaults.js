/**
 * @module Options
 */

'use strict';

import Chart from 'chart.js';

var helpers = Chart.helpers;

export default {
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
		if (helpers.isNullOrUndef(value)) {
			return null;
		}

		var label = value;
		var keys, klen, k;
		if (helpers.isObject(value)) {
			if (!helpers.isNullOrUndef(value.label)) {
				label = value.label;
			} else if (!helpers.isNullOrUndef(value.r)) {
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
