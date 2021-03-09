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
import {Chart} from 'chart.js';

// Components
import ChartActions from './ChartActions.vue';
import ChartView from './ChartView.vue';
import CodeEditor from './CodeEditor.vue';

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

      const logger = {
        log(...args) {
          me.messages = [...me.messages, args.join(' ')].slice(-50);
        },
      };

      const me = this;
      const context = {
        ...(this.$chart || {}).imports,
        console: {
          ...console,
          ...logger,
        },
        Chart,
      };

      const keys = Object.keys(context);
      const lines = keys.map((key) => {
        return `const ${key} = arguments[0].${key}`;
      });

      const script = `
        'use strict';
        const module = {exports: {}};
        ${lines.join(';\n')};
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
