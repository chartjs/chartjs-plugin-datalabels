/**
 * @see https://github.com/chartjs/Chart.js/issues/4176
 */

import {callback as callbackHelper, each, merge} from 'chart.js/helpers';

import Label from './label';
import utils from './utils';
import layout from './layout';
import defaults from './defaults';

var EXPANDO_KEY = '$datalabels';
var DEFAULT_KEY = '$default';

function configure(dataset, options) {
  var override = dataset.datalabels;
  var listeners = {};
  var configs = [];
  var labels, keys;

  if (override === false) {
    return null;
  }
  if (override === true) {
    override = {};
  }

  options = merge({}, [options, override]);
  labels = options.labels || {};
  keys = Object.keys(labels);
  delete options.labels;

  if (keys.length) {
    keys.forEach(function(key) {
      if (labels[key]) {
        configs.push(merge({}, [
          options,
          labels[key],
          {_key: key}
        ]));
      }
    });
  } else {
    // Default label if no "named" label defined.
    configs.push(options);
  }

  // listeners: {<event-type>: {<label-key>: <fn>}}
  listeners = configs.reduce(function(target, config) {
    each(config.listeners || {}, function(fn, event) {
      target[event] = target[event] || {};
      target[event][config._key || DEFAULT_KEY] = fn;
    });

    delete config.listeners;
    return target;
  }, {});

  return {
    labels: configs,
    listeners: listeners
  };
}

function dispatchEvent(chart, listeners, label, event) {
  if (!listeners) {
    return;
  }

  var context = label.$context;
  var groups = label.$groups;
  var callback;

  if (!listeners[groups._set]) {
    return;
  }

  callback = listeners[groups._set][groups._key];
  if (!callback) {
    return;
  }

  if (callbackHelper(callback, [context, event]) === true) {
    // Users are allowed to tweak the given context by injecting values that can be
    // used in scriptable options to display labels differently based on the current
    // event (e.g. highlight an hovered label). That's why we update the label with
    // the output context and schedule a new chart render by setting it dirty.
    chart[EXPANDO_KEY]._dirty = true;
    label.update(context);
  }
}

function dispatchMoveEvents(chart, listeners, previous, label, event) {
  var enter, leave;

  if (!previous && !label) {
    return;
  }

  if (!previous) {
    enter = true;
  } else if (!label) {
    leave = true;
  } else if (previous !== label) {
    leave = enter = true;
  }

  if (leave) {
    dispatchEvent(chart, listeners.leave, previous, event);
  }
  if (enter) {
    dispatchEvent(chart, listeners.enter, label, event);
  }
}

function handleMoveEvents(chart, event) {
  var expando = chart[EXPANDO_KEY];
  var listeners = expando._listeners;
  var previous, label;

  if (!listeners.enter && !listeners.leave) {
    return;
  }

  if (event.type === 'mousemove') {
    label = layout.lookup(expando._labels, event);
  } else if (event.type !== 'mouseout') {
    return;
  }

  previous = expando._hovered;
  expando._hovered = label;
  dispatchMoveEvents(chart, listeners, previous, label, event);
}

function handleClickEvents(chart, event) {
  var expando = chart[EXPANDO_KEY];
  var handlers = expando._listeners.click;
  var label = handlers && layout.lookup(expando._labels, event);
  if (label) {
    dispatchEvent(chart, handlers, label, event);
  }
}

export default {
  id: 'datalabels',

  defaults: defaults,

  beforeInit: function(chart) {
    chart[EXPANDO_KEY] = {
      _actives: []
    };
  },

  beforeUpdate: function(chart) {
    var expando = chart[EXPANDO_KEY];
    expando._listened = false;
    expando._listeners = {};     // {<event-type>: {<dataset-index>: {<label-key>: <fn>}}}
    expando._datasets = [];      // per dataset labels: [Label[]]
    expando._labels = [];        // layouted labels: Label[]
  },

  afterDatasetUpdate: function(chart, args, options) {
    var datasetIndex = args.index;
    var expando = chart[EXPANDO_KEY];
    var labels = expando._datasets[datasetIndex] = [];
    var visible = chart.isDatasetVisible(datasetIndex);
    var dataset = chart.data.datasets[datasetIndex];
    var config = configure(dataset, options);
    var elements = args.meta.data || [];
    var ctx = chart.ctx;
    var i, j, ilen, jlen, cfg, key, el, label;

    ctx.save();

    for (i = 0, ilen = elements.length; i < ilen; ++i) {
      el = elements[i];
      el[EXPANDO_KEY] = [];

      if (visible && el && chart.getDataVisibility(i) && !el.skip) {
        for (j = 0, jlen = config.labels.length; j < jlen; ++j) {
          cfg = config.labels[j];
          key = cfg._key;

          label = new Label(cfg, ctx, el, i);
          label.$groups = {
            _set: datasetIndex,
            _key: key || DEFAULT_KEY
          };
          label.$context = {
            active: false,
            chart: chart,
            dataIndex: i,
            dataset: dataset,
            datasetIndex: datasetIndex
          };

          label.update(label.$context);
          el[EXPANDO_KEY].push(label);
          labels.push(label);
        }
      }
    }

    ctx.restore();

    // Store listeners at the chart level and per event type to optimize
    // cases where no listeners are registered for a specific event.
    merge(expando._listeners, config.listeners, {
      merger: function(event, target, source) {
        target[event] = target[event] || {};
        target[event][args.index] = source[event];
        expando._listened = true;
      }
    });
  },

  afterUpdate: function(chart) {
    chart[EXPANDO_KEY]._labels = layout.prepare(chart[EXPANDO_KEY]._datasets);
  },

  // Draw labels on top of all dataset elements
  // https://github.com/chartjs/chartjs-plugin-datalabels/issues/29
  // https://github.com/chartjs/chartjs-plugin-datalabels/issues/32
  afterDatasetsDraw: function(chart) {
    layout.draw(chart, chart[EXPANDO_KEY]._labels);
  },

  beforeEvent: function(chart, args) {
    // If there is no listener registered for this chart, `listened` will be false,
    // meaning we can immediately ignore the incoming event and avoid useless extra
    // computation for users who don't implement label interactions.
    if (chart[EXPANDO_KEY]._listened) {
      var event = args.event;
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
    var actives = expando._actives = chart.getActiveElements();
    var updates = utils.arrayDiff(previous, actives);
    var i, ilen, j, jlen, update, label, labels;

    for (i = 0, ilen = updates.length; i < ilen; ++i) {
      update = updates[i];
      if (update[1]) {
        labels = update[0].element[EXPANDO_KEY] || [];
        for (j = 0, jlen = labels.length; j < jlen; ++j) {
          label = labels[j];
          label.$context.active = (update[1] === 1);
          label.update(label.$context);
        }
      }
    }

    if (expando._dirty || updates.length) {
      layout.update(expando._labels);
      chart.render();
    }

    delete expando._dirty;
  }
};
