# Introduction

Highly customizable [Chart.js](https://www.chartjs.org/) plugin that displays labels on data for any type of charts.

::: warning COMPATIBILITY NOTE
Requires [Chart.js](https://github.com/chartjs/Chart.js/releases) **3.x** or higher.
:::

::: danger IMPORTANT
This plugin doesn't provide any public API (except the plugin options), thus you should **not** access private properties or methods starting with `$` or `_`, including the `$datalabels` attached property. The implementation can change at any version and could break your production build without notice in upcoming minor/patch releases if any of your code relies on it.
:::

## Table of Contents

* [Getting Started](getting-started.md)
* [Options](options.md)
* [Labels](labels.md)
* [Positioning](positioning.md)
* [Formatting](formatting.md)
* [Events](events.md)
* [TypeScript](typescript)
* [Migration](migration)
* [Samples](../samples)

## License

`chartjs-plugin-datalabels` is available under the [MIT license](https://github.com/chartjs/chartjs-plugin-datalabels/blob/master/LICENSE.md).
