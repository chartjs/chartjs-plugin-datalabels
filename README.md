# Display labels on data

[![npm](https://img.shields.io/npm/v/chartjs-plugin-datalabels.svg?style=flat-square)](https://npmjs.com/package/chartjs-plugin-datalabels) [![Bower](https://img.shields.io/bower/v/chartjs-plugin-datalabels.svg?style=flat-square)](https://libraries.io/bower/chartjs-plugin-datalabels) [![Travis](https://img.shields.io/travis/chartjs/chartjs-plugin-datalabels.svg?style=flat-square)](https://travis-ci.org/chartjs/chartjs-plugin-datalabels) [![Code Climate](https://img.shields.io/codeclimate/github/chartjs/chartjs-plugin-datalabels.svg?style=flat-square)](https://codeclimate.com/github/chartjs/chartjs-plugin-datalabels)

[Chart.js](http://www.chartjs.org/) plugin prints the value of points on the graph.

Requires [Chart.js](/chartjs/Chart.js/releases) **2.7.0** or later.

## Usage

You can download the latest version of [chartjs-plugin-datalabels on GitHub](https://github.com/chartjs/chartjs-plugin-datalabels/releases/latest)

## Configuration

The plugin options can be changes at 3 different places:

- globally: `Chart.defaults.global.plugins.datalabels.*`
- per chart: `config.options.plugins.datalabels.*`
- per dataset: `dataset.datalabels.*`

Each option is first read from the dataset then, if undefined, from the chart options and finally from the global plugin options. Most options also accept a function called for each data with two arguments: the data `index` and a `context` object currently containing `datasetIndex`, `dataIndex` and `value`. See [`src/options.js`](src/options.js) for available options.

## Development

You first need to install node dependencies (requires [Node.js](https://nodejs.org/)):

```shell
> npm install
```

The following commands will then be available from the repository root:

```shell
> gulp build            // build dist files
> gulp build --watch    // build and watch for changes
> gulp lint             // perform code linting
> gulp package          // create an archive with dist files and samples
```

## License

chartjs-plugin-datalabels is available under the [MIT license](LICENSE.md).
