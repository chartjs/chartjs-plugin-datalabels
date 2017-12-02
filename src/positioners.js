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

function aligned(x, y, vx, vy, align) {
	switch (align) {
	case 'center':
		vx = vy = 0;
		break;
	case 'bottom':
		vx = 0;
		vy = 1;
		break;
	case 'right':
		vx = 1;
		vy = 0;
		break;
	case 'left':
		vx = -1;
		vy = 0;
		break;
	case 'top':
		vx = 0;
		vy = -1;
		break;
	case 'start':
		vx = -vx;
		vy = -vy;
		break;
	case 'end':
		// keep the natural orientation
		break;
	default:
		// clockwise rotation (in degree)
		align *= (Math.PI / 180);
		vx = Math.cos(align);
		vy = Math.sin(align);
		break;
	}

	return {
		x: x,
		y: y,
		vx: vx,
		vy: vy
	};
}

export default {
	arc: function(vm, anchor, align) {
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

		return aligned(
			vm.x + vx * d,
			vm.y + vy * d,
			vx,
			vy,
			align);
	},

	point: function(vm, anchor, align, origin) {
		var v = orient(vm, origin);
		var r = vm.radius;
		var d = 0;

		if (anchor === 'start') {
			d = -r;
		} else if (anchor === 'end') {
			d = r;
		}

		return aligned(
			vm.x + v.x * d,
			vm.y + v.y * d,
			v.x,
			v.y,
			align);
	},

	rect: function(vm, anchor, align, origin) {
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

		return aligned(
			x,
			y,
			v.x,
			v.y,
			align);
	},

	fallback: function(vm, anchor, align, origin) {
		var v = orient(vm, origin);
		return aligned(
			vm.x,
			vm.y,
			v.x,
			v.y,
			align);
	}
};
