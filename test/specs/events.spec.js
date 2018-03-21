import Chart from 'chart.js';

describe('events', function() {
	beforeEach(function() {
		this.data = {
			labels: [1, 2, 3],
			datasets: [{
				data: [1, 2, 3]
			}, {
				data: [4, 5, 6]
			}]
		};
	});

	describe('`enter` handlers', function() {
		it('should be called when the mouse moves inside the label', function() {
			var spy = jasmine.createSpy('spy');
			var chart = jasmine.chart.acquire({
				type: 'line',
				data: this.data,
				options: {
					plugins: {
						datalabels: {
							listeners: {
								enter: spy
							}
						}
					}
				}
			});

			var ds0 = chart.getDatasetMeta(0);

			expect(spy.calls.count()).toBe(0);

			jasmine.triggerMouseEvent(chart, 'mousemove', ds0.data[1]);

			expect(spy.calls.count()).toBe(1);

			jasmine.triggerMouseEvent(chart, 'mousemove', ds0.data[2]);

			expect(spy.calls.count()).toBe(2);
			expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
			expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
			expect(spy.calls.argsFor(1)[0].dataIndex).toBe(2);
			expect(spy.calls.argsFor(1)[0].datasetIndex).toBe(0);
		});
	});

	describe('`leave` handlers', function() {
		it('should be called when the mouse moves outside the label', function() {
			var spy = jasmine.createSpy('spy');
			var chart = jasmine.chart.acquire({
				type: 'line',
				data: this.data,
				options: {
					plugins: {
						datalabels: {
							listeners: {
								leave: spy
							}
						}
					}
				}
			});

			var ds0 = chart.getDatasetMeta(0);

			expect(spy.calls.count()).toBe(0);

			jasmine.triggerMouseEvent(chart, 'mousemove', ds0.data[1]);

			expect(spy.calls.count()).toBe(0);

			jasmine.triggerMouseEvent(chart, 'mousemove', ds0.data[2]);

			expect(spy.calls.count()).toBe(1);
			expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
			expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
		});

		it('should be called when the mouse moves out the canvas', function() {
			var spy = jasmine.createSpy('spy');
			var chart = jasmine.chart.acquire({
				type: 'line',
				data: this.data,
				options: {
					plugins: {
						datalabels: {
							listeners: {
								leave: spy
							}
						}
					}
				}
			});

			var ds0 = chart.getDatasetMeta(0);

			expect(spy.calls.count()).toBe(0);

			jasmine.triggerMouseEvent(chart, 'mousemove', ds0.data[1]);

			expect(spy.calls.count()).toBe(0);

			jasmine.triggerMouseEvent(chart, 'mouseout');

			expect(spy.calls.count()).toBe(1);
			expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
			expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
		});
	});

	describe('`click` handlers', function() {
		it('should be called when user click a label', function() {
			var spy = jasmine.createSpy('spy');
			var chart = jasmine.chart.acquire({
				type: 'line',
				data: this.data,
				options: {
					plugins: {
						datalabels: {
							listeners: {
								click: spy
							}
						}
					}
				}
			});

			var ds0 = chart.getDatasetMeta(0);

			expect(spy.calls.count()).toBe(0);

			jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);

			expect(spy.calls.count()).toBe(1);
			expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
			expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
		});
	});

	describe('`listeners` option', function() {
		it('should ignore events if empty', function() {
			var chart = jasmine.chart.acquire({
				type: 'line',
				data: this.data
			});

			expect(chart.$datalabels.listened).toBeFalsy();
		});

		it('should call handlers for any labels if at the options level', function() {
			var spy = jasmine.createSpy('spy');
			var chart = jasmine.chart.acquire({
				type: 'line',
				data: this.data,
				options: {
					plugins: {
						datalabels: {
							listeners: {
								click: spy
							}
						}
					}
				}
			});

			var ds0 = chart.getDatasetMeta(0);
			var ds1 = chart.getDatasetMeta(1);

			expect(chart.$datalabels.listened).toBeTruthy();
			expect(spy.calls.count()).toBe(0);

			jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);
			jasmine.triggerMouseEvent(chart, 'click', ds1.data[2]);

			expect(spy.calls.count()).toBe(2);
			expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
			expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
			expect(spy.calls.argsFor(1)[0].dataIndex).toBe(2);
			expect(spy.calls.argsFor(1)[0].datasetIndex).toBe(1);
		});

		it('should call handlers only for labels of the same dataset if at the dataset level', function() {
			var spy = jasmine.createSpy('spy');
			var data = Chart.helpers.clone(this.data);

			data.datasets[1].datalabels = {
				listeners: {
					click: spy
				}
			};

			var chart = jasmine.chart.acquire({
				type: 'line',
				data: data
			});

			var ds0 = chart.getDatasetMeta(0);
			var ds1 = chart.getDatasetMeta(1);

			expect(chart.$datalabels.listened).toBeTruthy();
			expect(spy.calls.count()).toBe(0);

			jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);
			jasmine.triggerMouseEvent(chart, 'click', ds1.data[2]);

			expect(spy.calls.count()).toBe(1);
			expect(spy.calls.argsFor(0)[0].dataIndex).toBe(2);
			expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(1);
		});
	});

	describe('handlers', function() {
		it('should update label when explicitly returning `true`', function() {
			var options = {
				opacity: function(context) {
					return context.foobar ? 1 : 0.5;
				},
				listeners: {
					click: function(context) {
						context.foobar = !context.foobar;
						return true;
					}
				}
			};

			spyOn(options, 'opacity');

			var chart = jasmine.chart.acquire({
				type: 'line',
				data: this.data,
				options: {
					hover: false,
					plugins: {
						datalabels: options
					}
				}
			});

			spyOn(chart, 'render');

			var ds0 = chart.getDatasetMeta(0);

			expect(chart.render).not.toHaveBeenCalled();
			expect(options.opacity).toHaveBeenCalled();
			expect(options.opacity.calls.argsFor(0)[0].foobar).toBeUndefined();

			options.opacity.calls.reset();
			jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);

			expect(chart.render).toHaveBeenCalled();
			expect(options.opacity).toHaveBeenCalled();
			expect(options.opacity.calls.argsFor(0)[0].foobar).toBeTruthy();

			options.opacity.calls.reset();
			jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);

			expect(chart.render).toHaveBeenCalled();
			expect(options.opacity).toHaveBeenCalled();
			expect(options.opacity.calls.argsFor(0)[0].foobar).toBeFalsy();
		});

		it('should not update label when returning not `true`', function() {
			var options = {
				opacity: function(context) {
					return context.foobar ? 1 : 0.5;
				},
				listeners: {
					click: function(context) {
						context.foobar = !context.foobar;
						// WE DO NOT RETURN TRUE // return true;
					}
				}
			};

			spyOn(options, 'opacity');

			var chart = jasmine.chart.acquire({
				type: 'line',
				data: this.data,
				options: {
					hover: false,
					plugins: {
						datalabels: options
					}
				}
			});

			spyOn(chart, 'render');

			var ds0 = chart.getDatasetMeta(0);

			expect(chart.render).not.toHaveBeenCalled();
			expect(options.opacity).toHaveBeenCalled();

			options.opacity.calls.reset();
			jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);

			expect(chart.render).not.toHaveBeenCalled();
			expect(options.opacity).not.toHaveBeenCalled();
		});
	});
});
