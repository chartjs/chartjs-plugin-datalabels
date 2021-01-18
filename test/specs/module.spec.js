import {Chart} from 'chart.js';
import plugin from 'chartjs-plugin-datalabels';

describe('module', function() {
  it ('should be globally exported in ChartDataLabels', function() {
    expect(typeof window.ChartDataLabels).toBe('object');
    expect(window.ChartDataLabels).toBe(plugin);
  });

  it ('should be referenced with id "datalabels"', function() {
    expect(plugin.id).toBe('datalabels');
  });

  // https://github.com/chartjs/chartjs-plugin-datalabels/issues/42
  it ('should not be globally registered', function() {
    expect(Chart.registry.plugins.get('datalabels')).toBeUndefined();
    expect(() => Chart.registry.getPlugin('datalabels')).toThrow();
  });
});
