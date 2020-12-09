# Data

Use [scriptable options](../../guide/options.md#scriptable-options) to display increasing values
and decreasing values differently.

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
          var curr = context.dataset.data[index];
          var prev = context.dataset.data[index - 1];
          var next = context.dataset.data[index + 1];
          return prev < curr && next < curr ? 'end' :
            prev > curr && next > curr ? 'start' :
            'center';
        },
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderColor: 'rgba(128, 128, 128, 0.7)',
        borderRadius: 4,
        borderWidth: 1,
        color: function(context) {
          var i = context.dataIndex;
          var value = context.dataset.data[i];
          var prev = context.dataset.data[i - 1];
          var diff = prev !== undefined ? value - prev : 0;
          return diff < 0 ? Utils.color(0) :
            diff > 0 ? Utils.color(1) :
            'gray';
        },
        font: {
          size: 11,
          weight: 'bold',
        },
        offset: 8,
        formatter: function(value, context) {
          var i = context.dataIndex;
          var prev = context.dataset.data[i - 1];
          var diff = prev !== undefined ? prev - value : 0;
          var glyph = diff < 0 ? '\u25B2' : diff > 0 ? '\u25BC' : '\u25C6';
          return glyph + ' ' + Math.round(value);
        },
        padding: 6
      }
    },

    // Core options
    aspectRatio: 5 / 3,
    layout: {
      padding: {
        top: 32,
        right: 24,
        bottom: 8,
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
          return Utils.rand(-100, 100);
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
        dataset.data.push(Utils.rand(-100, 100));
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
