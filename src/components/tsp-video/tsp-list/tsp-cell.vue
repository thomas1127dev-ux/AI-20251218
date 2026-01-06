<template>
	<!-- #ifdef APP-NVUE -->
	<cell>
		<slot />
	</cell>
	<!-- #endif -->
	
	<!-- #ifndef APP-NVUE -->
	<view>
		<slot />
	</view>
	<!-- #endif -->
</template>

<script>
</script>

<style>
</style>