import { Options } from './options';
import { ChartDatasetProperties, ChartType, ChartTypeRegistry, DeepPartial, IChartType, IPlugin } from "chart.js";

declare module 'chart.js' {
	interface ChartDatasetProperties<TYPE extends ChartType, DATA extends unknown[]> {
		/**
		 * Per dataset datalabels plugin options.
		 * @since 0.1.0
		 */
		datalabels?: Options
	}

  interface ChartOptions<TYPE extends IChartType = IChartType> {
    /**
     * Per chart datalabels plugin options.
     * @since 0.1.0
     */
    plugins?: {
      datalabels?: Options
    }
  }
}

declare const plugin: IPlugin;

export * from './context';

export default plugin;
