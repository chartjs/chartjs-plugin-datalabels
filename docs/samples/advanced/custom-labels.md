# Custom Labels

Displays the data labels instead of the data values, using a [custom formatter](../../guide/formatting.md#custom-labels).

```js chart-editor
// <block:setup:2>
var labels = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
];

var DATA_COUNT = labels.length;

Utils.srand(0);
// </block:setup>

var config = /* <block:config:0> */ {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      backgroundColor: Utils.colors(0),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      })
    }]
  },
  options: {
    plugins: {
      datalabels: {
        align: 'end',
        anchor: 'end',
        color: function(context) {
          return context.dataset.backgroundColor;
        },
        font: function(context) {
          var w = context.chart.width;
          return {
            size: w < 512 ? 12 : 14,
            weight: 'bold',
          };
        },
        formatter: function(value, context) {
          return context.chart.data.labels[context.dataIndex];
        }
      }
    },

    // Core options
    aspectRatio: 5 / 3,
    layout: {
      padding: {
        top: 32
      }
    },
    elements: {
      line: {
        fill: false,
        tension: 0.4
      }
    },
    scales: {
      x: {
        display: false,
        offset: true
      },
      y: {
        beginAtZero: true
      }
    }
  }
} /* </block:config> */;

var actions = [
  {
    name: 'Randomize',
    handler: function(chart) {
      chart.data.datasets.forEach(function(dataset, i) {
        dataset.data = dataset.data.map(function(value) {
          return Utils.rand(0, 100);
        });
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
