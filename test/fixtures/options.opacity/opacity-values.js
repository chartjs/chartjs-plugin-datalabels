var datasets = [];
var inputs = [-0.5, 0, 0.25, 0.5, 0.75, 1, 1.5];

inputs.forEach(function(opacity, j) {
  datasets.push({
    data: [{x: j, y: 0}],
    datalabels: {
      opacity: opacity
    }
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
        padding: 24
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
      height: 48,
      width: 512
    }
  }
};
