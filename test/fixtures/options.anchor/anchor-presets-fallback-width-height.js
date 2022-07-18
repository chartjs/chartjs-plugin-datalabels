const Chart = window.Chart;

class TestController extends Chart.DatasetController {
  update(mode) {
    const {data: elements} = this._cachedMeta;
    this.updateElements(elements, 0, elements.length, mode);
  }

  updateElements(elements, start, count, mode) {
    const reset = mode === 'reset';
    const {xScale, yScale} = this._cachedMeta;
    for (let i = start; i < start + count; i++) {
      const parsed = !reset && this.getParsed(i);
      const x = reset ? xScale.getBasePixel() : xScale.getPixelForValue(parsed.x);
      const y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(parsed.y);
      this.updateElement(elements[i], i, {x, y, width: 64, height: 32}, mode);
    }
  }

  draw() {
    for (const element of this._cachedMeta.data) {
      element.draw(this._ctx);
    }
  }
}
TestController.id = 'test';
TestController.defaults = {
  dataElementType: 'testElement'
};

class TestElement extends Chart.Element {
  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
TestElement.id = 'testElement';

Chart.register(TestController, TestElement);

var datasets = [];

var data = [
  {x: 1, y: 1},
  {x: 1, y: 2},
  {x: 2, y: 1},
  {x: 2, y: 2},
];

['start', 'center', 'end'].forEach(function(anchor) {
  datasets.push({
    data: data,
    datalabels: {
      anchor: anchor
    },
    width: 128,
    height: 96
  });
});

export default {
  config: {
    type: 'test',
    data: {
      datasets: datasets
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          min: 0.7,
          max: 2.8
        },
        y: {
          type: 'linear',
          min: 0,
          max: 2.4
        }
      },
      plugins: {
        datalabels: {
          backgroundColor: '#00ff77',
          borderColor: 'black',
          borderWidth: 2,
          font: {
            size: 0
          },
          padding: 8
        }
      }
    }
  },
  options: {
    canvas: {
      width: 256,
      height: 128
    },
    run() {
      Chart.unregister(TestController, TestElement);
    }
  }
};
