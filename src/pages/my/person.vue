<template>
	<view class="">
		<person :isBack="true"/>
	</view>
</template>

<script setup>
	import person from './components/person.vue'
	import { ref } from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
</script>

<style lang="scss" scoped>

</style>