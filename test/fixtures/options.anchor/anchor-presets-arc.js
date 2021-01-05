var datasets = [];

['end', 'center', 'start'].forEach(function(anchor) {
  datasets.push({
    data: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    datalabels: {
      anchor: anchor
    }
  });
});

export default {
  config: {
    type: 'doughnut',
    data: {
      datasets: datasets
    },
    options: {
      cutoutPercentage: 50,
      layout: {
        padding: 16
      },
      plugins: {
        datalabels: {
          backgroundColor: '#00ff77',
          borderColor: 'black',
          borderWidth: 2,
          font: {
            size: 0
          },
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
