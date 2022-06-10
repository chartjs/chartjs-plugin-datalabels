import plugin from 'chartjs-plugin-datalabels';

describe('drawing', function() {
  jasmine.chart.register(plugin);

  describe('auto', jasmine.fixture.specs('drawing'));

  // https://github.com/chartjs/chartjs-plugin-datalabels/issues/51
  it ('should not create labels for hidden dataset', function() {
    var chart = jasmine.chart.acquire({
      type: 'line',
      data: {
        labels: [0, 1, 2, 3, 4],
        datasets: [{
          data: [42, 43, 44, 45],
          hidden: true
        }]
      }
    });

    var ds0 = chart.getDatasetMeta(0);

    expect(chart.isDatasetVisible(0)).toBeFalsy();

    for (var i = 0; i <= 3; ++i) {
      expect(ds0.data[i].$datalabels).toEqual([]);
    }
  });

  // https://github.com/chartjs/chartjs-plugin-datalabels/issues/51
  it ('should destroy labels when dataset become hidden', function() {
    var chart = jasmine.chart.acquire({
      type: 'line',
      data: {
        labels: [0, 1, 2, 3, 4],
        datasets: [{
          data: [42, 43, 44, 45]
        }]
      }
    });

    var ds0 = chart.getDatasetMeta(0);
    var i;

    expect(chart.isDatasetVisible(0)).toBeTruthy();

    for (i = 0; i <= 3; ++i) {
      expect(ds0.data[i].$datalabels.length).toBeGreaterThan(0);
    }

    chart.data.datasets[0].hidden = true;
    chart.update();

    expect(chart.isDatasetVisible(0)).toBeFalsy();

    for (i = 0; i <= 3; ++i) {
      expect(ds0.data[i].$datalabels).toEqual([]);
    }
  });
});
