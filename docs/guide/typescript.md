# TypeScript

This plugin provides TypeScript type declaration files bundled in the npm package so that types of this plugin options are checked when building your TypeScript project.

## Option Context

The declaration of the [option context](options.md#option-context) is exported as `Context`:

```ts
import {Context} from 'chartjs-plugin-datalabels';

const chart = new Chart('foo', {
  options: {
    plugins: {
      datalabels: {
        rotation: (ctx: Context) => {
          return ctx.dataIndex % 2 ? 180 : 0;
        },
      }
    }
  }
});
```

Extending this context can be done using one of the following methods:

### Custom Interface

```ts
import {Context} from 'chartjs-plugin-datalabels';

interface FooContext extends Context {
  foo?: number;
}

const chart = new Chart('foo', {
  options: {
    plugins: {
      datalabels: {
        rotation: (ctx: FooContext) => ctx.foo || 0,
        listeners: {
          click: (ctx: FooContext) => {
            ctx.foo += (ctx.foo || 0) + 10;
            return true;
          }
        }
      }
    }
  }
});
```

::: tip
This method allows to declare different context interfaces to use in different charts.
:::

### Module Augmentation

```ts
// shims-chartjs-plugin-datalabels.d.ts
import {Context} from 'chartjs-plugin-datalabels';

declare module 'chartjs-plugin-datalabels' {
  interface Context {
    foo?: number;
  }
}
```

```ts
// index.ts
const chart = new Chart('foo', {
  options: {
    plugins: {
      datalabels: {
        rotation: (ctx: Context) => ctx.foo || 0,
        listeners: {
          click: (ctx: Context) => {
            ctx.foo += (ctx.foo || 0) + 10;
            return true;
          }
        }
      }
    }
  }
});
```
::: warning
The augmented `Context` declaration will be the same for all charts. This method should be considered only if all charts should share the same context declaration. Read more about [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).
:::
