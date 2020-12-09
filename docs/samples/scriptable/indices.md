# Indices

Use [scriptable options](../../guide/options.md#scriptable-options) to alternate the style of the
labels based on the data indices.

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 16;
var labels = [];

Utils.srand(4);

for (var i = 0; i < DATA_COUNT; ++i) {
  labels.push('' + i);
}
// </block:setup>

var config = /* <block:config:0> */ {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      backgroundColor: Utils.color(0),
      borderColor: Utils.color(0),
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
        align: function(context) {
          return context.dataIndex % 2 ? 'end' : 'center';
        },
        backgroundColor: function(context) {
          return context.dataIndex % 2 ?
            context.dataset.borderColor :
            'rgba(255, 255, 255, 0.8)';
        },
        borderColor: function(context) {
          return context.dataIndex % 2 ? null : context.dataset.borderColor;
        },
        borderWidth: function(context) {
          return context.dataIndex % 2 ? 0 : 2;
        },
        color: function(context) {
          return context.dataIndex % 2 ? 'white' : context.dataset.borderColor;
        },
        font: {
          weight: 'bold',
        },
        formatter: function(value, context) {
          return context.dataIndex + ': ' + Math.round(value) + '\\'';
        },
        offset: 8,
        padding: 6,
      }
    },

    // Core options
    aspectRatio: 5 / 3,
    layout: {
      padding: {
        top: 32,
        right: 24,
        bottom: 24,
        left: 0
      }
    },
    elements: {
      line: {
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
        dataset.backgroundColor = color;
        dataset.borderColor = color;
        dataset.data = dataset.data.map(function(value) {
          return Utils.rand(0, 100);
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
        dataset.data.push(Utils.rand(0, 100));
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
