import plugin from 'chartjs-plugin-datalabels';

describe('interactions', function() {
  jasmine.chart.register(plugin);

  describe('context.active', function() {
    it('should be false for non active elements (default)', function() {
      var options = {color: function() {}};
      var spy = spyOn(options, 'color');

      jasmine.chart.acquire({
        type: 'line',
        data: {
          labels: [1, 2, 3],
          datasets: [{
            data: [1, 2, 3],
            fill: false
          }]
        },
        options: {
          plugins: {
            datalabels: options
          }
        }
      });

      expect(spy.calls.count()).toBe(3);
      expect(spy.calls.argsFor(0)[0].active).toBe(false);
      expect(spy.calls.argsFor(1)[0].active).toBe(false);
      expect(spy.calls.argsFor(2)[0].active).toBe(false);
    });
    it('should be true for active elements', async function() {
      var options = {color: function() {}};
      var spy = spyOn(options, 'color');

      var chart = jasmine.chart.acquire({
        type: 'line',
        data: {
          labels: [1, 2, 3],
          datasets: [{
            data: [1, 2, 3],
            fill: false
          }]
        },
        options: {
          plugins: {
            datalabels: options
          }
        }
      });

      spy.calls.reset();

      var ds0 = chart.getDatasetMeta(0);
      await jasmine.triggerMouseEvent(chart, 'mousemove', ds0.data[1]);

      expect(spy.calls.count()).toBe(1);
      expect(spy.calls.argsFor(0)[0].active).toBe(true);
      expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
      expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
    });
  });

  describe('when the user hover elements', function() {
    it('should not update the whole chart (only render)', async function() {
      var chart = jasmine.chart.acquire({
        type: 'line',
        data: {
          labels: [1, 2, 3],
          datasets: [{
            data: [1, 2, 3],
            fill: false
          }]
        }
      });

      spyOn(chart, 'update');
      spyOn(chart, 'render');

      await jasmine.triggerMouseEvent(chart, 'mousemove', chart.getDatasetMeta(0).data[1]);

      expect(chart.update).not.toHaveBeenCalled();
      expect(chart.render).toHaveBeenCalled();
    });
    it('should only update active elements (context.active: true)', async function() {
      var options = {color: function() {}};
      var spy = spyOn(options, 'color');
      var chart = jasmine.chart.acquire({
        type: 'line',
        data: {
          labels: [1, 2, 3],
          datasets: [{
            data: [1, 2, 3],
            fill: false
          }]
        },
        options: {
          plugins: {
            datalabels: options
          }
        }
      });

      expect(spy.calls.count()).toBe(3);
      spy.calls.reset();

      await jasmine.triggerMouseEvent(chart, 'mousemove', chart.getDatasetMeta(0).data[1]);

      expect(spy.calls.count()).toBe(1);
      expect(spy.calls.argsFor(0)[0].active).toBe(true);
      expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
      expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
    });
    it('should only update previously active elements (context.active: false)', async function() {
      var options = {color: function() {}};
      var spy = spyOn(options, 'color');

      var chart = jasmine.chart.acquire({
        type: 'line',
        data: {
          labels: [1, 2, 3],
          datasets: [{
            data: [1, 2, 3],
            fill: false
          }]
        },
        options: {
          plugins: {
            datalabels: options
          }
        }
      });

      expect(spy.calls.count()).toBe(3);
      spy.calls.reset();

      await jasmine.triggerMouseEvent(chart, 'mousemove', chart.getDatasetMeta(0).data[1]);

      expect(spy.calls.count()).toBe(1);
      spy.calls.reset();

      await jasmine.triggerMouseEvent(chart, 'mouseout', null);

      expect(spy.calls.count()).toBe(1);
      expect(spy.calls.argsFor(0)[0].active).toBe(false);
      expect(spy.calls.argsFor(0)[0].dataIndex).toBe(1);
      expect(spy.calls.argsFor(0)[0].datasetIndex).toBe(0);
    });
  });
});
