import {Chart} from 'chart.js';
import {Context} from '../context';
import {Options} from '../options';

interface CustomContext extends Context {
  foo?: number;
}

const options: Options = {
  rotation: (ctx: CustomContext) => ctx.foo || 0,
  listeners: {
    click: (ctx: CustomContext) => {
      ctx.foo = 42;
    }
  },
};

const chart = new Chart('id', {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        datalabels: options,
      }
    ]
  },
  options: {
    plugins: {
      datalabels: options
    }
  }
});
