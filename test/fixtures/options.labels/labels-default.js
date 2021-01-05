export default {
  config: {
    type: 'line',
    data: {
      labels: [0],
      datasets: [{
        data: [0],
        datalabels: {
          // labels: undefined
        }
      }, {
        data: [1],
        datalabels: {
          labels: {}
        }
      }]
    },
    options: {
      elements: {
        line: {
          fill: false
        }
      },
      layout: {
        padding: 16
      },
      plugins: {
        datalabels: {
          backgroundColor: '#f00',
          borderColor: '#0f0',
          borderWidth: 4,
          color: 'transparent',
          font: {size: 0},
          padding: 8
        }
      }
    }
  },
  options: {
    canvas: {
      height: 64,
      width: 32
    }
  }
};
