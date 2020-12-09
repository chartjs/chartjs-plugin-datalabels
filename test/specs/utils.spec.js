import utils from '../../src/utils';

describe('utils.js', function() {
  describe('toTextLines', function() {
    var toTextLines = utils.toTextLines;

    it('should return an array containing the input string', function() {
      expect(toTextLines('')).toEqual(['']);
      expect(toTextLines('foo')).toEqual(['foo']);
      expect(toTextLines('foo bar')).toEqual(['foo bar']);
    });
    it('should return an array with converted values', function() {
      expect(toTextLines(null)).toEqual(['null']);
      expect(toTextLines(undefined)).toEqual(['undefined']);
      expect(toTextLines(42)).toEqual(['42']);
      expect(toTextLines(true)).toEqual(['true']);
    });
    it('should return an array of strings if inputs is an array', function() {
      expect(toTextLines([])).toEqual([]);
      expect(toTextLines(['foo'])).toEqual(['foo']);
      expect(toTextLines(['foo', 'bar'])).toEqual(['foo', 'bar']);
    });
    it('should split the input string if it contains \\n', function() {
      expect(toTextLines('foo\nbar')).toEqual(['foo', 'bar']);
      expect(toTextLines('foo\nbar\nbla')).toEqual(['foo', 'bar', 'bla']);
    });
    it('should preserve spaces when splitting strings', function() {
      expect(toTextLines('foo \n bar')).toEqual(['foo ', ' bar']);
      expect(toTextLines('foo \n bar \n bla')).toEqual(['foo ', ' bar ', ' bla']);
    });
    it('should flatten children arrays in the correct order', function() {
      expect(toTextLines(['foo', [['bar', 'xxx'], 'bla']])).toEqual(['foo', 'bar', 'xxx', 'bla']);
    });
    it('should split strings children in the correct order', function() {
      expect(toTextLines(['foo', [['bar\nxxx'], 'bla\nyyy']])).toEqual(['foo', 'bar', 'xxx', 'bla', 'yyy']);
    });
  });

  describe('arrayDiff', function() {
    var arrayDiff = utils.arrayDiff;

    it ('should return an empty array if inputs are also empty', function() {
      expect(arrayDiff([], [])).toEqual([]);
    });
    it ('should return an array of [value, state] with proper state', function() {
      var a0 = [42, 51, 22];
      var a1 = [42, 11];

      expect(arrayDiff(a0, a1)).toEqual([[11, 1], [51, -1], [22, -1]]);
      expect(arrayDiff(a1, a0)).toEqual([[51, 1], [22, 1], [11, -1]]);
      expect(arrayDiff(a0, [])).toEqual([[42, -1], [51, -1], [22, -1]]);
      expect(arrayDiff([], a0)).toEqual([[42, 1], [51, 1], [22, 1]]);
      expect(arrayDiff(a0, a0)).toEqual([]);
    });
    it ('should not modify input arrays', function() {
      var a0 = [42, 51];
      var a1 = [42, 11];

      arrayDiff(a0, a1);

      expect(a0).toEqual([42, 51]);
      expect(a1).toEqual([42, 11]);
    });
    it ('should preserve value references', function() {
      var o0 = {};
      var o1 = {};
      var o2 = {};
      var a0 = [o0];
      var a1 = [o1, o2];
      var diff = arrayDiff(a0, a1);

      expect(diff).toEqual([[o1, 1], [o2, 1], [o0, -1]]);
      expect(diff[0][0]).toBe(o1);
      expect(diff[1][0]).toBe(o2);
      expect(diff[2][0]).toBe(o0);
    });
  });
});
