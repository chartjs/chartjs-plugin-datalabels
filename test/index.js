import Chart from 'chart.js';
import {acquireChart, addMatchers, releaseChart, releaseCharts, specsFromFixtures, triggerMouseEvent} from 'chartjs-test-utils';

// force ratio=1 for tests on high-res/retina devices
window.devicePixelRatio = 1;

jasmine.chart = {
  acquire: acquireChart,
  release: releaseChart,

  // Since version 1.x, this plugin isn't anymore automatically registered on first
  // import. This helper allows to register the given plugin for all specs contained
  // in the describe() block from where this method is called. Note that some tests
  // require the plugin to **not** be registered.
  register: function(plugin) {
    if (Chart.plugins.getAll().includes(plugin)) {
      throw new Error(`Plugin #${plugin.id} is already registered`);
    }

    beforeEach(() => {
      Chart.plugins.register(plugin);
      if (!Chart.plugins.getAll().includes(plugin)) {
        throw new Error(`Failed to register plugin #${plugin.id}`);
      }
    });
    afterEach(() => {
      Chart.plugins.unregister(plugin);
      if (Chart.plugins.getAll().includes(plugin)) {
        throw new Error(`Failed to unregister plugin #${plugin.id}`);
      }
    });
  }
};

jasmine.fixture = {
  specs: specsFromFixtures
};
jasmine.triggerMouseEvent = triggerMouseEvent;

beforeEach(function() {
  addMatchers();

  Chart.helpers.merge(Chart.defaults.global, {
    animation: false,
    legend: {display: false},
    responsive: false,
    title: {display: false},
    tooltips: false,
    elements: {
      arc: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
      },
      point: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
      },
      rectangle: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
      }
    }
  });

  Chart.helpers.merge(Chart.defaults.scale, {
    display: false,
    ticks: {
      beginAtZero: true
    }
  });
});

afterEach(function() {
  releaseCharts();
});
