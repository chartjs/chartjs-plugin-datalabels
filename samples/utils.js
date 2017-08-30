'use strict';

(function(global) {
	var Samples = global.Samples || (global.Samples = {});
	var Color = global.Color;

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

	Samples.COLORS = [
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
		'#606060'
	];

	// Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
	Samples.srand = function(seed) {
		this._seed = seed;
	};

	Samples.rand = function(min, max) {
		var seed = this._seed;
		min = min === undefined ? 0 : min;
		max = max === undefined ? 1 : max;
		this._seed = (seed * 9301 + 49297) % 233280;
		return min + (this._seed / 233280) * (max - min);
	};

	Samples.numbers = function(config) {
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
	};

	Samples.color = function(offset) {
		var count = Samples.COLORS.length;
		var index = offset === undefined ? ~~Samples.rand(0, count) : offset;
		return Samples.COLORS[index % count];
	};

	Samples.colors = function(config) {
		var cfg = config || {};
		var color = cfg.color || Samples.color(0);
		var count = cfg.count !== undefined ? cfg.count : 8;
		var method = cfg.mode ? Color.prototype[cfg.mode] : null;
		var values = [];
		var i, f, v;

		for (i = 0; i < count; ++i) {
			f = i / count;

			if (method) {
				v = method.call(Color(color), f).rgbString();
			} else {
				v = Samples.color(i);
			}

			values.push(v);
		}

		return values;
	};

	Samples.transparentize = function(color, opacity) {
		var alpha = opacity === undefined ? 0.5 : 1 - opacity;
		return Color(color).alpha(alpha).rgbString();
	};

	// INITIALIZATION

	Samples.srand(Date.now());

	var root = (function() {
		var scripts = document.getElementsByTagName('script');
		var script = scripts[scripts.length - 1];
		var path = script.src;
		return path.substr(0, path.lastIndexOf('/') + 1);
	}());

	window.addEventListener('DOMContentLoaded', function load() {
		window.removeEventListener('DOMContentLoaded', load, true);
		var header = document.getElementById('header');
		var info = global.SAMPLE_INFO;

		if (header && info) {
			var group = info.group;
			var name = info.name;
			var desc = info.desc;

			document.title = name + (group ? ' / ' + group : '') + ' / chartjs-plugin-datalabels';
			header.innerHTML =
				'<div class="scope">' +
					'<a href="' + root + 'index.html">&laquo; chartjs-plugin-datalabels</a>' +
				'</div>' +
				'<div class="title">' +
					'<span class="group">' + group + ' / </span>' +
					'<span class="name">' + name + '</span>' +
					(desc ? '<div class="desc">' + desc + '</div>' : '') +
				'</div>';
		}
	}, true);

	// Google Analytics
	/* eslint-disable */
	if (['localhost', '127.0.0.1'].indexOf(document.location.hostname) === -1) {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-99068522-2', 'auto');
		ga('send', 'pageview');
	}
	/* eslint-enable */

}(this));
