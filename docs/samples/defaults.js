import {defaults, helpers} from 'chart.js';

const {merge} = helpers;

merge(defaults.global, {
  legend: {
    display: false
  },
  title: {
    display: false
  },
  tooltips: {
    enabled: false
  }
});
