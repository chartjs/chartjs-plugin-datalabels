import {Chart} from 'chart.js';
import {Options} from '../options';

const options: Options = {
  // all optional datalabels options
};

const chart = new Chart('id', {
  data: {
    datasets: [
      {
        datalabels: options
      }
    ]
  },
  options: {
    plugins: {
      datalabels: options
    }
  }
});
