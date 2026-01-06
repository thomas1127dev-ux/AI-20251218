<template>
	<up-tabs :list="list" :current="current" @click="handleClick" lineColor="transparent" :activeStyle="{
      color: '#fff',
      fontSize: '28px',
	  fontWeight: '400'
    }" :inactiveStyle="{
      color: 'rgba(255,255,255, .6)',
      fontSize: '21px',
      fontWeight: '400'
    }" itemStyle="padding-left: 0; padding-right: 15px;" />
</template>

<script setup>
	import {
		reactive
	} from 'vue'

	const props = defineProps({
		current: {
			type: Number,
			default: 0
		},
		list: {
			type: Array,
			default: () => []
		}
	})

	const emit = defineEmits(['change'])

	// 默认标签数据
	const defaultList = reactive([{
			name: '推荐'
		},
		{
			name: '关注'
		}
	])

	const handleClick = (index) => {
		// console.log('index', index);
		emit('change', index)
	}
</script>

<style lang="scss" scoped>
	:deep(.up-tabs) {
		background-color: transparent;
	}
</style>