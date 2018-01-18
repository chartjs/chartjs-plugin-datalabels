describe('options (scriptable)', function() {
	[
		'align',
		'anchor',
		'opacity'
	].forEach(function(key) {
		it(key + ' should be called with a valid context', function() {
			var options = {};
			options[key] = function() {};
			spyOn(options, key);

			var chart = jasmine.chart.acquire({
				type: 'line',
				data: {
					datasets: [{
						data: [42, 51]
					}, {
						data: [2]
					}]
				},
				options: {
					plugins: {
						datalabels: options
					}
				}
			});

			expect(options[key].calls.count()).toBe(3);

			[
				{dataIndex: 0, datasetIndex: 0},
				{dataIndex: 1, datasetIndex: 0},
				{dataIndex: 0, datasetIndex: 1}
			].forEach(function(e, i) {
				expect(options[key].calls.argsFor(i)[0]).toEqual({
					active: false,
					chart: chart,
					dataIndex: e.dataIndex,
					dataset: chart.data.datasets[e.datasetIndex],
					datasetIndex: e.datasetIndex
				});
			});
		});
	});
});

describe('option.align', function() {
	describe('auto', jasmine.fixture.specs('options.align'));
});

describe('option.anchor', function() {
	describe('auto', jasmine.fixture.specs('options.anchor'));
});

describe('option.opacity', function() {
	describe('auto', jasmine.fixture.specs('options.opacity'));
});
