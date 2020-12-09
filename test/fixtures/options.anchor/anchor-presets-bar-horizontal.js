var datasets = [];

['start', 'center', 'end'].forEach(function(anchor) {
  datasets.push({
    data: [0, 4, -4],
    datalabels: {
      anchor: anchor
    }
  });
});

export default {
  config: {
    type: 'bar',
    data: {
      labels: [0, 1, 2],
      datasets: datasets
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
          padding: 8
        }
      }
    }
  },
  options: {
    canvas: {
      height: 512,
      width: 256
    }
  }
};
