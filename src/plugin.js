/**
 * @see https://github.com/chartjs/Chart.js/issues/4176
 */

'use strict';

import Chart from 'chart.js';
import Label from './label';
import defaults from './defaults';

var helpers = Chart.helpers;
var MODEL_KEY = '$datalabels';

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

Chart.defaults.global.plugins.datalabels = defaults;

Chart.plugins.register({
	id: 'datalabels',

	afterDatasetUpdate: function(chart, args, options) {
		var dataset = chart.data.datasets[args.index];
		var config = configure(dataset, options);
		var elements = args.meta.data || [];
		var ilen = elements.length;
		var ctx = chart.ctx;
		var i, el, label;

		ctx.save();

		for (i = 0; i < ilen; ++i) {
			el = elements[i];

			if (el && !el.hidden) {
				label = new Label(el, i);
				label.update(ctx, config, {
					chart: chart,
					dataIndex: i,
					dataset: dataset,
					datasetIndex: args.index
				});
			} else {
				label = null;
			}

			el[MODEL_KEY] = label;
		}

		ctx.restore();
	},

	afterDatasetDraw: function(chart, args) {
		var elements = args.meta.data || [];
		var ilen = elements.length;
		var i, el, label;

		for (i = 0; i < ilen; ++i) {
			el = elements[i];
			label = el[MODEL_KEY];
			if (label) {
				label.draw(chart.ctx);
			}
		}
	}
});
