var datasets = [];
var labels = [];
var inputs = [
  0, 90, 180, 270,
  45, 70, 160, 520,
  -45, -70, -160, -520
];

for (var i = 0; i < inputs.length; ++i) {
  labels.push(1);
}

['end', 'center', 'start'].forEach(function(anchor) {
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
    type: 'doughnut',
    data: {
      datasets: datasets,
      labels: labels
    },
    options: {
      layout: {
        padding: 20
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
      height: 512,
      width: 512
    }
  }
};
