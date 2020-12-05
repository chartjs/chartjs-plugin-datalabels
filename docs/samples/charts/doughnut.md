# Doughnut

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 10;
var labels = [];

Utils.srand(4);

for (var i = 0; i < DATA_COUNT; ++i) {
  labels.push('' + i);
}
// </block:setup>

var config = /* <block:config:0> */ {
  type: 'doughnut',
  data: {
    labels: labels,
    datasets: [{
      backgroundColor: Utils.colors({
        color: Utils.color(0),
        count: DATA_COUNT
      }),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      }),
      datalabels: {
        anchor: 'end'
      }
    }, {
      backgroundColor: Utils.colors({
        color: Utils.color(1),
        count: DATA_COUNT
      }),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      }),
      datalabels: {
        anchor: 'center',
        backgroundColor: null,
        borderWidth: 0
      }
    }, {
      backgroundColor: Utils.colors({
        color: Utils.color(2),
        count: DATA_COUNT
      }),
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      }),
      datalabels: {
        anchor: 'start'
      }
    }]
  },
  options: {
    plugins: {
      datalabels: {
        backgroundColor: function(context) {
          return context.dataset.backgroundColor;
        },
        borderColor: 'white',
        borderRadius: 25,
        borderWidth: 2,
        color: 'white',
        display: function(context) {
          var dataset = context.dataset;
          var count = dataset.data.length;
          var value = dataset.data[context.dataIndex];
          return value > count * 1.5;
        },
        font: {
          weight: 'bold'
        },
        padding: 6,
        formatter: Math.round
      }
    },

    // Core options
    aspectRatio: 4 / 3,
    cutoutPercentage: 32,
    layout: {
      padding: 32
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
        dataset.backgroundColor = dataset.data.map(function(value) {
          return Utils.color();
        });
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
        dataset.backgroundColor.push(Utils.color());
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
        dataset.backgroundColor.shift();
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
