<template>
	<view>
		<up-picker :show="show" :columns="columns" @confirm="onConfirm" @cancel="onCancel" @close="onClose" round="10" confirmColor="#000"></up-picker>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue';
	const columns = reactive([
		['拉黑', '举报']
	]);
	const props = defineProps({
		show: {
			type: Boolean,
			default: false
		}
	})
	const emits = defineEmits(['update:show', 'cancel', 'confirm', 'close'])
	const onCancel = ()=> {
		console.log('cancel');
		emits('cancel')
		emits('update:show', false)
	}
	const onConfirm = ()=> {
		console.log('confirm');
		emits('confirm')
		emits('update:show', false)
	}
	const onClose = ()=>{
		console.log('close');
		emits('close')
		emits('update:show', false)
	}
</script>