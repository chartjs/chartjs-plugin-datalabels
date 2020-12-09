import {Chart} from 'chart.js';
import {Context} from '../context';
import {Options} from '../options';

const options: Options = {
  align: (ctx: Context) => 'end',
  anchor: (ctx: Context) => 'end',
  backgroundColor: (ctx: Context) => 'blue',
  borderColor: (ctx: Context) => 'blue',
  borderRadius: (ctx: Context) => 42,
  borderWidth: (ctx: Context) => 42,
  clamp: (ctx: Context) => false,
  clip: (ctx: Context) => false,
  color: (ctx: Context) => 'blue',
  display: (ctx: Context) => true,
  font: (ctx: Context) => ({size: 42}),
  labels: {
    foo: {},
    bar: null,
    bla: {
      align: (ctx: Context) => 'end',
      anchor: (ctx: Context) => 'end',
      backgroundColor: (ctx: Context) => 'blue',
      borderColor: (ctx: Context) => 'blue',
      borderRadius: (ctx: Context) => 42,
      borderWidth: (ctx: Context) => 42,
      clamp: (ctx: Context) => false,
      clip: (ctx: Context) => false,
      color: (ctx: Context) => 'blue',
      display: (ctx: Context) => true,
      font: (ctx: Context) => ({size: 42}),
      offset: (ctx: Context) => 42,
      opacity: (ctx: Context) => 0.42,
      padding: (ctx: Context) => 42,
      rotation: (ctx: Context) => 42,
      textAlign: (ctx: Context) => 'end',
      textStrokeColor: (ctx: Context) => 'blue',
      textStrokeWidth: (ctx: Context) => 42,
      textShadowBlur: (ctx: Context) => 42,
      textShadowColor: (ctx: Context) => 'blue'
    }
  },
  offset: (ctx: Context) => 42,
  opacity: (ctx: Context) => 0.42,
  padding: (ctx: Context) => 42,
  rotation: (ctx: Context) => 42,
  textAlign: (ctx: Context) => 'end',
  textStrokeColor: (ctx: Context) => 'blue',
  textStrokeWidth: (ctx: Context) => 42,
  textShadowBlur: (ctx: Context) => 42,
  textShadowColor: (ctx: Context) => 'blue',
};

const chart = new Chart('id', {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
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
