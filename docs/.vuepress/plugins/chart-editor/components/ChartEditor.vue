<template>
	<div class="chart-editor">
		<chart-view ref="chart-view" :config="config"/>
		<chart-actions :actions="actions" @action="execute"/>
		<code-editor
			:error.sync="error"
			:messages="messages"
			:output="output"
			:value="code"
			@input="update"
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
		config: null,
		error: null,
		messages: [],
		output: false,
	}),

	watch: {
		code: {
			immediate: true,
			handler(code) {
				this.update(code);
			},
		},
	},

	methods: {
		update(code) {
			this.error = null;

			if (!code) {
				this.config = null;
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

			const me = this;
			const context = {
				Chart: Chart,
				Utils: {
					...Utils,
					log(...args) {
						me.messages = [...me.messages, args.join(' ')].slice(-50);
					},
				},
			};

			Chart.defaults.set(CHART_DEFAULTS);

			try {
				const exports = new Function(script)(context);
				this.output = exports.output || false;
				this.config = exports.config;

				if (!this.actions) {
					this.actions = exports.actions || null;
				}
			} catch(error) {
				this.error = error;
			}
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
