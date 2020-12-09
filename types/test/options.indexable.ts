import {Chart} from 'chart.js';
import {Options} from '../options';

const options: Options = {
  align: ['bottom', 'center', 'end', 'left', 'right', 'start', 'top', 42],
  anchor: ['center', 'end', 'start'],
  backgroundColor: ['blue', 'red', null],
  borderColor: ['blue', 'red', null],
  borderRadius: [0, 42],
  borderWidth: [0, 42],
  clamp: [false, true],
  clip: [false, true],
  color: ['blue', 'red'],
  display: [false, true],
  font: [{size: 42}, {weight: 200}, {lineHeight: '20%'}],
  labels: {
    foo: {},
    bar: null,
    bla: {
      align: ['bottom', 'center', 'end', 'left', 'right', 'start', 'top', 42],
      anchor: ['center', 'end', 'start'],
      backgroundColor: ['blue', 'red', null],
      borderColor: ['blue', 'red', null],
      borderRadius: [0, 42],
      borderWidth: [0, 42],
      clamp: [false, true],
      clip: [false, true],
      color: ['blue', 'red'],
      display: [false, true],
      font: [{size: 42}, {weight: 200}, {lineHeight: '20%'}],
      offset: [0, 42],
      opacity: [0, 0.42],
      padding: [0, 42, {top: 42}],
      rotation: [0, 42],
      textAlign: ['center', 'end', 'start', 'left', 'right'],
      textStrokeColor: ['blue', 'red'],
      textStrokeWidth: [0, 42],
      textShadowBlur: [0, 42],
      textShadowColor: ['blue', 'red']
    }
  },
  offset: [0, 42],
  opacity: [0, 0.42],
  padding: [0, 42, {top: 42}],
  rotation: [0, 42],
  textAlign: ['center', 'end', 'start', 'left', 'right'],
  textStrokeColor: ['blue', 'red'],
  textStrokeWidth: [0, 42],
  textShadowBlur: [0, 42],
  textShadowColor: ['blue', 'red']
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
