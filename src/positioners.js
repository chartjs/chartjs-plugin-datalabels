'use strict';

function orient(point, origin) {
	var x0 = origin.x;
	var y0 = origin.y;

	if (x0 === null) {
		return {x: 0, y: -1};
	}
	if (y0 === null) {
		return {x: 1, y: 0};
	}

	var dx = point.x - x0;
	var dy = point.y - y0;
	var ln = Math.sqrt(dx * dx + dy * dy);
	return {
		x: ln ? dx / ln : 0,
		y: ln ? dy / ln : -1
	};
}

export default {
	arc: function(vm, anchor) {
		var angle = (vm.startAngle + vm.endAngle) / 2;
		var vx = Math.cos(angle);
		var vy = Math.sin(angle);
		var r0 = vm.innerRadius;
		var r1 = vm.outerRadius;
		var d;

		if (anchor === 'start') {
			d = r0;
		} else if (anchor === 'end') {
			d = r1;
		} else {
			d = (r0 + r1) / 2;
		}

		return {
			x: vm.x + vx * d,
			y: vm.y + vy * d,
			vx: vx,
			vy: vy
		};
	},

	point: function(vm, anchor, origin) {
		var v = orient(vm, origin);
		var r = vm.radius;
		var d = 0;

		if (anchor === 'start') {
			d = -r;
		} else if (anchor === 'end') {
			d = r;
		}

		return {
			x: vm.x + v.x * d,
			y: vm.y + v.y * d,
			vx: v.x,
			vy: v.y
		};
	},

	rect: function(vm, anchor, origin) {
		var horizontal = vm.horizontal;
		var size = Math.abs(vm.base - (horizontal ? vm.x : vm.y));
		var x = horizontal ? Math.min(vm.x, vm.base) : vm.x;
		var y = horizontal ? vm.y : Math.min(vm.y, vm.base);
		var v = orient(vm, origin);

		if (anchor === 'center') {
			if (horizontal) {
				x += size / 2;
			} else {
				y += size / 2;
			}
		} else if (anchor === 'start' && !horizontal) {
			y += size;
		} else if (anchor === 'end' && horizontal) {
			x += size;
		}

		return {
			x: x,
			y: y,
			vx: v.x,
			vy: v.y
		};
	},

	fallback: function(vm, anchor, origin) {
		var v = orient(vm, origin);
		return {
			x: vm.x,
			y: vm.y,
			vx: v.x,
			vy: v.y
		};
	}
};
