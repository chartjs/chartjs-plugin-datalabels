var datasets = [];
var labels = [];
var inputs = [
  'bottom',
  'start',
  'left',
  'center',
  'right',
  'end',
  'top'
];

for (var i = 0; i < inputs.length; ++i) {
  labels.push(1);
}

['start', 'center', 'end'].forEach(function(anchor) {
  datasets.push({
    data: labels,
    datalabels: {
      align: inputs,
      anchor: anchor
    }
  });
});

export default {
  config: {
    type: 'bar',
    data: {
      datasets: datasets,
      labels: labels
    },
    options: {
      layout: {
        padding: {
          top: 20,
          bottom: 20
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
          padding: 8,
          offset: 0
        }
      }
    }
  },
  options: {
    canvas: {
      height: 128,
      width: 768
    }
  }
};
