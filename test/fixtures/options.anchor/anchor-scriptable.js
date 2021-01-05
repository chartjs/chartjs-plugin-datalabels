export default {
  config: {
    type: 'bar',
    data: {
      labels: [0, 1, 2, 3, 4],
      datasets: [{
        data: [-1, 1, 2, 1, -2],
        datalabels: {
          backgroundColor: '#00ff77'
        }
      }]
    },
    options: {
      plugins: {
        datalabels: {
          anchor: function(context) {
            var data = context.dataset.data[context.dataIndex];
            return data > 1 ? 'start' : data < -1 ? 'end' : 'center';
          },
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
