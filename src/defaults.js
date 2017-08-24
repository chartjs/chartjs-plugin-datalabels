/**
 * @module Options
 */

'use strict';

import Chart from 'chart.js';

var helpers = Chart.helpers;

export default {
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
	}
};
