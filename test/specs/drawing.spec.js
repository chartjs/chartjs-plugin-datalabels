describe('drawing', function() {
	describe('auto', jasmine.fixture.specs('drawing'));

	// https://github.com/chartjs/chartjs-plugin-datalabels/issues/30
	it('should not create labels for skipped element', function() {
		var chart = jasmine.chart.acquire({
			type: 'line',
			data: {
				datasets: [{
					data: [42, null, NaN, undefined, 'foobar']
				}]
			}
		});

		var ds0 = chart.getDatasetMeta(0);

		expect(ds0.data[0]._model.skip).toBeFalsy();
		expect(ds0.data[0].$datalabels).not.toBeNull();

		for (var i = 1; i <= 4; ++i) {
			expect(ds0.data[i]._model.skip).toBeTruthy();
			expect(ds0.data[i].$datalabels).toBeNull();
		}
	});
});
