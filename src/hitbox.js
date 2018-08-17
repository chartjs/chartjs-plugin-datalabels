'use strict';

import Chart from 'chart.js';
import utils from './utils';

var doPolygonsIntersect = utils.doPolygonsIntersect;
var rotatePolygon = utils.rotatePolygon;
var helpers = Chart.helpers;

var HitBox = function() {
	this._rect = null;
	this._rotation = 0;
};

helpers.extend(HitBox.prototype, {
	update: function(center, rect, rotation) {
		var margin = 1;
		var cx = center.x;
		var cy = center.y;
		var x = cx + rect.x;
		var y = cy + rect.y;

		this._rotation = rotation;
		this._rect = {
			x0: x - margin,
			y0: y - margin,
			x1: x + rect.w + margin * 2,
			y1: y + rect.h + margin * 2,
			cx: cx,
			cy: cy,
		};
	},

	contains: function(x, y) {
		var me = this;
		var rect = me._rect;
		var cx, cy, r, rx, ry;

		if (!rect) {
			return false;
		}

		cx = rect.cx;
		cy = rect.cy;
		r = me._rotation;
		rx = cx + (x - cx) * Math.cos(r) + (y - cy) * Math.sin(r);
		ry = cy - (x - cx) * Math.sin(r) + (y - cy) * Math.cos(r);

		return !(rx < rect.x0
			|| ry < rect.y0
			|| rx > rect.x1
			|| ry > rect.y1);
	},

	overlap: function(hitbox) {
		var me = this;

		if (!hitbox._rect || !me._rect) {
			return false;
		}

		var firstPolygon = [{x: me._rect.x0, y: me._rect.y0}, {x: me._rect.x0, y: me._rect.y1}, {x: me._rect.x1, y: me._rect.y1}, {x: me._rect.x1, y: me._rect.y0}];
		var secondPolygon = [{x: hitbox._rect.x0, y: hitbox._rect.y0}, {x: hitbox._rect.x0, y: hitbox._rect.y1}, {x: hitbox._rect.x1, y: hitbox._rect.y1}, {x: hitbox._rect.x1, y: hitbox._rect.y0}];

		firstPolygon = rotatePolygon(me._rect.cx, me._rect.cy, firstPolygon, me._rotation);
		secondPolygon = rotatePolygon(hitbox._rect.cx, hitbox._rect.cy, secondPolygon, hitbox._rotation);

		return doPolygonsIntersect(firstPolygon, secondPolygon);
	}
});

export default HitBox;
