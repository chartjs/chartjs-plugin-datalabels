# 镜像

用 [脚本配置项](../../guide/options.md#脚本配置项) 来生成水平坐标轴下 [*锚点*](../../guide/positioning.md#锚点)、[*对齐和偏移*](../../guide/positioning.md#对齐和偏移)和[*旋转*](../../guide/positioning.md#旋转)对应的镜像。

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 16;
var labels = [];

Utils.srand(0);

for (var i = 0; i < DATA_COUNT; ++i) {
  labels.push('' + i);
}
// </block:setup>

var config = /* <block:config:0> */ {
  type: 'bar',
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
          var value = context.dataset.data[context.dataIndex];
          return value > 0 ? 'end' : 'start';
        },
        anchor: function(context) {
          var value = context.dataset.data[context.dataIndex];
          return value > 0 ? 'end' : 'start';
        },
        borderRadius: 4,
        color: 'white',
        rotation: function(context) {
          var value = context.dataset.data[context.dataIndex];
          return value > 0 ? 45 : 180 - 45;
        },
        backgroundColor: function(context) {
          return context.dataset.backgroundColor;
        },
        formatter: Math.round,
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
      },
      point: {
        hoverRadius: 7,
        radius: 5
      }
    },
  },
} // </block:config>

var actions = [
  {
    name: 'Randomize',
    handler: function(chart) {
      chart.data.datasets.forEach(function(dataset, i) {
        dataset.backgroundColor = dataset.borderColor = Utils.color();
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
]

module.exports = {
  actions: actions,
  config: config,
};
```
