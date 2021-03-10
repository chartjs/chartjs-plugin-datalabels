import {color as Color} from 'chart.js/helpers';

function fallback(/* values ... */) {
  var ilen = arguments.length;
  var i = 0;
  var v;

  for (; i < ilen; ++i) {
    v = arguments[i];
    if (v !== undefined) {
      return v;
    }
  }
}

export var COLORS = [
  '#FF3784',
  '#36A2EB',
  '#4BC0C0',
  '#F77825',
  '#9966FF',
  '#00A8C6',
  '#379F7A',
  '#CC2738',
  '#8B628A',
  '#8FBE00',
  '#606060',
];

// Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
var _seed = Date.now();

export function srand(seed) {
  _seed = seed;
}

export function rand(min, max) {
  min = min === undefined ? 0 : min;
  max = max === undefined ? 1 : max;
  _seed = (_seed * 9301 + 49297) % 233280;
  return min + (_seed / 233280) * (max - min);
}

export function numbers(config) {
  var cfg = config || {};
  var min = fallback(cfg.min, 0);
  var max = fallback(cfg.max, 1);
  var from = fallback(cfg.from, []);
  var count = fallback(cfg.count, 8);
  var decimals = fallback(cfg.decimals, 8);
  var continuity = fallback(cfg.continuity, 1);
  var dfactor = Math.pow(10, decimals) || 0;
  var data = [];
  var i, value;

  for (i = 0; i < count; ++i) {
    value = (from[i] || 0) + this.rand(min, max);
    if (this.rand() <= continuity) {
      data.push(Math.round(dfactor * value) / dfactor);
    } else {
      data.push(null);
    }
  }

  return data;
}

export function color(offset) {
  var count = COLORS.length;
  var index = offset === undefined ? ~~rand(0, count) : offset;
  return COLORS[index % count];
}

export function colors(config) {
  var cfg = config || {};
  var c = cfg.color || color(0);
  var count = cfg.count !== undefined ? cfg.count : 8;
  var method = cfg.mode ? Color(color)[cfg.mode] : null;
  var values = [];
  var i, f, v;

  for (i = 0; i < count; ++i) {
    f = i / count;

    if (method) {
      v = method.call(Color(c), f).rgbString();
    } else {
      v = color(i);
    }

    values.push(v);
  }

  return values;
}

export function transparentize(c, opacity) {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return Color(c).alpha(alpha).rgbString();
}
