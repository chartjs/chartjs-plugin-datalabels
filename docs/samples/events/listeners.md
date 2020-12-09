# Listeners

Listen and log all [label events](../../guide/events.md) (see the `Output` tab).

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 6;
var labels = [];

Utils.srand(8);

for (var idx = 0; idx < DATA_COUNT; ++idx) {
  labels.push('' + idx);
}

function log(type, context) {
  var i = context.datasetIndex;
  var j = context.dataIndex;
  var v = context.dataset.data[j];

  console.log(type + ': ' + i + '-' + j + ' (' + v + ')')
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
          return context.dataset.backgroundColor;
        },
        color: 'white',
        font: {
          weight: 'bold'
        },
        offset: 8,
        padding: 6,
        formatter: Math.round,
        listeners: {
          enter: function(context) {
            log('enter', context);
          },
          leave: function(context) {
            log('leave', context);
          },
          click: function(context) {
            log('click', context);
          }
        }
      }
    },

    // Core options
    aspectRatio: 5 / 3,
    layout: {
      padding: {
        top: 40,
        right: 16,
        bottom: 16,
        left: 0
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

module.exports = {
  config: config,
  output: 'Interact with labels to log events',
};
```
