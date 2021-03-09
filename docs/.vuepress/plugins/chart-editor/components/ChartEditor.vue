<template>
  <div class="chart-editor">
    <chart-view ref="chart-view" />
    <chart-actions :actions="actions" @action="execute"/>
    <code-editor
      :error.sync="error"
      :messages="messages"
      :output="output"
      :value="code"
      @input="evaluate"
    />
  </div>
</template>

<script>
import Chart from 'chart.js';
import * as Utils from '../utils';

// Components
import ChartActions from './ChartActions.vue';
import ChartView from './ChartView.vue';
import CodeEditor from './CodeEditor.vue';

const CHART_DEFAULTS = Chart.helpers.merge({}, Chart.defaults);

export default {
  components: {
    ChartActions,
    ChartView,
    CodeEditor,
  },

  props: {
    code: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    actions: null,
    error: null,
    messages: [],
    output: false,
  }),

  watch: {
    code(code) {
      this.evaluate(code);
    },
  },

  mounted() {
    this.evaluate(this.code);
  },

  methods: {
    evaluate(code) {
      this.error = null;

      if (!code) {
        this.update(null);
        return;
      }

      const script = `
        'use strict';
        const Chart = arguments[0].Chart;
        const Utils = arguments[0].Utils;
        const module = {exports: {}};
        (function(){ ${code} })();
        return module.exports;
      `;

      try {
        const exports = new Function(script)(context);
        const config = exports.config || null;
        this.output = exports.output || false;

        if (!this.actions) {
          this.actions = exports.actions || null;
        }

        this.update(config);
      } catch(error) {
        this.error = error;
      }
    },
    update(config) {
      this.$refs['chart-view'].update(config);
    },
    execute(action) {
      action.handler(this.$refs['chart-view'].chart());
    },
  },
}
</script>

<style lang="stylus" scoped>
.chart-view,
.chart-actions
  margin 16px 0
</style>
