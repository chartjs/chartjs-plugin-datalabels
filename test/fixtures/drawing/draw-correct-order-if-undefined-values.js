// https://github.com/chartjs/chartjs-plugin-datalabels/issues/319

export default {
  config: {
    type: 'radar',
    data: {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [
        {
          label: 'Series 1',
          data: [5, 5, 5, 5, 5],
          backgroundColor: 'red',
          borderWidth: 5,
          fill: false,
          borderColor: 'red',
          datalabels: {
            backgroundColor: 'red',
          }
        },
        {
          label: 'Series 2',
          data: [4.9, 4.9, null, 4.9, 4.9],
          backgroundColor: 'blue',
          borderWidth: 5,
          fill: false,
          borderColor: 'blue',
          datalabels: {
            backgroundColor: 'blue',
          }
        }
      ]
    },
    options: {
      layout: {
        padding: 20
      },
      scales: {
        r: {
          display: false,
          min: 1,
          max: 5
        },
      },
      plugins: {
        datalabels: {
          color: 'white',
          padding: 10,
          borderRadius: 20
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
