/**
 * @module Options
 */

'use strict';

import utils from './utils';

function fontAdjuster(model, fontSize, relevanceTo) {
	if (relevanceTo > 100 && (fontSize / relevanceTo) * 100 >= 40) {
		model.font.size = 0.4 * relevanceTo;
	} else if (relevanceTo < 100 && (fontSize / relevanceTo) * 100 >= 60) {
		model.font.size = 0.6 * relevanceTo;
	}
	model.font.string = utils.toFontString(model.font);
	return model;
}

function barChartLableAdjuster(el, chart, model) {
	var fontSize = model.font.size;
	var barWidth = el._view.width;
	var maxHeigth = chart.scales['y-axis-0'].maxHeight;
	var y = el._view.y;
	if (y < maxHeigth * 0.1) {
		model.align = 'bottom';
	}
	model = fontAdjuster(model, fontSize, barWidth);
	return model;
}

function horizontalBarChartLableAdjuster(el, chart, model) {
	var fontSize = model.font.size;
	var barHeight = el._view.height;
	var maxWidth = chart.scales['x-axis-0'].maxWidth;
	var x = el._view.x;
	if (x > maxWidth - (maxWidth * 0.1)) {
		model.align = 'left';
	}
	model = fontAdjuster(model, fontSize, barHeight);
	return model;
}

var autoAjuster = function(el, model) {
	if (model.autoAdjust === true) {
		var chart = el._chart;
		var config = chart.controller.config;
		switch (config.type) {
		case 'bar':
			return barChartLableAdjuster(el, chart, model);
		case 'horizontalBar':
			return horizontalBarChartLableAdjuster(el, chart, model);
		default:
			return model;
		}
	}
	return model;
};

export default autoAjuster;
