var datasets = [];

var data = [
  {x: 1, y: 1, v: 11},
  {x: 1, y: 2, v: 12},
  {x: 2, y: 1, v: 21},
  {x: 2, y: 2, v: 22},
];

['start', 'center', 'end'].forEach(function(anchor) {
  datasets.push({
    data: data,
    datalabels: {
      anchor: anchor
    },
    width: 128,
    height: 96
  });
});

export default {
  config: {
    type: 'matrix',
    data: {
      datasets: datasets
    },
    options: {
      backgroundColor: 'transparent',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      scales: {
        x: {
          min: 0.5,
          max: 2.5
        },
        y: {
          offset: true,
          min: 0.5,
          max: 2.5
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
      width: 384,
      height: 288
    }
  }
};
