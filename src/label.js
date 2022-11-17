import {ArcElement, BarElement, defaults, PointElement} from 'chart.js';
import {
  callback as callbackHelper,
  isNullOrUndef,
  merge,
  resolve,
  toFont,
  toPadding,
  valueOrDefault
} from 'chart.js/helpers';

import utils from './utils';
import positioners from './positioners';

var rasterize = utils.rasterize;

function boundingRects(model) {
  var borderWidth = model.borderWidth || 0;
  var padding = model.padding;
  var th = model.size.height;
  var tw = model.size.width;
  var tx = -tw / 2;
  var ty = -th / 2;

  return {
    frame: {
      x: tx - padding.left - borderWidth,
      y: ty - padding.top - borderWidth,
      w: tw + padding.width + borderWidth * 2,
      h: th + padding.height + borderWidth * 2
    },
    text: {
      x: tx,
      y: ty,
      w: tw,
      h: th
    }
  };
}

function getScaleOrigin(el, context) {
  var scale = context.chart.getDatasetMeta(context.datasetIndex).vScale;

  if (!scale) {
    return null;
  }

  if (scale.xCenter !== undefined && scale.yCenter !== undefined) {
    return {x: scale.xCenter, y: scale.yCenter};
  }

  var pixel = scale.getBasePixel();
  return el.horizontal ?
    {x: pixel, y: null} :
    {x: null, y: pixel};
}

function getPositioner(el) {
  if (el instanceof ArcElement) {
    return positioners.arc;
  }
  if (el instanceof PointElement) {
    return positioners.point;
  }
  if (el instanceof BarElement) {
    return positioners.bar;
  }
  return positioners.fallback;
}

function drawRoundedRect(ctx, x, y, w, h, radius) {
  var HALF_PI = Math.PI / 2;

  if (radius) {
    var r = Math.min(radius, h / 2, w / 2);
    var left = x + r;
    var top = y + r;
    var right = x + w - r;
    var bottom = y + h - r;

    ctx.moveTo(x, top);
    if (left < right && top < bottom) {
      ctx.arc(left, top, r, -Math.PI, -HALF_PI);
      ctx.arc(right, top, r, -HALF_PI, 0);
      ctx.arc(right, bottom, r, 0, HALF_PI);
      ctx.arc(left, bottom, r, HALF_PI, Math.PI);
    } else if (left < right) {
      ctx.moveTo(left, y);
      ctx.arc(right, top, r, -HALF_PI, HALF_PI);
      ctx.arc(left, top, r, HALF_PI, Math.PI + HALF_PI);
    } else if (top < bottom) {
      ctx.arc(left, top, r, -Math.PI, 0);
      ctx.arc(left, bottom, r, 0, Math.PI);
    } else {
      ctx.arc(left, top, r, -Math.PI, Math.PI);
    }
    ctx.closePath();
    ctx.moveTo(x, y);
  } else {
    ctx.rect(x, y, w, h);
  }
}

function drawFrame(ctx, rect, model) {
  var bgColor = model.backgroundColor;
  var borderColor = model.borderColor;
  var borderWidth = model.borderWidth;

  if (!bgColor && (!borderColor || !borderWidth)) {
    return;
  }

  ctx.beginPath();

  drawRoundedRect(
    ctx,
    rasterize(rect.x) + borderWidth / 2,
    rasterize(rect.y) + borderWidth / 2,
    rasterize(rect.w) - borderWidth,
    rasterize(rect.h) - borderWidth,
    model.borderRadius);

  ctx.closePath();

  if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fill();
  }

  if (borderColor && borderWidth) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.lineJoin = 'miter';
    ctx.stroke();
  }
}

function textGeometry(rect, align, font) {
  var h = font.lineHeight;
  var w = rect.w;
  var x = rect.x;
  var y = rect.y + h / 2;

  if (align === 'center') {
    x += w / 2;
  } else if (align === 'end' || align === 'right') {
    x += w;
  }

  return {
    h: h,
    w: w,
    x: x,
    y: y
  };
}

function drawTextLine(ctx, text, cfg) {
  var shadow = ctx.shadowBlur;
  var stroked = cfg.stroked;
  var x = rasterize(cfg.x);
  var y = rasterize(cfg.y);
  var w = rasterize(cfg.w);

  if (stroked) {
    ctx.strokeText(text, x, y, w);
  }

  if (cfg.filled) {
    if (shadow && stroked) {
      // Prevent drawing shadow on both the text stroke and fill, so
      // if the text is stroked, remove the shadow for the text fill.
      ctx.shadowBlur = 0;
    }

    ctx.fillText(text, x, y, w);

    if (shadow && stroked) {
      ctx.shadowBlur = shadow;
    }
  }
}

function drawText(ctx, lines, rect, model) {
  var align = model.textAlign;
  var color = model.color;
  var filled = !!color;
  var font = model.font;
  var ilen = lines.length;
  var strokeColor = model.textStrokeColor;
  var strokeWidth = model.textStrokeWidth;
  var stroked = strokeColor && strokeWidth;
  var i;

  if (!ilen || (!filled && !stroked)) {
    return;
  }

  // Adjust coordinates based on text alignment and line height
  rect = textGeometry(rect, align, font);

  ctx.font = font.string;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = model.textShadowBlur;
  ctx.shadowColor = model.textShadowColor;

  if (filled) {
    ctx.fillStyle = color;
  }
  if (stroked) {
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
  }

  for (i = 0, ilen = lines.length; i < ilen; ++i) {
    drawTextLine(ctx, lines[i], {
      stroked: stroked,
      filled: filled,
      w: rect.w,
      x: rect.x,
      y: rect.y + rect.h * i
    });
  }
}

var Label = function(config, ctx, el, index) {
  var me = this;

  me._config = config;
  me._index = index;
  me._model = null;
  me._rects = null;
  me._ctx = ctx;
  me._el = el;
};

merge(Label.prototype, {
  /**
   * @private
   */
  _modelize: function(display, lines, config, context) {
    var me = this;
    var index = me._index;
    var font = toFont(resolve([config.font, {}], context, index));
    var color = resolve([config.color, defaults.color], context, index);

    return {
      align: resolve([config.align, 'center'], context, index),
      anchor: resolve([config.anchor, 'center'], context, index),
      area: context.chart.chartArea,
      backgroundColor: resolve([config.backgroundColor, null], context, index),
      borderColor: resolve([config.borderColor, null], context, index),
      borderRadius: resolve([config.borderRadius, 0], context, index),
      borderWidth: resolve([config.borderWidth, 0], context, index),
      clamp: resolve([config.clamp, false], context, index),
      clip: resolve([config.clip, false], context, index),
      color: color,
      display: display,
      font: font,
      lines: lines,
      offset: resolve([config.offset, 4], context, index),
      opacity: resolve([config.opacity, 1], context, index),
      origin: getScaleOrigin(me._el, context),
      padding: toPadding(resolve([config.padding, 4], context, index)),
      positioner: getPositioner(me._el),
      rotation: resolve([config.rotation, 0], context, index) * (Math.PI / 180),
      size: utils.textSize(me._ctx, lines, font),
      textAlign: resolve([config.textAlign, 'start'], context, index),
      textShadowBlur: resolve([config.textShadowBlur, 0], context, index),
      textShadowColor: resolve([config.textShadowColor, color], context, index),
      textStrokeColor: resolve([config.textStrokeColor, color], context, index),
      textStrokeWidth: resolve([config.textStrokeWidth, 0], context, index)
    };
  },

  update: function(context) {
    var me = this;
    var model = null;
    var rects = null;
    var index = me._index;
    var config = me._config;
    var value, label, lines;

    // We first resolve the display option (separately) to avoid computing
    // other options in case the label is hidden (i.e. display: false).
    var display = resolve([config.display, true], context, index);

    if (display) {
      value = context.dataset.data[index];
      label = valueOrDefault(callbackHelper(config.formatter, [value, context]), value);
      lines = isNullOrUndef(label) ? [] : utils.toTextLines(label);

      if (lines.length) {
        model = me._modelize(display, lines, config, context);
        rects = boundingRects(model);
      }
    }

    me._model = model;
    me._rects = rects;
  },

  geometry: function() {
    return this._rects ? this._rects.frame : {};
  },

  rotation: function() {
    return this._model ? this._model.rotation : 0;
  },

  visible: function() {
    return this._model && this._model.opacity;
  },

  model: function() {
    return this._model;
  },

  draw: function(chart, center) {
    var me = this;
    var ctx = chart.ctx;
    var model = me._model;
    var rects = me._rects;
    var area;

    if (!this.visible()) {
      return;
    }

    ctx.save();

    if (model.clip) {
      area = model.area;
      ctx.beginPath();
      ctx.rect(
        area.left,
        area.top,
        area.right - area.left,
        area.bottom - area.top);
      ctx.clip();
    }

    ctx.globalAlpha = utils.bound(0, model.opacity, 1);
    ctx.translate(rasterize(center.x), rasterize(center.y));
    ctx.rotate(model.rotation);

    drawFrame(ctx, rects.frame, model);
    drawText(ctx, model.lines, rects.text, model);

    ctx.restore();
  }
});

export default Label;
