var labels = [];
var inputs = [];
var count = 20;

for (var i = 0; i < count; ++i) {
  inputs.push(i / count);
  labels.push(1);
}

export default {
  config: {
    type: 'line',
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
          opacity: inputs,
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
      width: 768
    }
  }
};
