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
              borderColor(ctx) {
                switch (ctx.dataIndex) {
                case 0: return '#f00';
                case 1: return '#0f0';
                case 2: return '#00f';
                default: return '#ff0';
                }
              },
              borderWidth(ctx) {
                switch (ctx.dataIndex) {
                case 0: return 10;
                case 1: return 8;
                case 2: return 6;
                default: return 4;
                }
              },
              padding(ctx) {
                switch (ctx.dataIndex) {
                case 0: return 4;
                case 1: return 6;
                case 2: return 8;
                default: return 10;
                }
              }
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
