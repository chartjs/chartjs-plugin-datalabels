<template>
	<div class="tooltip">
		<div class="activator">
			<slot name="default" />
		</div>
		<perfect-scrollbar class="content">
			<slot name="content" />
		</perfect-scrollbar>
	</div>
</template>

<style lang="stylus" scoped>
@import '../styles/palette.styl'

.tooltip
	position relative

	.content
		background #eee
		color #444
		box-shadow $box-shadow
		border-radius $border-radius
		display none
		font-size 0.8rem
		position absolute
		min-width 256px
		max-width 512px
		max-height 256px
		z-index 999
		right 0

	&:hover
		.content
			display block

	::v-deep
		pre
			background none
			overflow visible
			padding 0 16px
</style>
