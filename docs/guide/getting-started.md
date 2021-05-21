# Getting Started

## Installation

### npm

[![npm](https://img.shields.io/npm/v/chartjs-plugin-datalabels.svg?style=flat-square&maxAge=600)](https://npmjs.com/package/chartjs-plugin-datalabels) [![npm downloads](https://img.shields.io/npm/dm/chartjs-plugin-datalabels.svg?style=flat-square&maxAge=600)](https://npmjs.com/package/chartjs-plugin-datalabels)

```sh
npm install chartjs-plugin-datalabels --save
```

::: tip
This plugin can also be installed using [Bower](https://bower.io/).
:::

### CDN

[![jsdelivr](https://img.shields.io/npm/v/chartjs-plugin-datalabels.svg?label=jsdelivr&style=flat-square&maxAge=600)](https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@latest/dist/) [![jsdelivr hits](https://data.jsdelivr.com/v1/package/npm/chartjs-plugin-datalabels/badge)](https://www.jsdelivr.com/package/npm/chartjs-plugin-datalabels)

By default, `https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels` returns the latest (minified) version, however it's [**highly recommended**](https://www.jsdelivr.com/features) to always specify a version in order to avoid breaking changes. This can be achieved by appending `@{version}` to the url:

```
https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0    // exact version
https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2        // latest 2.x.x
```

Read more about jsDeliver versioning on their [website](https://www.jsdelivr.com/).

### Download

[![github](https://img.shields.io/github/release/chartjs/chartjs-plugin-datalabels.svg?style=flat-square&maxAge=600)](https://github.com/chartjs/chartjs-plugin-datalabels/releases/latest) [![github downloads](https://img.shields.io/github/downloads/chartjs/chartjs-plugin-datalabels/total.svg?style=flat-square&maxAge=600)](https://somsubhra.github.io/github-release-stats/?username=chartjs&repository=chartjs-plugin-datalabels)

You can download the latest version of `chartjs-plugin-datalabels` from the [GitHub releases](https://github.com/chartjs/chartjs-plugin-datalabels/releases/latest):

- `chartjs-plugin-datalabels.js` (recommended for development)
- `chartjs-plugin-datalabels.min.js` (recommended for production)
- `chartjs-plugin-datalabels.esm.js`
- `chartjs-plugin-datalabels.tgz` (contains all builds)
- `chartjs-plugin-datalabels.zip` (contains all builds)

## Integration

### HTML

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@3.0.0/dist/chart.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
```

::: warning IMPORTANT
`chartjs-plugin-datalabels` must be loaded **after** the Chart.js library!
:::

Once loaded, the plugin, available under the global `ChartDataLabels` property, needs to be [registered](#registration).

### Module

```javascript
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
```

Once imported, the plugin needs to be [registered](#registration).

## Registration

Since version 1.x, this plugin **no longer registers itself automatically**. It must be manually registered either globally or locally (see [#42](https://github.com/chartjs/chartjs-plugin-datalabels/issues/42) for the rationale).

```javascript
// Register the plugin to all charts:
Chart.register(ChartDataLabels);
```

```javascript
// OR only to specific charts:
var chart = new Chart(ctx, {
  plugins: [ChartDataLabels],
  options: {
    // ...
  }
})
```
::: tip
When imported via a [`<script>` tag](#html), use the global property `ChartDataLabels`.
:::

See also [Chart.js &rsaquo; Using plugins](https://www.chartjs.org/docs/latest/developers/plugins.html).

## Configuration

The [plugin options](options.md) can be changed at 3 different levels and are evaluated with the following priority:

- per dataset: `dataset.datalabels.*`
- per chart: `options.plugins.datalabels.*`
- or globally: `Chart.defaults.plugins.datalabels.*`

For example:

```javascript
// Change default options for ALL charts
Chart.defaults.set('plugins.datalabels', {
  color: '#FE777B'
});

var chart = new Chart(ctx, {
  options: {
    plugins: {
      // Change options for ALL labels of THIS CHART
      datalabels: {
        color: '#36A2EB'
      }
    }
  },
  data: {
    datasets: [{
      // Change options only for labels of THIS DATASET
      datalabels: {
        color: '#FFCE56'
      }
    }]
  }
});
```
