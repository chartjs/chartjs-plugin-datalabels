var labels = [];
var inputs = [
  'top',
  'end',
  'left',
  'center',
  'right',
  'start',
  'bottom',
  45,
  -45
];

for (var i = 0; i < inputs.length; ++i) {
  labels.push(1);
}

export default {
  config: {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: labels,
        datalabels: {
          backgroundColor: '#00ff77'
        }
      }]
    },
    options: {
      layout: {
        padding: 20
      },
      plugins: {
        datalabels: {
          align: function(context) {
            return inputs[context.dataIndex];
          },
          anchor: 'start',
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
      height: 128,
      width: 320
    }
  }
};
