export default {
  config: {
    type: 'line',
    data: {
      labels: [0, 1, 2, 3],
      datasets: [{
        data: [1, 1, 1, 1],
        datalabels: {
          labels: {
            foo: {
              borderColor: [
                '#f00',
                '#0f0',
                '#00f',
                '#ff0',
              ],
              borderWidth: [
                10,
                8,
                6,
                4
              ],
              padding: [
                4,
                6,
                8,
                10
              ]
            }
          }
        }
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
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
          backgroundColor: '#000',
          borderColor: '#fff',
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
      width: 128
    }
  }
};
