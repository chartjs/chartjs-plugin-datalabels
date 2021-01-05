import {Options} from './options';

declare module 'chart.js' {
  interface ChartDataSets {
    /**
     * Per dataset datalabels plugin options.
     * @since 0.1.0
     */
    datalabels?: Options;
  }

  interface ChartPluginsOptions {
    /**
     * Per chart datalabels plugin options.
     * @since 0.1.0
     */
    datalabels?: Options;
  }
}

declare const plugin: Record<string, unknown>;

export * from './context';

export default plugin;
