# Migration

## Migrating to v1.0.0

### Breaking Changes

#### Explicit Plugin Registration

As described in the [getting started](getting-started.md#integration), it's now required to manually register this plugin, either globally:

```js
Chart.plugins.register(ChartDataLabels);
```

or locally:

```js
new Chart('foo', {
  plugins: [ChartDataLabels]
})
```

See [chartjs-plugin-datalabels#42](https://github.com/chartjs/chartjs-plugin-datalabels/issues/42) for rationale behind this change.

#### Extending the Option Context <Badge text="TS only"/>

In order to extend the [option context](options.md#option-context), you now need to use one of the methods described [in this section](typescript.md#option-context). Peviously, this feature relied on the use of `any`. If for whatever reasons you need that flexibility, the old behavior can be achieved using:

```ts
import {Context} from 'chartjs-plugin-datalabels';

// OLD BEHAVIOR: NOT RECOMMENDED!
declare module 'chartjs-plugin-datalabels' {
  interface Context {
    [key: string]: any;
  }
}
```

## Migrating to v2.0.0

### Breaking Changes

Make sure to also read the [Chart.js v3 migration guide](https://www.chartjs.org/docs/latest/getting-started/v3-migration.html) since you may be impacted by more general breaking changes due to this new Chart.js version.

#### Plugin registration

Chart.js v3 changed the way to register plugins and now requires to use `Chart.register(plugin)` instead of `Chart.plugins.register(plugin)`.

```js
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);
```

See [Getting Started > Registration](getting-started.html#registration) for details.

#### Default options

The plugin default options are now accessible in `Chart.defaults.plugins.datalabels.*` instead of `Chart.defaults.global.plugins.datalabels.*` and can be modified using:

```js
Chart.defaults.set('plugins.datalabels', {
  color: 'blue',
  // ...
})
```

See [Getting Started > Configuration](getting-started.html#configuration) for details.

### Notes

#### Chart.js type declaration <Badge text="TS only"/>

Chart.js v3 now provides TypeScript type declaration files bundled in the npm package so it's **not** anymore required to install the `@types/chart.js` package.
