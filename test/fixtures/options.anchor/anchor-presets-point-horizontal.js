var datasets = [];

['start', 'center', 'end'].forEach(function(anchor, i) {
  datasets.push({
    data: [{x: i, y: i}],
    datalabels: {
      anchor: anchor
    }
  });
});

export default {
  config: {
    type: 'bubble',
    data: {
      datasets: datasets
    },
    options: {
      layout: {
        padding: 64
      },
      elements: {
        point: {
          radius: 24
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
      height: 256,
      width: 256
    }
  }
};
