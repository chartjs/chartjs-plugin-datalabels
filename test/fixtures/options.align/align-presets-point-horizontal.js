var datasets = [];
var inputs = [
  'bottom',
  'start',
  'left',
  'center',
  'right',
  'end',
  'top'
];

['start', 'center', 'end'].forEach(function(anchor, i) {
  inputs.forEach(function(align, j) {
    datasets.push({
      data: [{x: i * 2, y: j * 2}],
      datalabels: {
        align: align,
        anchor: anchor
      }
    });
  });
});

export default {
  config: {
    type: 'bubble',
    data: {
      datasets: datasets
    },
    options: {
      layout: {
        padding: 64
      },
      elements: {
        point: {
          radius: 24
        }
      },
      plugins: {
        datalabels: {
          backgroundColor: '#00ff77',
          borderColor: 'black',
          borderWidth: 2,
          color: 'transparent',
          padding: {
            top: 2,
            bottom: 2,
            left: 8,
            right: 8
          },
          offset: 0,
          formatter: function(v) {
            return v !== null ? '' : null;
          }
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
