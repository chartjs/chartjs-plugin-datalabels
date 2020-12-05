<template>
	<perfect-scrollbar class="editor-textarea">
		<div class="editor-textarea-content">
			<prism-editor :value="value" :highlight="highlight" @input="$emit('input', $event)"/>
		</div>
	</perfect-scrollbar>
</template>

<script>
// prismjs comes with the 'vuepress' dependency.
// https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/markdown/package.json#L31
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

// Components
import { PrismEditor } from 'vue-prism-editor';

// Style
import 'vue-prism-editor/dist/prismeditor.min.css';

export default {
	components: {
		PrismEditor,
	},

	props: {
		value: {
			type: String,
			required: true,
		},
	},

	methods: {
		highlight(code) {
			return highlight(code, languages.js);
		},
	}
};
</script>

<style lang="stylus" scoped>
@import '../styles/palette.styl'

.editor-textarea
	color $code-text-color
	font-family $code-font-family
	font-size $code-font-size
	line-height $code-line-height
	height inherit

	// Move the "js" indicator a bit further from the top/right sides
	// so we can display the vertical scrollbar without overlap it.
	&:before
		margin-right 8px
		margin-top 4px

	.prism-editor-wrapper
		overflow visible

.editor-textarea-content
	padding 16px 24px
</style>
