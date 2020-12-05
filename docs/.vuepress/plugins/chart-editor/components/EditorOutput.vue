<template>
	<perfect-scrollbar class="editor-output">
		<div class="editor-output-content">
			<span v-for="item in items" v-text="item" />
			<span
				v-if="!items.length && placeholder"
				v-text="placeholder === true ? '...' : placeholder"
				class="text-muted"
			/>
		</div>
	</perfect-scrollbar>
</template>

<script>
export default {
	props: {
		placeholder: {
			type: [Boolean, String],
			default: true,
		},
		value: {
			type: Array,
			default: () => [],
		},
	},

	computed: {
		items() {
			return [...this.value].reverse();
		},
	},
}
</script>

<style lang="stylus" scoped>
@import '../styles/palette.styl'

.editor-output
	color $code-text-color
	font-family $code-font-family
	font-size $code-font-size
	line-height $code-line-height
	height inherit

.editor-output-content
	padding 16px 24px

	> span
		white-space pre-wrap
		position relative
		display block
		margin-left 5px
		opacity 0.25

		&:first-child:before
			content '>'
			font-weight bold
			position absolute
			opacity 0.5
			left -15px

		for i in (0..15)
			&:nth-child({i + 1})
				opacity (1 - (i / 20))
</style>
