# Radar

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 6;
var labels = [];

Utils.srand(6);

for (var i = 0; i < DATA_COUNT; ++i) {
  labels.push('' + i);
}
// </block:setup>

var config = /* <block:config:0> */ {
  type: 'radar',
  data: {
    labels: labels,
    datasets: [{
      backgroundColor: Utils.transparentize(Utils.color(0), 0.75),
      borderColor: Utils.color(0),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      })
    }, {
      backgroundColor: Utils.transparentize(Utils.color(1), 0.75),
      borderColor: Utils.color(1),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      })
    }, {
      backgroundColor: Utils.transparentize(Utils.color(2), 0.75),
      borderColor: Utils.color(2),
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
        backgroundColor: function(context) {
          return context.dataset.borderColor;
        },
        color: 'white',
        font: {
          weight: 'bold'
        },
        formatter: Math.round,
        padding: 8
      }
    },

    // Core options
    aspectRatio: 4 / 3,
    elements: {
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
      chart.data.datasets.forEach(function(dataset) {
        var color = Utils.color();
        dataset.backgroundColor = Utils.transparentize(color, 0.75);
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
      chart.data.datasets.forEach(function(dataset) {
        dataset.data.push(Utils.rand(0, 100));
      });

      chart.update();
    }
  },
  {
    name: 'Remove data',
    handler: function(chart) {
      if (chart.data.labels.length > 3) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(function(dataset) {
          dataset.data.shift();
        });

        chart.update();
      }
    }
  }
];

module.exports = {
  actions: actions,
  config: config,
};
```
