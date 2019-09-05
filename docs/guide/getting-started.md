# Getting Started

## Installation

### npm

[![npm](https://img.shields.io/npm/v/chartjs-plugin-datalabels.svg?style=flat-square&maxAge=600)](https://npmjs.com/package/chartjs-plugin-datalabels) [![npm downloads](https://img.shields.io/npm/dm/chartjs-plugin-datalabels.svg?style=flat-square&maxAge=600)](https://npmjs.com/package/chartjs-plugin-datalabels)

```
npm install chartjs-plugin-datalabels --save
```

::: tip
This plugin can also be installed using [Bower](https://bower.io/).
:::

### CDN

[![jsdelivr](https://img.shields.io/npm/v/chartjs-plugin-datalabels.svg?label=jsdelivr&style=flat-square&maxAge=600)](https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@latest/dist/) [![jsdelivr hits](https://data.jsdelivr.com/v1/package/npm/chartjs-plugin-datalabels/badge)](https://www.jsdelivr.com/package/npm/chartjs-plugin-datalabels)

By default, `https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels` returns the latest (minified) version, however it's [**highly recommended**](https://www.jsdelivr.com/features) to always specify a version in order to avoid breaking changes. This can be achieved by appending `@{version}` to the url:

```
https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@1.1.2    // exact version
https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@1        // latest 1.x.x
```

Read more about jsDeliver versioning on their [website](http://www.jsdelivr.com/).

### Download

[![github](https://img.shields.io/github/release/chartjs/chartjs-plugin-datalabels.svg?style=flat-square&maxAge=600)](https://github.com/chartjs/chartjs-plugin-datalabels/releases/latest) [![github downloads](https://img.shields.io/github/downloads/chartjs/chartjs-plugin-datalabels/total.svg?style=flat-square&maxAge=600)](http://www.somsubhra.com/github-release-stats/?username=chartjs&repository=chartjs-plugin-datalabels)

You can download the latest version of `chartjs-plugin-datalabels` from the [GitHub releases](https://github.com/chartjs/chartjs-plugin-datalabels/releases/latest):

- `chartjs-plugin-datalabels.js` (recommended for development)
- `chartjs-plugin-datalabels.min.js` (recommended for production)
- `chartjs-plugin-datalabels.zip` (contains `.js` and `.min.js` versions + samples)

## Integration

### HTML

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.7.3/dist/Chart.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@0.7.0"></script>
```

::: warning IMPORTANT
`chartjs-plugin-datalabel` must be loaded **after** the Chart.js library!
:::

Once imported, the plugin is available under the global property `ChartDataLabels`. This is useful to [register/unregister](#registration) the plugin afterward.

### Module

```javascript
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
```

## Registration

**This plugin registers itself [globally](https://www.chartjs.org/docs/latest/developers/plugins.html#global-plugins)**, meaning that once imported, all charts will display labels. In case you want it enabled only for a few charts, you first need to unregister it globally:

```javascript
// NOTE: when imported as a <script> tag, use the global property 'ChartDataLabels'
Chart.plugins.unregister(ChartDataLabels);
```

Then, you can enabled the plugin only for specific charts:

```javascript
var chart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    options: {
        // ...
    }
})
```

See also [Chart.js &rsaquo; Using plugins](https://www.chartjs.org/docs/latest/developers/plugins.html).

::: warning DEPRECATION
From version 1.x, this plugin will no longer be registered automatically (see [#42](https://github.com/chartjs/chartjs-plugin-datalabels/issues/42) for details).
:::

## Configuration

The [plugin options](options.md) can be changed at 3 different levels and are evaluated with the following priority:

- per dataset: `dataset.datalabels.*`
- per chart: `options.plugins.datalabels.*`
- or globally: `Chart.defaults.global.plugins.datalabels.*`

For example:

```javascript
// Change default options for ALL charts
Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
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
