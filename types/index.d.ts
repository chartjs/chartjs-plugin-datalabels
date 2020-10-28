import { Options } from './options';
import { IChartType, IPlugin } from "chart.js";

declare module 'chart.js' {
	interface IChartDataset {
		/**
		 * Per dataset datalabels plugin options.
		 * @since 0.1.0
		 */
		datalabels?: Options
	}

	interface IChartOptions<TYPE extends IChartType = IChartType> {
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
