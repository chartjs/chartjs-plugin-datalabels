var datasets = [];
var labels = [];
var inputs = [
  'left',
  'start',
  'top',
  'center',
  'bottom',
  'end',
  'right'
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
      indexAxis: 'y',
      layout: {
        padding: {
          left: 20,
          right: 20
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
      height: 768,
      width: 128
    }
  }
};
