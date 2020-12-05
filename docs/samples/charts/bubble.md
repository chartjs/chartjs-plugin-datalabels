# Bubble

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 8;
var labels = [];

Utils.srand(18);

function generatePoint() {
  return {
    x: Utils.rand(-100, 100),
    y: Utils.rand(-50, 50),
    v: Utils.rand(15, 100),
  };
}

function generateData() {
  var data = [];
  for (var i = 0; i < DATA_COUNT; ++i) {
    data.push(generatePoint());
  }
  return data;
}
// </block:setup>

var config = /* <block:config:0> */ {
  type: 'bubble',
  data: {
    datasets: [{
      backgroundColor: Utils.color(0),
      borderColor: Utils.color(0),
      data: generateData()
    }, {
      backgroundColor: Utils.color(1),
      borderColor: Utils.color(1),
      data: generateData()
    }]
  },
  options: {
    plugins: {
      datalabels: {
        anchor: function(context) {
          var value = context.dataset.data[context.dataIndex];
          return value.v < 50 ? 'end' : 'center';
        },
        align: function(context) {
          var value = context.dataset.data[context.dataIndex];
          return value.v < 50 ? 'end' : 'center';
        },
        color: function(context) {
          var value = context.dataset.data[context.dataIndex];
          return value.v < 50 ? context.dataset.backgroundColor : 'white';
        },
        font: {
          weight: 'bold'
        },
        formatter: function(value) {
          return Math.round(value.v);
        },
        offset: 2,
        padding: 0
      }
    },

    // Core options
    aspectRatio: 5 / 3,
    layout: {
      padding: 16
    },
    elements: {
      point: {
        radius: function(context) {
          var value = context.dataset.data[context.dataIndex];
          var size = context.chart.width;
          var base = Math.abs(value.v) / 100;
          return (size / 24) * base;
        }
      }
    },
  }
} /* </block:config> */;

var actions = [
  {
    name: 'Randomize',
    handler: function(chart) {
      chart.data.datasets.forEach(function(dataset, i) {
        dataset.backgroundColor = dataset.borderColor = Utils.color();
        dataset.data = generateData();
      });

      chart.update();
    }
  },
  {
    name: 'Add data',
    handler: function(chart) {
      chart.data.labels.push(chart.data.labels.length);
      chart.data.datasets.forEach(function(dataset, i) {
        dataset.data.push(generatePoint());
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
