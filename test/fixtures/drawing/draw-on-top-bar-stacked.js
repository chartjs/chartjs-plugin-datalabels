// https://github.com/chartjs/chartjs-plugin-datalabels/issues/32

export default {
  config: {
    type: 'bar',
    data: {
      labels: [0, 1],
      datasets: [{
        backgroundColor: '#444',
        data: [2, 2]
      }, {
        backgroundColor: '#222',
        data: [2, 2]
      }, {
        backgroundColor: '#444',
        data: [2, 2]
      }, {
        backgroundColor: '#222',
        data: [2, 2]
      }]
    },
    options: {
      elements: {
        rectangle: {
          borderWidth: 0
        }
      },
      layout: {
        padding: 20
      },
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      },
      plugins: {
        datalabels: {
          anchor: 'start',
          backgroundColor: '#fff',
          font: {
            size: 0
          },
          padding: 24
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
