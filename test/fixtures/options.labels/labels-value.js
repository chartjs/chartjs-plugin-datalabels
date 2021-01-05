export default {
  config: {
    type: 'line',
    data: {
      labels: [0],
      datasets: [{
        data: [0],
        datalabels: {
          // Fallback to global `labels` option.
          // labels: undefined
        }
      }, {
        data: [1],
        datalabels: {
          // Fallback to global `labels` option.
          labels: {}
        }
      }, {
        data: [2],
        datalabels: {
          // Overrides global `labels`.
          labels: {
            foo: {
              backgroundColor: '#800'
            },
            bar: {
              backgroundColor: '#080'
            }
          }
        }
      }, {
        data: [3],
        datalabels: {
          // Removes the `bar` label.
          labels: {
            bar: null
          }
        }
      }, {
        data: [4],
        datalabels: {
          // Removes all labels
          labels: {
            foo: null,
            bar: null
          }
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
          padding: 8,
          labels: {
            foo: {
              backgroundColor: '#00f',
              borderColor: '#f0f'
            },
            bar: {
              align: 'right',
              backgroundColor: '#0ff',
              borderColor: '#fff',
              offset: 20
            }
          }
        }
      }
    }
  },
  options: {
    canvas: {
      height: 192,
      width: 64
    }
  }
};
