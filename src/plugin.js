/**
 * @see https://github.com/chartjs/Chart.js/issues/4176
 */

'use strict';

import Chart from 'chart.js';
import Label from './label';
import utils from './utils';
import defaults from './defaults';

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
			label.draw(chart.ctx);
		}
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
				label = new Label(config, ctx, el, i);
				label.update(label.$context = {
					active: false,
					chart: chart,
					dataIndex: i,
					dataset: dataset,
					datasetIndex: args.index
				});
			} else {
				label = null;
			}

			el[EXPANDO_KEY] = label;
		}

		ctx.restore();
	},

	// Draw labels on top of all dataset elements
	// https://github.com/chartjs/chartjs-plugin-datalabels/issues/29
	// https://github.com/chartjs/chartjs-plugin-datalabels/issues/32
	afterDatasetsDraw: function(chart) {
		for (var i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
			drawLabels(chart, i);
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
				label.$context.active = (update[1] === 1);
				label.update(label.$context);
			}
		}

		if (updates.length && !chart.animating) {
			chart.render();
		}
	}
});
