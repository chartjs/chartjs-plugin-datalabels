# Interactions

Use [scriptable options](../../guide/options.md#scriptable-options) to change the style and
content of the labels when the user interacts with the chart.

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 8;
var labels = [];

Utils.srand(100);

for (var i = 0; i < DATA_COUNT; ++i) {
  labels.push('' + i);
}
// </block:setup>

var config = /* <block:config:0> */ {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'France',
      backgroundColor: Utils.color(0),
      borderColor: Utils.color(0),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 10,
        max: 100
      }),
      datalabels: {
        align: function(context) {
          return context.active ? 'start' : 'center';
        }
      }
    }, {
      label: 'Canada',
      backgroundColor: Utils.color(1),
      borderColor: Utils.color(1),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      })
    }, {
      label: 'USA',
      backgroundColor: Utils.color(2),
      borderColor: Utils.color(2),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      }),
      datalabels: {
        align: function(context) {
          return context.active ? 'end' : 'center';
        }
      }
    }]
  },
  options: {
    plugins: {
      datalabels: {
        backgroundColor: function(context) {
          return context.active ? context.dataset.backgroundColor : 'white';
        },
        borderColor: function(context) {
          return context.dataset.backgroundColor;
        },
        borderRadius: function(context) {
          return context.active ? 0 : 32;
        },
        borderWidth: 3,
        color: function(context) {
          return context.active ? 'white' : context.dataset.backgroundColor;
        },
        font: {
          weight: 'bold'
        },
        formatter: function(value, context) {
          value = Math.round(value * 100) / 100;
          return context.active
            ? context.dataset.label + '\\n' + value + '%'
            : Math.round(value);
        },
        offset: 8,
        padding: 5,
        textAlign: 'center'
      }
    },

    // Core options
    aspectRatio: 5 / 3,
    layout: {
      padding: {
        bottom: 16,
        right: 40,
        left: 8,
        top: 40
      }
    },
    hover: {
      mode: 'index',
      intersect: false
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
} // </block:config>

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
      chart.data.datasets.forEach(function (dataset, i) {
        dataset.data.push(Utils.rand(0, 100));
      });

      chart.update();
    }
  },
  {
    name: 'Remove data',
    handler: function(chart) {
      chart.data.labels.shift();
      chart.data.datasets.forEach(function (dataset, i) {
        dataset.data.shift();
      });

      chart.update();
    }
  }
]

module.exports = {
  actions: actions,
  config: config,
};
```
