import { ChartDatasetProperties, ChartType, Plugin, PluginOptions } from "chart.js";
import { Options } from './options';

declare module 'chart.js' {
	interface ChartDatasetProperties<TType extends ChartType, TData extends unknown[]> {
		/**
		 * Per dataset datalabels plugin options.
		 * @since 0.1.0
		 */
		datalabels?: Options
	}

	interface PluginOptions {
		/**
		 * Per chart datalabels plugin options.
		 * @since 0.1.0
		 */
		datalabels?: Options
	}
}

declare const plugin: Plugin;

export * from './context';

export default plugin;
