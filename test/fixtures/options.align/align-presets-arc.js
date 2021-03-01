var datasets = [];
var data = [];
var inputs = [
  'top',
  'start',
  'left',
  'center',
  'right',
  'end',
  'bottom'
];

for (var i = 0; i < inputs.length; ++i) {
  data.push(1);
}

['end', 'center', 'start'].forEach(function(anchor) {
  datasets.push({
    data: data,
    datalabels: {
      anchor: anchor,
      align: inputs
    }
  });
});

export default {
  config: {
    type: 'doughnut',
    data: {
      datasets: datasets
    },
    options: {
      cutout: '25%',
      layout: {
        padding: 24
      },
      plugins: {
        datalabels: {
          backgroundColor: '#00ff77',
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
      height: 512,
      width: 512
    }
  }
};
