import Chart from 'chart.js';
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

	describe('toFontString', function() {
		var toFontString = utils.toFontString;

		it('should return null if the given font is invalid', function() {
			expect(toFontString({})).toBeNull();
			expect(toFontString(null)).toBeNull();
			expect(toFontString(undefined)).toBeNull();
			expect(toFontString(42)).toBeNull();
			expect(toFontString('foo')).toBeNull();
			expect(toFontString(new Date())).toBeNull();
		});
		it('should return null if size or family are missing', function() {
			expect(toFontString({style: 'italic', weight: 300, size: 12})).toBeNull();
			expect(toFontString({style: 'italic', weight: 300, family: 'serif'})).toBeNull();
		});
		it('should return the string representation of the given font', function() {
			expect(toFontString({style: 'italic', weight: 300, size: 12, family: 'serif'})).toBe('italic 300 12px serif');
		});
		it('weigth and style should be optional', function() {
			expect(toFontString({size: 12, family: 'serif'})).toBe('12px serif');
			expect(toFontString({style: 'italic', size: 12, family: 'serif'})).toBe('italic 12px serif');
			expect(toFontString({weight: 300, size: 12, family: 'serif'})).toBe('300 12px serif');
		});
	});

	describe('parseFont', function() {
		var parseFont = utils.parseFont;

		it ('should return a font with default values', function() {
			var global = Chart.defaults.global;

			Chart.defaults.global = {
				defaultFontFamily: 'foobar',
				defaultFontSize: 42,
				defaultFontStyle: 'xxxyyy'
			};

			expect(parseFont({})).toEqual({
				family: 'foobar',
				lineHeight: 50.4,
				size: 42,
				string: 'xxxyyy 42px foobar',
				style: 'xxxyyy',
				weight: null
			});

			Chart.defaults.global = global;
		});
		it ('should return a font with given values', function() {
			expect(parseFont({
				family: 'bla',
				lineHeight: 8,
				size: 21,
				style: 'zzz',
				weight: 400
			})).toEqual({
				family: 'bla',
				lineHeight: 8 * 21,
				size: 21,
				string: 'zzz 400 21px bla',
				style: 'zzz',
				weight: 400
			});
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

	describe('roundedRect', function() {
		it('should create a rounded rectangle path', function() {
			var context = window.createMockContext();

			utils.roundedRect(context, 10, 20, 30, 40, 5);

			expect(context.getCalls()).toEqual([
				{name: 'moveTo', args: [10, 25]},
				{name: 'arc', args: [15, 25, 5, -Math.PI, -Math.PI / 2]},
				{name: 'arc', args: [35, 25, 5, -Math.PI / 2, 0]},
				{name: 'arc', args: [35, 55, 5, 0, Math.PI / 2]},
				{name: 'arc', args: [15, 55, 5, Math.PI / 2, Math.PI]},
				{name: 'closePath', args: []},
				{name: 'moveTo', args: [10, 20]}
			]);
		});
		it('should optimize path if radius is exactly half of height', function() {
			var context = window.createMockContext();

			utils.roundedRect(context, 10, 20, 40, 30, 15);

			expect(context.getCalls()).toEqual([
				{name: 'moveTo', args: [10, 35]},
				{name: 'moveTo', args: [25, 20]},
				{name: 'arc', args: [35, 35, 15, -Math.PI / 2, Math.PI / 2]},
				{name: 'arc', args: [25, 35, 15, Math.PI / 2, Math.PI * 3 / 2]},
				{name: 'closePath', args: []},
				{name: 'moveTo', args: [10, 20]}
			]);
		});
		it('should optimize path if radius is exactly half of width', function() {
			var context = window.createMockContext();

			utils.roundedRect(context, 10, 20, 30, 40, 15);

			expect(context.getCalls()).toEqual([
				{name: 'moveTo', args: [10, 35]},
				{name: 'arc', args: [25, 35, 15, -Math.PI, 0]},
				{name: 'arc', args: [25, 45, 15, 0, Math.PI]},
				{name: 'closePath', args: []},
				{name: 'moveTo', args: [10, 20]}
			]);
		});
		it('should optimize path if radius is exactly half of width and height', function() {
			var context = window.createMockContext();

			utils.roundedRect(context, 10, 20, 30, 30, 15);

			expect(context.getCalls()).toEqual([
				{name: 'moveTo', args: [10, 35]},
				{name: 'arc', args: [25, 35, 15, -Math.PI, Math.PI]},
				{name: 'closePath', args: []},
				{name: 'moveTo', args: [10, 20]}
			]);
		});
		it('should optimize path if radius is 0', function() {
			var context = window.createMockContext();

			utils.roundedRect(context, 10, 20, 30, 40, 0);

			expect(context.getCalls()).toEqual([{name: 'rect', args: [10, 20, 30, 40]}]);
		});
	});
});
