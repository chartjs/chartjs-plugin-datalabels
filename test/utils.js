'use strict';

import Chart from 'chart.js';

function createCanvas(w, h) {
	var canvas = document.createElement('CANVAS');
	canvas.width = w;
	canvas.height = h;
	return canvas;
}

function createImageData(w, h) {
	var canvas = createCanvas(w, h);
	var context = canvas.getContext('2d');
	return context.getImageData(0, 0, w, h);
}

function readImageData(url, callback) {
	var image = new Image();

	image.onload = function() {
		var h = image.height;
		var w = image.width;
		var canvas = createCanvas(w, h);
		var ctx = canvas.getContext('2d');
		ctx.drawImage(image, 0, 0, w, h);
		callback(ctx.getImageData(0, 0, w, h));
	};

	image.src = url;
}

function canvasFromImageData(data) {
	var canvas = createCanvas(data.width, data.height);
	var context = canvas.getContext('2d');
	context.putImageData(data, 0, 0);
	return canvas;
}

function acquireChart(config, options) {
	var wrapper = document.createElement('DIV');
	var canvas = document.createElement('CANVAS');
	var chart, key;

	// By default, remove chart animation and auto resize.
	config = Chart.helpers.merge({
		options: {
			animation: false,
			responsive: false,
			defaultFontFamily: 'Arial'
		}
	}, config || {});

	options = Chart.helpers.merge({
		canvas: {
			height: 512,
			width: 512
		},
		wrapper: {
			class: 'chartjs-wrapper'
		}
	}, options || {});

	for (key in options.canvas) {
		if (Object.prototype.hasOwnProperty.call(options.canvas, key)) {
			canvas.setAttribute(key, options.canvas[key]);
		}
	}

	for (key in options.wrapper) {
		if (Object.prototype.hasOwnProperty.call(options.wrapper, key)) {
			wrapper.setAttribute(key, options.wrapper[key]);
		}
	}

	wrapper.appendChild(canvas);
	window.document.body.appendChild(wrapper);

	try {
		chart = new Chart(canvas.getContext('2d'), config);
	} catch (e) {
		window.document.body.removeChild(wrapper);
		throw e;
	}

	chart.$test = {
		persistent: options.persistent,
		wrapper: wrapper
	};

	return chart;
}

function releaseChart(chart) {
	chart.destroy();

	var wrapper = (chart.$test || {}).wrapper;
	if (wrapper && wrapper.parentNode) {
		wrapper.parentNode.removeChild(wrapper);
	}
}

function triggerMouseEvent(chart, type, el) {
	var node = chart.canvas;
	var rect = node.getBoundingClientRect();
	var x = el ? el.x !== undefined ? el.x : el._model.x : null;
	var y = el ? el.y !== undefined ? el.y : el._model.y : null;

	var event = new MouseEvent(type, {
		clientX: el ? rect.left + x : undefined,
		clientY: el ? rect.top + y : undefined,
		cancelable: true,
		bubbles: true,
		view: window
	});

	node.dispatchEvent(event);
}

export default {
	acquireChart: acquireChart,
	releaseChart: releaseChart,
	createCanvas: createCanvas,
	createImageData: createImageData,
	canvasFromImageData: canvasFromImageData,
	readImageData: readImageData,
	triggerMouseEvent: triggerMouseEvent
};
