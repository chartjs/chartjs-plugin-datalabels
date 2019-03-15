import { Options } from './options';
import { Chart } from 'chart.js';

export * from './context';

declare module Chart {
	interface ChartDataSets {
		/**
		 * Per dataset datalabels plugin options.
		 * @since 0.1.0
		 */
		datalabels?: Options
	}

	interface ChartPluginsOptions {
		/**
		 * Per chart datalabels plugin options.
		 * @since 0.1.0
		 */
		datalabels?: Options
	}
}
