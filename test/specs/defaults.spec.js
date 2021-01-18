import {Chart} from 'chart.js';
import plugin from 'chartjs-plugin-datalabels';

describe('defaults.js', function() {
  var expected = {
    align: 'center',
    anchor: 'center',
    backgroundColor: null,
    borderColor: null,
    borderRadius: 0,
    borderWidth: 0,
    clamp: false,
    clip: false,
    color: undefined,
    display: true,
    font: {
      family: undefined,
      lineHeight: 1.2,
      size: undefined,
      style: undefined,
      weight: null
    },
    labels: undefined,
    listeners: {},
    offset: 4,
    opacity: 1,
    padding: {
      top: 4,
      right: 4,
      bottom: 4,
      left: 4
    },
    rotation: 0,
    textAlign: 'start',
    textStrokeColor: undefined,
    textStrokeWidth: 0,
    textShadowBlur: 0,
    textShadowColor: undefined,
    // can't test formatter?!
  };

  jasmine.chart.register(plugin);

  it('should be registered as global plugin options', function() {
    var globals = Chart.defaults.plugins.datalabels;
    expect(globals).toEqual(jasmine.objectContaining(expected));
  });
  it('should be called with default options', function() {
    var spy = spyOn(plugin, 'afterDatasetUpdate');

    var chart = jasmine.chart.acquire({
      type: 'line',
      data: {
        datasets: [{
          data: []
        }]
      }
    });

    expect(spy).toHaveBeenCalled();

    var args = spy.calls.first().args;
    expect(args[0]).toBe(chart);
    expect(args[2]).toEqual(jasmine.objectContaining(expected));
    expect(args[2].formatter).toBe(Chart.defaults.plugins.datalabels.formatter);
  });

  describe('default formatter', function() {
    var formatter = null;

    beforeEach(() => {
      formatter = Chart.defaults.plugins.datalabels.formatter;
    });

    it('should null if value is null or undefined', function() {
      expect(formatter()).toBeNull();
      expect(formatter(null)).toBeNull();
      expect(formatter(undefined)).toBeNull();
    });
    it('should return input strings unchanged', function() {
      expect(formatter('')).toBe('');
      expect(formatter('foo')).toBe('foo');
      expect(formatter('foo\nbar')).toBe('foo\nbar');
    });
    it('should convert numbers and booleans to strings', function() {
      expect(formatter(42)).toBe('42');
      expect(formatter(42.5)).toBe('42.5');
      expect(formatter(true)).toBe('true');
      expect(formatter(false)).toBe('false');
    });
    it('should convert dates to formatted strings', function() {
      var now = new Date();
      expect(typeof formatter(now)).toBe('string');
      expect(formatter(now)).toBe(now.toString());
    });
    it('should return value.label if defined', function() {
      expect(formatter({label: 42, r: 51})).toBe('42');
      expect(formatter({label: 'foo', r: 51})).toBe('foo');
    });
    it('should return value.r if value.label is undefined', function() {
      expect(formatter({r: 42})).toBe('42');
      expect(formatter({r: 'foo'})).toBe('foo');
    });
    it('should return serialized object values if value.label|r are undefined', function() {
      expect(formatter({a: 'foo', b: 42, c: true})).toBe('a: foo, b: 42, c: true');
    });
  });
});
