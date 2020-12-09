var datasets = [];
var labels = [];
var count = 7;
var inputs = [
  'bottom',
  'start',
  'left',
  'center',
  'right',
  'end',
  'top'
];

for (var i = 0; i < count; ++i) {
  labels.push(i);
}

['start', 'center', 'end'].forEach(function(anchor, v) {
  datasets.push({
    data: labels.map(function() {
      return v + 2;
    }),
    datalabels: {
      align: inputs,
      anchor: anchor
    }
  });
});

export default {
  config: {
    type: 'radar',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      layout: {
        padding: 32
      },
      elements: {
        line: {
          backgroundColor: 'transparent',
          borderColor: 'transparent'
        },
        point: {
          radius: 16
        }
      },
      scales: {
        r: {
          min: 0,
          display: false
        }
      },
      plugins: {
        datalabels: {
          backgroundColor: '#00ff77',
          borderColor: 'black',
          borderWidth: 2,
          font: {
            size: 0
          },
          offset: 0,
          padding: 8
        }
      }
    }
  },
  options: {
    canvas: {
      height: 512,
      width: 512
    }
  }
};
