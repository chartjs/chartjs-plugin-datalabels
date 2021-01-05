export default {
  config: {
    type: 'line',
    data: {
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      datasets: [{
        data: [4, 2, 0, -2, -4, -2, 0, 2, 4, 2],
        datalabels: {
          backgroundColor: '#f00',
          // display: (fallback)
        }
      }, {
        data: [-4, -2, 0, 2, 4, 2, 0, -2, -4, -2],
        datalabels: {
          backgroundColor: '#0f0',
          // display: (fallback)
        }
      }]
    },
    options: {
      layout: {
        padding: 64
      },
      elements: {
        line: {
          borderColor: 'transparent',
          fill: false
        }
      },
      plugins: {
        datalabels: {
          borderColor: '#0000ff',
          borderWidth: 4,
          display(ctx) {
            return ctx.datasetIndex === 0
              ? ctx.dataIndex % 2 === 0
              : 'auto';
          },
          font: {
            size: 0
          },
          padding: {
            top: 16,
            right: 24,
            bottom: 16,
            left: 24
          },
          rotation: (ctx) => ctx.dataIndex * 42
        }
      }
    }
  },
  options: {
    canvas: {
      height: 320,
      width: 320
    }
  }
};
