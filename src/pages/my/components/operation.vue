<template>
	<up-popup
		:show="show"
		mode="bottom"
		@close="handleClose"
		round="20"
		:safeAreaInsetBottom="true"
	>
		<view class="operation-panel">
			<view class="title">聊天设置</view>

			<view class="menu-list">
				<view class="menu-item" @click="handleChangeBackground">
					<up-icon name="photo" size="40" color="#FFFFFF"></up-icon>
					<text class="menu-text">更换背景</text>
				</view>

				<view class="menu-item" @click="handleBlock">
					<up-icon name="minus-circle" size="40" color="#FFFFFF"></up-icon>
					<text class="menu-text">拉黑</text>
				</view>

				<view class="menu-item" @click="handleReport">
					<up-icon name="error-circle" size="40" color="#FFFFFF"></up-icon>
					<text class="menu-text">投诉</text>
				</view>
			</view>

			<view class="cancel-btn" @click="handleClose">
				取消
			</view>
		</view>
	</up-popup>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update:show', 'changeBackground', 'block', 'report'])

const handleClose = () => {
	emit('update:show', false)
}

const handleChangeBackground = () => {
	emit('changeBackground')
	handleClose()
}

const handleBlock = () => {
	emit('block')
	handleClose()
}

const handleReport = () => {
	emit('report')
	handleClose()
}
</script>

<style lang="scss" scoped>
.operation-panel {
	background: #2A2A2A;
	padding: 32rpx 24rpx;
	padding-bottom: calc(32rpx + env(safe-area-inset-bottom));

	.title {
		color: rgba(255, 255, 255, 0.6);
		font-size: 28rpx;
		text-align: center;
		margin-bottom: 32rpx;
	}

	.menu-list {
		display: flex;
		justify-content: space-around;
		margin-bottom: 32rpx;

		.menu-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 16rpx;

			.menu-text {
				color: #FFFFFF;
				font-size: 26rpx;
			}
		}
	}

	.cancel-btn {
		background: #3A3A3A;
		color: #FFFFFF;
		font-size: 32rpx;
		text-align: center;
		padding: 24rpx;
		border-radius: 16rpx;
		margin-top: 16rpx;
	}
}
</style>
