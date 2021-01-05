export default {
  config: {
    type: 'bar',
    data: {
      labels: [0, 1, 2, 3, 4],
      datasets: [{
        data: [1, 1, 1, 1, 1],
        datalabels: {
          backgroundColor: '#00ff77'
        }
      }]
    },
    options: {
      layout: {
        padding: 16
      },
      plugins: {
        datalabels: {
          anchor: ['start', 'center', 'end', 'center', 'start'],
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
