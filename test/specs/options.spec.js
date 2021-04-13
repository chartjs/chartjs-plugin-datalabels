import plugin from 'chartjs-plugin-datalabels';

var OPTIONS = {
  align: {auto: true},
  anchor: {auto: true},
  clamp: {auto: true},
  clip: {auto: true},
  display: {auto: true},
  opacity: {auto: true},
  textStrokeColor: {auto: false},
  textStrokeWidth: {auto: false},
  textShadowBlur: {auto: false},
  textShadowColor: {auto: false},
};

describe('options', function() {
  jasmine.chart.register(plugin);

  describe('options (scriptable)', function() {
    Object.keys(OPTIONS).forEach(function(key) {
      it(key + ' should be called with a valid context', function() {
        var options = {};
        options[key] = function() {};
        spyOn(options, key);

        var chart = jasmine.chart.acquire({
          type: 'line',
          data: {
            labels: [0, 1],
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

  Object.keys(OPTIONS).forEach(function(key) {
    if (OPTIONS[key].auto) {
      describe(`options.${key}`, function() {
        describe('auto', jasmine.fixture.specs(`options.${key}`));
      });
    }
  });

  describe('options.labels', function() {
    describe('auto', jasmine.fixture.specs('options.labels'));
  });
});
