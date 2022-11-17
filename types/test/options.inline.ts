import {Chart, ChartEvent} from 'chart.js';
import {Context} from '../context';

const chart = new Chart('id', {
  type: 'bar',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        datalabels: {
          align: 'start',
          labels: {
            foo: {},
            bar: null,
            bla: {
              align: 'end',
              listeners: {
                click: (ctx: Context, event: ChartEvent) => true
              }
            }
          },
          listeners: {
            click: (ctx: Context, event: ChartEvent) => true
          }
        }
      }
    ]
  },
  options: {
    plugins: {
      datalabels: {
        align: 'start',
        labels: {
          foo: {},
          bar: null,
          bla: {
            align: 'end',
            listeners: {
              click: (ctx: Context, event: ChartEvent) => true
            }
          }
        },
        listeners: {
          click: (ctx: Context, event: ChartEvent) => true
        }
      }
    }
  }
});
