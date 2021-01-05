export default {
  config: {
    type: 'line',
    data: {
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      datasets: [{
        data: [0, 100, 10, 90, 20, 80, 30, 70, 40, 60, 50],
        datalabels: {
          backgroundColor: '#00ff77'
        }
      }]
    },
    options: {
      layout: {
        padding: 24
      },
      elements: {
        line: {
          backgroundColor: 'transparent',
          borderColor: 'transparent'
        }
      },
      plugins: {
        datalabels: {
          backgroundColor: '#00ff77',
          borderColor: '#0000ff',
          borderWidth: 4,
          color: '#0000ff',
          font: {
            size: 0
          },
          opacity: function(context) {
            var data = context.dataset.data[context.dataIndex];
            return data / 100;
          },
          padding: 8,
          formatter: function() {
            return '\u25AE';
          }
        }
      }
    }
  },
  options: {
    canvas: {
      height: 64,
      width: 512
    }
  }
};
