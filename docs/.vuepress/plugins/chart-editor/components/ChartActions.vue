<template>
	<div class="chart-actions">
		<a v-for="action in actions" class="chart-action" @click="onClick(action)">
			{{ action.name }}
		</a>
	</div>
</template>

<script>
export default {
	props: {
		actions: Array,
		default: () => [],
	},

	methods: {
		onClick(action) {
			this.$emit('action', action);
		}
	},
}
</script>

<style lang="stylus" scoped>
@import '../styles/palette.styl'

.chart-actions
	align-items center
	display flex
	flex-wrap wrap

.chart-action
	transition background .25s, border-color .25s
	background rgba($codeBgColor, 0.05)
	border 1px solid transparent
	border-radius $border-radius
	color $accentColor
	text-decoration none !important
	display inline-block
	font-size 0.8rem
	padding 8px 16px
	margin 0 8px 8px 0
	cursor pointer
	user-select none

	&:hover
		background rgba($accentColor, 0.15)
		border-color rgba($accentColor, 0.2)
		color $accentColor

	&:active
		background rgba($accentColor, 0.3)
		border-color rgba($accentColor, 0.4)
		color $accentColor
</style>
