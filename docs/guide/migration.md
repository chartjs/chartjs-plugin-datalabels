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
