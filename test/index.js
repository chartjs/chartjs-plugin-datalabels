import {Chart} from 'chart.js';
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
    if (Chart.registry.plugins.get(plugin.id)) {
      throw new Error(`Plugin #${plugin.id} is already registered`);
    }

    beforeEach(() => {
      Chart.register(plugin);
      if (!Chart.registry.plugins.get(plugin.id)) {
        throw new Error(`Failed to register plugin #${plugin.id}`);
      }
    });
    afterEach(() => {
      Chart.unregister(plugin);
      if (Chart.registry.plugins.get(plugin.id)) {
        throw new Error(`Failed to unregister plugin #${plugin.id}`);
      }
    });
  }
};

jasmine.fixture = {
  specs: specsFromFixtures
};
jasmine.triggerMouseEvent = triggerMouseEvent;

beforeAll(() => {
  // Disable colors plugin for tests.
  window.Chart.defaults.plugins.colors.enabled = false;
});

beforeEach(function() {
  addMatchers();

  Chart.defaults.set({
    animation: false,
    responsive: false,
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
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        display: false
      }
    }
  });

  Chart.defaults.set('scale', {
    display: false,
    ticks: {
      beginAtZero: true
    }
  });
});

afterEach(function() {
  releaseCharts();
});
