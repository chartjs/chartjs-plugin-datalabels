# Polar Area

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 10;
var labels = [];

Utils.srand(16);

for (var i = 0; i < DATA_COUNT; ++i) {
  labels.push('' + i);
}
// </block:setup>

var config = /* <block:config:0> */ {
  type: 'polarArea',
  data: {
    labels: labels,
    datasets: [{
      backgroundColor: Utils.color(0),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      })
    }, {
      backgroundColor: Utils.color(1),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      })
    }, {
      backgroundColor: Utils.color(2),
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
        anchor: 'end',
        backgroundColor: function(context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 25,
        borderWidth: 2,
        color: 'white',
        font: {
          weight: 'bold'
        },
        formatter: Math.round,
        padding: 6
      }
    },

    // Core options
    aspectRatio: 4 / 3,
    layout: {
      padding: 16
    },
    elements: {
      line: {
        fill: false
      },
      point: {
        hoverRadius: 7,
        radius: 5
      }
    },
  }
} /* </block:config> */;

var actions = [
  {
    name: 'Randomize',
    handler: function(chart) {
      chart.data.datasets.forEach(function(dataset, i) {
        dataset.backgroundColor = Utils.color();
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
