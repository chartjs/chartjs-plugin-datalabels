'use strict';

import Chart from 'chart.js';
import fixture from './fixture';
import matchers from './matchers';
import utils from './utils';

var charts = {};

// force ratio=1 for tests on high-res/retina devices
window.devicePixelRatio = 1;

jasmine.chart = {
	acquire: function() {
		var chart = utils.acquireChart.apply(utils, arguments);
		charts[chart.id] = chart;
		return chart;
	},
	release: function(chart) {
		utils.releaseChart.apply(utils, arguments);
		delete charts[chart.id];
	}
};

jasmine.fixture = fixture;
jasmine.triggerMouseEvent = utils.triggerMouseEvent;

beforeEach(function() {
	jasmine.addMatchers(matchers);

	Chart.defaults.set({
		animation: false,
		responsive: false,
		elements: {
			arc: {
				backgroundColor: 'transparent',
				borderColor: 'rgba(0, 0, 0, 0.1)',
				borderWidth: 1
			},
			point: {
				backgroundColor: 'transparent',
				borderColor: 'rgba(0, 0, 0, 0.1)',
				borderWidth: 1
			},
			rectangle: {
				backgroundColor: 'transparent',
				borderColor: 'rgba(0, 0, 0, 0.1)',
				borderWidth: 1
			}
		},
		plugins: {
			legend: {
				display: false
			},
			title: {
				display: false
			},
			tooltip: {
				display: false
			}
		}
	});

	Chart.defaults.set('scale', {
		display: false,
		ticks: {
			beginAtZero: true
		}
	});
});

afterEach(function() {
	// Auto releasing acquired charts
	Object.keys(charts).forEach(function(id) {
		var chart = charts[id];
		if (!(chart.$test || {}).persistent) {
			jasmine.chart.release(chart);
		}
	});
});
