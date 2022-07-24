import {clone} from 'chart.js/helpers';
import plugin from 'chartjs-plugin-datalabels';

describe('events', function() {
  jasmine.chart.register(plugin);

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

  describe('hitbox', function() {
    it('should detect events for labels with borders', async function() {
      var spy = jasmine.createSpy('spy');
      var chart = jasmine.chart.acquire({
        type: 'line',
        data: this.data,
        options: {
          plugins: {
            datalabels: {
              borderWidth: 16,
              padding: 16,
              font: {
                size: 0
              },
              listeners: {
                enter: spy
              },
            }
          }
        }
      });

      var label = chart.$datalabels._datasets[0][1];

      expect(spy.calls.count()).toBe(0);

      await jasmine.triggerMouseEvent(chart, 'mousemove', {
        x: label._el.getProps(['x']).x - 16 - 12,
        y: label._el.getProps(['y']).y - 16 - 12
      });

      expect(spy.calls.count()).toBe(1);
    });
  });

  describe('`enter` handlers', function() {
    it('should be called when the mouse moves inside the label', async function() {
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

      await jasmine.triggerMouseEvent(chart, 'mousemove', ds0.data[1]);

      expect(spy.calls.count()).toBe(1);

      await jasmine.triggerMouseEvent(chart, 'mousemove', ds0.data[2]);

      expect(spy.calls.count()).toBe(2);
      expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
      expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
      expect(spy.calls.argsFor(0)[1].native.type).toBe('mousemove');
      expect(spy.calls.argsFor(1)[0].dataIndex).toBe(2);
      expect(spy.calls.argsFor(1)[0].datasetIndex).toBe(0);
      expect(spy.calls.argsFor(1)[1].native.type).toBe('mousemove');
    });
  });

  describe('`leave` handlers', function() {
    it('should be called when the mouse moves outside the label', async function() {
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

      await jasmine.triggerMouseEvent(chart, 'mousemove', ds0.data[1]);

      expect(spy.calls.count()).toBe(0);

      await jasmine.triggerMouseEvent(chart, 'mousemove', ds0.data[2]);

      expect(spy.calls.count()).toBe(1);
      expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
      expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
      expect(spy.calls.argsFor(0)[1].native.type).toBe('mousemove');
    });

    it('should be called when the mouse moves out the canvas', async function() {
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

      await jasmine.triggerMouseEvent(chart, 'mousemove', ds0.data[1]);

      expect(spy.calls.count()).toBe(0);

      await jasmine.triggerMouseEvent(chart, 'mouseout');

      expect(spy.calls.count()).toBe(1);
      expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
      expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
      expect(spy.calls.argsFor(0)[1].native.type).toBe('mouseout');
    });
  });

  describe('`click` handlers', function() {
    it('should be called when user click a label', async function() {
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

      await jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);

      expect(spy.calls.count()).toBe(1);
      expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
      expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
      expect(spy.calls.argsFor(0)[1].native.type).toBe('click');
    });
  });

  describe('`listeners` option', function() {
    it('should ignore events if empty', function() {
      var chart = jasmine.chart.acquire({
        type: 'line',
        data: this.data
      });

      expect(chart.$datalabels._listened).toBeFalsy();
    });

    it('should call handlers for any labels in any dataset', async function() {
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

      expect(chart.$datalabels._listened).toBeTruthy();
      expect(spy.calls.count()).toBe(0);

      await jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);
      await jasmine.triggerMouseEvent(chart, 'click', ds1.data[2]);

      expect(spy.calls.count()).toBe(2);
      expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
      expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
      expect(spy.calls.argsFor(1)[0].dataIndex).toBe(2);
      expect(spy.calls.argsFor(1)[0].datasetIndex).toBe(1);
    });

    it('should call handlers for label in a specific dataset', async function() {
      var spy = jasmine.createSpy('spy');
      var data = clone(this.data);

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

      expect(chart.$datalabels._listened).toBeTruthy();
      expect(spy.calls.count()).toBe(0);

      await jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);
      await jasmine.triggerMouseEvent(chart, 'click', ds1.data[2]);

      expect(spy.calls.count()).toBe(1);
      expect(spy.calls.argsFor(0)[0].dataIndex).toBe(2);
      expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(1);
    });

    it('should call handlers for specific label in any dataset', async function() {
      var spy = jasmine.createSpy('spy');
      var chart = jasmine.chart.acquire({
        type: 'line',
        data: this.data,
        options: {
          plugins: {
            datalabels: {
              offset: 0,
              labels: {
                foo: {
                  align: 'start'
                },
                bar: {
                  align: 'end',
                  listeners: {
                    click: spy
                  }
                }
              }
            }
          }
        }
      });

      var pt0 = chart.getDatasetMeta(0).data[1].getProps(['x', 'y']);
      var pt1 = chart.getDatasetMeta(1).data[1].getProps(['x', 'y']);

      expect(chart.$datalabels._listened).toBeTruthy();
      expect(spy.calls.count()).toBe(0);

      // Clicking on 4 labels, 2 per data in 2 different datasets.
      await jasmine.triggerMouseEvent(chart, 'click', {x: pt0.x, y: pt0.y + 4});
      await jasmine.triggerMouseEvent(chart, 'click', {x: pt0.x, y: pt0.y - 4});
      await jasmine.triggerMouseEvent(chart, 'click', {x: pt1.x, y: pt1.y + 4});
      await jasmine.triggerMouseEvent(chart, 'click', {x: pt1.x, y: pt1.y - 4});

      expect(spy.calls.count()).toBe(2);
      expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
      expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
      expect(spy.calls.argsFor(1)[0].dataIndex).toBe(1);
      expect(spy.calls.argsFor(1)[0].datasetIndex).toBe(1);
    });

    it('should call handlers for specific label in a specific dataset', async function() {
      var spy = jasmine.createSpy('spy');
      var data = clone(this.data);

      data.datasets[1].datalabels = {
        labels: {
          bar: {
            align: 'end',
            listeners: {
              click: spy
            }
          }
        }
      };

      var chart = jasmine.chart.acquire({
        type: 'line',
        data: data,
        options: {
          plugins: {
            datalabels: {
              labels: {
                foo: {
                  align: 'start'
                },
                bar: {
                  align: 'end'
                }
              }
            }
          }
        }
      });

      var pt0 = chart.getDatasetMeta(0).data[1].getProps(['x', 'y']);
      var pt1 = chart.getDatasetMeta(1).data[1].getProps(['x', 'y']);

      expect(chart.$datalabels._listened).toBeTruthy();
      expect(spy.calls.count()).toBe(0);

      // Clicking on 4 labels, 2 per data in 2 different datasets.
      await jasmine.triggerMouseEvent(chart, 'click', {x: pt0.x, y: pt0.y + 4});
      await jasmine.triggerMouseEvent(chart, 'click', {x: pt0.x, y: pt0.y - 4});
      await jasmine.triggerMouseEvent(chart, 'click', {x: pt1.x, y: pt1.y + 4});
      await jasmine.triggerMouseEvent(chart, 'click', {x: pt1.x, y: pt1.y - 4});

      expect(spy.calls.count()).toBe(1);
      expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
      expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(1);
    });
  });

  describe('handlers', function() {
    it('should update label when explicitly returning `true`', async function() {
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
      await jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);
      expect(chart.render).toHaveBeenCalled();
      expect(options.opacity).toHaveBeenCalled();
      expect(options.opacity.calls.argsFor(0)[0].foobar).toBeTruthy();

      options.opacity.calls.reset();
      await jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);

      expect(chart.render).toHaveBeenCalled();
      expect(options.opacity).toHaveBeenCalled();
      expect(options.opacity.calls.argsFor(0)[0].foobar).toBeFalsy();
    });

    it('should not update label when returning not `true`', async function() {
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
            datalabels: options,
            tooltip: false // Chart.js v3.0.0-beta.10 tooltip plugin triggers a change if enabled
          }
        }
      });

      spyOn(chart, 'render');

      var ds0 = chart.getDatasetMeta(0);

      expect(chart.render).not.toHaveBeenCalled();
      expect(options.opacity).toHaveBeenCalled();

      options.opacity.calls.reset();
      await jasmine.triggerMouseEvent(chart, 'click', ds0.data[1]);

      expect(chart.render).not.toHaveBeenCalled();
      expect(options.opacity).not.toHaveBeenCalled();
    });
  });
});
