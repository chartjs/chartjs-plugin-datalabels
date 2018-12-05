/**
 * @see https://github.com/chartjs/Chart.js/issues/4176
 */

'use strict';

import Chart from 'chart.js';
import Label from './label';
import utils from './utils';
import layout from './layout';
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
		chart[EXPANDO_KEY]._dirty = true;
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
	var listeners = expando._listeners;
	var previous, target;

	if (!listeners.enter && !listeners.leave) {
		return;
	}

	if (event.type === 'mousemove') {
		target = layout.lookup(expando._labels, event);
	} else if (event.type !== 'mouseout') {
		return;
	}

	previous = expando._hovered;
	expando._hovered = target;
	dispatchMoveEvents(chart, listeners, previous, target);
}

function handleClickEvents(chart, event) {
	var expando = chart[EXPANDO_KEY];
	var handlers = expando._listeners.click;
	var target = handlers && layout.lookup(expando._labels, event);
	if (target) {
		dispatchEvent(chart, handlers, target);
	}
}

Chart.defaults.global.plugins.datalabels = defaults;

var plugin = {
	id: 'datalabels',

	beforeInit: function(chart) {
		chart[EXPANDO_KEY] = {
			_actives: []
		};
	},

	beforeUpdate: function(chart) {
		var expando = chart[EXPANDO_KEY];
		expando._listened = false;
		expando._listeners = {};     // {event-type: {dataset-index: function}}
		expando._datasets = [];      // per dataset labels: [[Label]]
		expando._labels = [];        // layouted labels: [Label]
	},

	afterDatasetUpdate: function(chart, args, options) {
		var datasetIndex = args.index;
		var expando = chart[EXPANDO_KEY];
		var labels = expando._datasets[datasetIndex] = [];
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
		helpers.merge(expando._listeners, config.listeners || {}, {
			merger: function(key, target, source) {
				target[key] = target[key] || {};
				target[key][args.index] = source[key];
				expando._listened = true;
			}
		});
	},

	afterUpdate: function(chart, options) {
		chart[EXPANDO_KEY]._labels = layout.prepare(
			chart[EXPANDO_KEY]._datasets,
			options);
	},

	// Draw labels on top of all dataset elements
	// https://github.com/chartjs/chartjs-plugin-datalabels/issues/29
	// https://github.com/chartjs/chartjs-plugin-datalabels/issues/32
	afterDatasetsDraw: function(chart) {
		layout.draw(chart, chart[EXPANDO_KEY]._labels);
	},

	beforeEvent: function(chart, event) {
		// If there is no listener registered for this chart, `listened` will be false,
		// meaning we can immediately ignore the incoming event and avoid useless extra
		// computation for users who don't implement label interactions.
		if (chart[EXPANDO_KEY]._listened) {
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
		var previous = expando._actives;
		var actives = expando._actives = chart.lastActive || [];  // public API?!
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

		if (expando._dirty || updates.length) {
			layout.update(expando._labels);
			if (!chart.animating) {
				chart.render();
			}
		}

		delete expando._dirty;
	}
};

// TODO Remove at version 1, we shouldn't automatically register plugins.
// https://github.com/chartjs/chartjs-plugin-datalabels/issues/42
Chart.plugins.register(plugin);

export default plugin;
