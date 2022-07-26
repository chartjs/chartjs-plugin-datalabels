import {Chart, ChartEvent} from 'chart.js';
import {Context} from '../context';
import {Options} from '../options';

const options: Options = {
  align: 'start',
  anchor: 'start',
  backgroundColor: 'blue',
  borderColor: 'blue',
  borderRadius: 42,
  borderWidth: 42,
  clamp: false,
  clip: false,
  color: 'blue',
  display: true,
  font: {
    family: 'foo',
    lineHeight: 1.42,
    size: 42,
    style: 'italic',
    weight: 200
  },
  formatter: (v: string, ctx: Context) => ctx.active ? '' + v : null,
  labels: {
    foo: {},
    bar: null,
    bla: {
      align: 'end',
      anchor: 'end',
      backgroundColor: 'blue',
      borderColor: 'blue',
      borderRadius: 42,
      borderWidth: 42,
      clamp: false,
      clip: false,
      color: 'blue',
      display: true,
      font: {
        family: 'foo',
        lineHeight: 1.42,
        size: 42,
        style: 'italic',
        weight: 200
      },
      offset: 42,
      opacity: 0.42,
      listeners: {
        click: (ctx: Context, event: ChartEvent) => true,
        enter: (ctx: Context, event: ChartEvent) => false,
        leave: (ctx: Context, event: ChartEvent) => {
          // return void
        }
      },
      padding: {
        top: 42,
        right: 42,
        bottom: 42,
        left: 42
      },
      rotation: 42,
      textAlign: 'end',
      textStrokeColor: 'blue',
      textStrokeWidth: 42,
      textShadowBlur: 42,
      textShadowColor: 'blue'
    }
  },
  listeners: {
    click: (ctx: Context) => true,
    enter: (ctx: Context) => false,
    leave: (ctx: Context) => {
      // return void
    }
  },
  offset: 42,
  opacity: 0.42,
  padding: {
    top: 42,
    right: 42,
    bottom: 42,
    left: 42
  },
  rotation: 42,
  textAlign: 'start',
  textStrokeColor: 'blue',
  textStrokeWidth: 42,
  textShadowBlur: 42,
  textShadowColor: 'blue'
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
