# Multiple Labels

Use [multiple labels configuration](../../guide/labels.md#multiple-labels) to display 3 labels
per data, one for the `index`, one for the `label` and one for the `value`. Move the mouse over
the chart to display label ids.

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 4;
var labels = [
  'Earth',
  'Mars',
  'Saturn',
  'Jupiter'
];

Utils.srand(4);
// </block:setup>

var config = /* <block:config:0> */ {
  type: 'doughnut',
  data: {
    labels: labels,
    datasets: [{
      backgroundColor: Utils.colors({
        color: Utils.color(1),
        mode: 'darken'
      }),
      hoverBorderColor: 'white',
      data: Utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
      }),
      datalabels: {
        labels: {
          index: {
            align: 'end',
            anchor: 'end',
            color: function(ctx) {
              return ctx.dataset.backgroundColor;
            },
            font: {size: 18},
            formatter: function(value, ctx) {
              return ctx.active
                ? 'index'
                : '#' + (ctx.dataIndex + 1);
            },
            offset: 8,
            opacity: function(ctx) {
              return ctx.active ? 1 : 0.5;
            }
          },
          name: {
            align: 'top',
            font: {size: 16},
            formatter: function(value, ctx) {
              return ctx.active
                ? 'name'
                : ctx.chart.data.labels[ctx.dataIndex];
            }
          },
          value: {
            align: 'bottom',
            backgroundColor: function(ctx) {
              var value = ctx.dataset.data[ctx.dataIndex];
              return value > 50 ? 'white' : null;
            },
            borderColor: 'white',
            borderWidth: 2,
            borderRadius: 4,
            color: function(ctx) {
              var value = ctx.dataset.data[ctx.dataIndex];
              return value > 50
                ? ctx.dataset.backgroundColor
                : 'white';
            },
            formatter: function(value, ctx) {
              return ctx.active
                ? 'value'
                : Math.round(value * 1000) / 1000;
            },
            padding: 4
          }
        }
      }
    }]
  },
  options: {
    plugins: {
      datalabels: {
        color: 'white',
        display: function(ctx) {
          return ctx.dataset.data[ctx.dataIndex] > 10;
        },
        font: {
          weight: 'bold',
        },
        offset: 0,
        padding: 0
      }
    },

    // Core options
    aspectRatio: 3 / 2,
    cutoutPercentage: 8,
    layout: {
      padding: 16
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
  }
} /* </block:config> */;

var actions = [
  {
    name: 'Randomize',
    handler: function(chart) {
      chart.data.datasets.forEach(function(dataset, i) {
        dataset.backgroundColor = Utils.colors({
          color: Utils.color(),
          mode: 'darken'
        });
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
