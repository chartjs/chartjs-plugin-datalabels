import Chart from 'chart.js';

describe('module', function() {
	it ('should be globally exported in ChartDataLabels', function() {
		expect(typeof window.ChartDataLabels).toBe('object');
	});

	it ('should be referenced with id "datalabels"', function() {
		expect(window.ChartDataLabels.id).toBe('datalabels');
	});

	// TODO Change this expectation at version 1: 'should NOT be registered'
	// https://github.com/chartjs/chartjs-plugin-datalabels/issues/42
	it ('should be globally registered', function() {
		var plugin = Chart.registry.getPlugin('datalabels');
		expect(plugin).not.toBeNull();
		expect(plugin).toBe(window.ChartDataLabels);
	});
});
