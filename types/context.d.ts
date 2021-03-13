import {Chart, ChartDataset} from 'chart.js';

/**
 * The context is used to give contextual information when resolving options.
 * It mainly applies to scriptable options, event listeners and `formatter`.
 */
export interface Context {
  /**
   * Whether the associated element is hovered by the user.
   * @see http://www.chartjs.org/docs/latest/general/interactions
   * @since 0.3.0
   */
  active: boolean;

  /**
   * The type of teh context, 'datalabels'.
   * @since 2.0.0
   */
  type: string;
  
  /**
   * The associated chart.
   * @since 0.1.0
   */
  chart: Chart;

  /**
   * Index of the current data.
   * @since 0.1.0
   */
  dataIndex: number;

  /**
   * The current dataset at index `datasetIndex`.
   * @since 0.1.0
   */
  dataset: ChartDataset;

  /**
   * Index of the current dataset.
   * @since 0.1.0
   */
  datasetIndex: number;
}
