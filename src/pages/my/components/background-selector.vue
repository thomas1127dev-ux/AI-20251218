<template>
	<up-popup
		:show="show"
		mode="bottom"
		@close="handleClose"
		round="20"
		:safeAreaInsetBottom="true"
	>
		<view class="background-selector">
			<view class="header">
				<text class="title">选择聊天背景</text>
				<view class="close-btn" @click="handleClose">
					<up-icon name="close" size="40" color="#FFFFFF"></up-icon>
				</view>
			</view>

			<view class="background-grid">
				<!-- 默认背景 -->
				<view
					class="background-item"
					:class="{ active: currentBackground === 'default' }"
					@click="selectBackground('default')"
				>
					<view class="bg-preview default-bg">
						<text class="default-text">默认</text>
					</view>
					<view v-if="currentBackground === 'default'" class="check-icon">
						<up-icon name="checkbox-mark" size="32" color="#00D9C5"></up-icon>
					</view>
				</view>

				<!-- Mock 背景图片 -->
				<view
					v-for="(bg, index) in backgrounds"
					:key="index"
					class="background-item"
					:class="{ active: currentBackground === bg.url }"
					@click="selectBackground(bg.url)"
				>
					<image class="bg-preview" :src="bg.url" mode="aspectFill"></image>
					<view v-if="currentBackground === bg.url" class="check-icon">
						<up-icon name="checkbox-mark" size="32" color="#00D9C5"></up-icon>
					</view>
				</view>
			</view>

			<view class="footer">
				<view class="btn cancel-btn" @click="handleClose">取消</view>
				<view class="btn confirm-btn" @click="handleConfirm">确定</view>
			</view>
		</view>
	</up-popup>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	modelValue: {
		type: String,
		default: 'default'
	}
})

const emit = defineEmits(['update:show', 'update:modelValue', 'change'])

// Mock 背景数据
const backgrounds = ref([
	{ url: 'https://picsum.photos/400/800?random=1' },
	{ url: 'https://picsum.photos/400/800?random=2' },
	{ url: 'https://picsum.photos/400/800?random=3' },
	{ url: 'https://picsum.photos/400/800?random=4' },
	{ url: 'https://picsum.photos/400/800?random=5' },
	{ url: 'https://picsum.photos/400/800?random=6' }
])

const currentBackground = ref(props.modelValue)

const selectBackground = (url) => {
	currentBackground.value = url
}

const handleClose = () => {
	emit('update:show', false)
}

const handleConfirm = () => {
	emit('update:modelValue', currentBackground.value)
	emit('change', currentBackground.value)
	handleClose()
}
</script>

<style lang="scss" scoped>
.background-selector {
	background: #2A2A2A;
	max-height: 80vh;
	display: flex;
	flex-direction: column;

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx 24rpx;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);

		.title {
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: 600;
		}

		.close-btn {
			padding: 8rpx;
		}
	}

	.background-grid {
		flex: 1;
		overflow-y: auto;
		padding: 24rpx;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20rpx;

		.background-item {
			position: relative;
			aspect-ratio: 1 / 1.5;
			border-radius: 16rpx;
			overflow: hidden;
			border: 4rpx solid transparent;

			&.active {
				border-color: #00D9C5;
			}

			.bg-preview {
				width: 100%;
				height: 100%;
				display: block;

				&.default-bg {
					background: linear-gradient(135deg, #1A1921 0%, #2A2A2A 100%);
					display: flex;
					align-items: center;
					justify-content: center;

					.default-text {
						color: rgba(255, 255, 255, 0.6);
						font-size: 28rpx;
					}
				}
			}

			.check-icon {
				position: absolute;
				bottom: 8rpx;
				right: 8rpx;
				background: rgba(0, 0, 0, 0.6);
				border-radius: 50%;
				width: 48rpx;
				height: 48rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.footer {
		padding: 24rpx;
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		display: flex;
		gap: 24rpx;
		border-top: 1px solid rgba(255, 255, 255, 0.1);

		.btn {
			flex: 1;
			text-align: center;
			padding: 24rpx;
			border-radius: 16rpx;
			font-size: 32rpx;
		}

		.cancel-btn {
			background: #3A3A3A;
			color: #FFFFFF;
		}

		.confirm-btn {
			background: linear-gradient(180deg, #5662E1 0%, #614793 100%);
			color: #FFFFFF;
		}
	}
}
</style>
