# Dataset

Use [scriptable options](../../guide/options.md#scriptable-options) to position labels outside
the filled region between two datasets.

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 12;
var labels = [];

Utils.srand(26);

for (var i = 0; i < DATA_COUNT; ++i) {
  labels.push('' + i);
}
// </block:setup>

var config = /* <block:config:0> */ {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      backgroundColor: Utils.transparentize(Utils.color(0)),
      pointBackgroundColor: Utils.color(1),
      borderColor: Utils.color(1),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: -25,
        max: 25
      }),
      fill: '+1',
    }, {
      pointBackgroundColor: Utils.color(6),
      borderColor: Utils.color(6),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: -100,
        max: 100
      })
    }]
  },
  options: {
    plugins: {
      datalabels: {
        align: function(context) {
          var index = context.dataIndex;
          var datasets = context.chart.data.datasets;
          var v0 = datasets[0].data[index];
          var v1 = datasets[1].data[index];
          var invert = v0 - v1 > 0;
          return context.datasetIndex === 0 ?
            invert ? 'end' : 'start' :
            invert ? 'start' : 'end';
        },
        backgroundColor: function(context) {
          return context.dataset.borderColor;
        },
        borderRadius: 4,
        color: 'white',
        font: {
          weight: 'bold'
        },
        offset: 8,
        padding: 6,
        formatter: Math.round
      }
    },

    // Core options
    aspectRatio: 5 / 3,
    layout: {
      padding: {
        top: 32,
        right: 24,
        bottom: 32,
        left: 0
      }
    },
    elements: {
      line: {
        borderWidth: 2,
        fill: false,
        tension: 0.4
      }
    },
  }
} /* </block:config> */;

var actions = [
  {
    name: 'Randomize',
    handler: function(chart) {
      chart.data.datasets.forEach(function(dataset, i) {
        var color = Utils.color();
        dataset.borderColor = color;
        dataset.pointBackgroundColor = color;
        dataset.data = dataset.data.map(function(value) {
          return Utils.rand(i % 2 ? -100 : -25, i % 2 ? 100 : 25);
        });
      });

      chart.update();
    }
  },
  {
    name: 'Add data',
    handler: function(chart) {
      chart.data.labels.push(chart.data.labels.length);
      chart.data.datasets.forEach(function(dataset, i) {
        dataset.data.push(Utils.rand(i % 2 ? -100 : -25, i % 2 ? 100 : 25));
      });

      chart.update();
    }
  },
  {
    name: 'Remove data',
    handler: function(chart) {
      chart.data.labels.shift();
      chart.data.datasets.forEach(function(dataset, i) {
        dataset.data.shift();
      });

      chart.update();
    }
  }
];

module.exports = {
  actions: actions,
  config: config,
};
```
