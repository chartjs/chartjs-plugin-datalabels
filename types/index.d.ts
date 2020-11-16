import {ChartDatasetProperties, ChartType, Plugin} from 'chart.js';
import {Options} from './options';

declare module 'chart.js' {
  interface ChartDatasetProperties<TYPE extends ChartType, DATA extends unknown[]> {
    /**
     * Per dataset datalabels plugin options.
     * @since 0.1.0
     */
    datalabels?: Options
  }

  interface ChartOptions<TYPE extends ChartType = ChartType> {
    /**
     * Per chart datalabels plugin options.
     * @since 0.1.0
     */
    plugins?: {
      datalabels?: Options
    }
  }
}

declare const plugin: Plugin;

export * from './context';

export default plugin;
