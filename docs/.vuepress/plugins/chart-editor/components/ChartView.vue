<template>
  <div class="chart-view">
    <canvas ref="canvas" />
  </div>
</template>

<script>
import {Chart} from 'chart.js';
import plugin from '../../../../../dist/chartjs-plugin-datalabels.js';

Chart.register(plugin);

export default {
  props: {
    config: {
      type: Object,
      default: null,
    },
  },

  watch: {
    config() {
      this.update();
    },
  },

  mounted() {
    this.update();
  },

  methods: {
    chart() {
      return this._chart;
    },
    update() {
      const config = this.config;
      const canvas = this.$refs.canvas;
      if (!canvas || !config) {
        return;
      }

      if (!this._chart) {
        this._chart = new Chart(canvas, config);
      } else {
        this._chart.stop();
        this._chart.data = config.data || {};
        this._chart.options = config.options || {};
        this._chart.update();
      }
    }
  },
}
</script>
