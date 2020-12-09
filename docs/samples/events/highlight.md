# Highlight

Listen for mouse [`enter` and `leave` events](../../guide/events.md) to modify the label style
using [scriptable options](../../guide/options.md#scriptable-options).

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 8;
var labels = [];

Utils.srand(0);

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
      }),
      datalabels: {
        align: 'start'
      }
    }, {
      backgroundColor: Utils.color(1),
      borderColor: Utils.color(1),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      })
    }, {
      backgroundColor: Utils.color(2),
      borderColor: Utils.color(2),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      }),
      datalabels: {
        align: 'end'
      }
    }]
  },
  options: {
    plugins: {
      datalabels: {
        backgroundColor: function(context) {
          return context.hovered ? context.dataset.backgroundColor : 'white';
        },
        borderColor: function(context) {
          return context.dataset.backgroundColor;
        },
        borderRadius: 16,
        borderWidth: 3,
        color: function(context) {
          return context.hovered ? 'white' : context.dataset.backgroundColor;
        },
        font: {
          weight: 'bold'
        },
        offset: 8,
        formatter: Math.round,
        listeners: {
          enter: function(context) {
            context.hovered = true;
            return true;
          },
          leave: function(context) {
            context.hovered = false;
            return true;
          }
        }
      }
    },

    // Core options
    aspectRatio: 5 / 3,
    layout: {
      padding: {
        top: 42,
        right: 16,
        bottom: 16,
        left: 8
      }
    },
    elements: {
      line: {
        fill: false,
        tension: 0.4
      }
    },
    scales: {
      y: {
        stacked: true
      }
    }
  }
} /* </block:config> */;

var actions = [
  {
    name: 'Randomize',
    handler: function(chart) {
      chart.data.datasets.forEach(function(dataset, i) {
        dataset.backgroundColor = dataset.borderColor = Utils.color();
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
