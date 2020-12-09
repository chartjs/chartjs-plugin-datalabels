export default {
  config: {
    type: 'bar',
    data: {
      labels: [0, 1, 2, 3],
      datasets: [{
        data: [50, 50, -50, -50],
        datalabels: {
          backgroundColor: '#00ff77'
        }
      }]
    },
    options: {
      layout: {
        padding: {
          top: 20,
          bottom: 20
        }
      },
      scales: {
        y: {
          min: 25,
          max: -25
        }
      },
      plugins: {
        datalabels: {
          clamp: [false, true, false, true],
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
      height: 256,
      width: 256
    }
  }
};
