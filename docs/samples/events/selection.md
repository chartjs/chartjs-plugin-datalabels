# Selection

[Click events](../../guide/events.md) are handled to select labels, returning `true` to re-render
the chart and update labels (see the `Output` tab).

```js chart-editor
// <block:setup:2>
var DATA_COUNT = 8;
var selection = [];
var labels = [];

Utils.srand(7);

for (var idx = 0; idx < DATA_COUNT; ++idx) {
  labels.push('' + idx);
}

function lookup(context) {
  var dataset = context.datasetIndex;
  var index = context.dataIndex;
  var i, ilen;

  for (i = 0, ilen = selection.length; i < ilen; ++i) {
    if (selection[i].dataset === dataset && selection[i].index === index) {
      return i;
    }
  }

  return -1;
}

function isSelected(context) {
  return lookup(context) !== -1;
}

function log(selected) {
  console.log('selection: ' + selected.map(function(item) {
    return item.value;
  }).join(', '));
}

function select(context) {
  var dataset = context.datasetIndex;
  var index = context.dataIndex;
  var value = context.dataset.data[index];

  selection.push({
    dataset: dataset,
    index: index,
    value: value
  });

  log(selection);
}

function deselect(context) {
  var index = lookup(context);
  if (index !== -1) {
    selection.splice(index, 1);
    log(selection);
  }
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
        decimals: 0,
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
        decimals: 0,
        min: 0,
        max: 100
      })
    }, {
      backgroundColor: Utils.color(2),
      borderColor: Utils.color(2),
      data: Utils.numbers({
        count: DATA_COUNT,
        decimals: 0,
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
          return isSelected(context)
            ? context.dataset.backgroundColor
            : 'white';
        },
        borderColor: function(context) {
          return context.dataset.backgroundColor;
        },
        borderWidth: 2,
        color: function(context) {
          return isSelected(context)
            ? 'white'
            : context.dataset.backgroundColor;
        },
        font: {
          weight: 'bold'
        },
        offset: 8,
        padding: 6,
        listeners: {
          click: function(context) {
            if (isSelected(context)) {
              deselect(context);
            } else {
              select(context);
            }

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
        bottom: 32,
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

module.exports = {
  config: config,
  output: 'Click on labels to log events'
};
```
