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
