'use strict';

import Chart from 'chart.js';
import pixelmatch from 'pixelmatch';
import utils from './utils';

function toPercent(value) {
	return Math.round(value * 10000) / 100;
}

function buildPixelMatchPreview(actual, expected, diff, threshold, tolerance, count) {
	var ratio = count / (actual.width * actual.height);
	var wrapper = document.createElement('div');

	wrapper.style.cssText = 'display: flex; overflow-y: auto';

	[
		{data: actual, label: 'Actual'},
		{data: expected, label: 'Expected'},
		{data: diff, label:
			'diff: ' + count + 'px ' +
			'(' + toPercent(ratio) + '%)<br/>' +
			'thr: ' + toPercent(threshold) + '%, ' +
			'tol: ' + toPercent(tolerance) + '%'
		}
	].forEach(function(values) {
		var item = document.createElement('div');
		item.style.cssText = 'text-align: center; font: 12px monospace; line-height: 1.4; margin: 8px';
		item.innerHTML = '<div style="margin: 8px; height: 32px">' + values.label + '</div>';
		item.appendChild(utils.canvasFromImageData(values.data));
		wrapper.appendChild(item);
	});

	// WORKAROUND: https://github.com/karma-runner/karma-jasmine/issues/139
	wrapper.indexOf = function() {
		return -1;
	};

	return wrapper;
}

function toEqualImageData() {
	return {
		compare: function(actual, expected, opts) {
			var message = null;
			var debug = opts.debug || false;
			var tolerance = opts.tolerance === undefined ? 0.001 : opts.tolerance;
			var threshold = opts.threshold === undefined ? 0.1 : opts.threshold;
			var ctx, idata, ddata, w, h, count, ratio;

			if (actual instanceof Chart) {
				ctx = actual.ctx;
			} else if (actual instanceof HTMLCanvasElement) {
				ctx = actual.getContext('2d');
			} else if (actual instanceof CanvasRenderingContext2D) {
				ctx = actual;
			}

			if (ctx) {
				h = expected.height;
				w = expected.width;
				idata = ctx.getImageData(0, 0, w, h);
				ddata = utils.createImageData(w, h);
				count = pixelmatch(idata.data, expected.data, ddata.data, w, h, {threshold: threshold});
				ratio = count / (w * h);

				if ((ratio > tolerance) || debug) {
					message = buildPixelMatchPreview(idata, expected, ddata, threshold, tolerance, count);
				}
			} else {
				message = 'Input value is not a valid image source.';
			}

			return {
				message: message,
				pass: !message
			};
		}
	};
}

export default {
	toEqualImageData: toEqualImageData
};
