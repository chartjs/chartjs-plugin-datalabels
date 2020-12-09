// https://github.com/chartjs/chartjs-plugin-datalabels/issues/29

export default {
  config: {
    type: 'bar',
    data: {
      labels: [0],
      datasets: [{
        data: [2]
      }, {
        data: [3]
      }, {
        data: [4]
      }, {
        data: [5]
      }]
    },
    options: {
      elements: {
        bar: {
          backgroundColor: '#444',
        }
      },
      layout: {
        padding: 20
      },
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'start',
          backgroundColor: '#fff',
          font: {
            size: 0
          },
          offset: function(context) {
            return context.datasetIndex * 42;
          },
          padding: {
            top: 18,
            right: 48,
            bottom: 18,
            left: 48
          }
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
