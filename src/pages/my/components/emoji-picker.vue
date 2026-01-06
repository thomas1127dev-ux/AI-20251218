<template>
	<view class="emoji-picker-wrapper" v-if="show" @touchmove.stop.prevent>
		<!-- 遮罩层 -->
		<view class="mask" @tap="close" catchtouchmove="true"></view>

		<!-- 表情面板 -->
		<view class="emoji-panel" :class="{ 'panel-show': show }">
			<!-- 标题栏 -->
			<view class="panel-header">
				<text class="panel-title">选择表情</text>
			</view>

			<!-- 表情网格 -->
			<scroll-view
				class="emoji-scroll"
				scroll-y
				:enable-flex="true"
				:show-scrollbar="false"
			>
				<view class="emoji-grid">
					<view
						class="emoji-item"
						v-for="(item, index) in emojiList"
						:key="index"
						@tap="selectEmoji(item)"
						:hover-class="'emoji-item-hover'"
						:hover-stay-time="100"
					>
						<text class="emoji-text">{{ item.emoji }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import emojiData from '@/components/tsp-video/comment/emoji.js'

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['update:show', 'select'])

// 使用emoji数据
const emojiList = ref(emojiData)

// 选择表情
const selectEmoji = (emoji) => {
	emit('select', emoji.emoji)
	close()
}

// 关闭面板
const close = () => {
	emit('update:show', false)
}
</script>

<style lang="scss" scoped>
.emoji-picker-wrapper {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 9999;
}

.mask {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	animation: fadeIn 0.3s ease;
}

.emoji-panel {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	max-height: 60vh;
	background: #FFFFFF;
	border-radius: 32rpx 32rpx 0 0;
	display: flex;
	flex-direction: column;
	z-index: 10000;
	transform: translateY(100%);
	transition: transform 0.3s ease;

	// H5端额外样式
	/* #ifdef H5 */
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	/* #endif */

	&.panel-show {
		transform: translateY(0);
	}
}

.panel-header {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 88rpx;
	border-bottom: 1rpx solid #F0F0F0;
	flex-shrink: 0;

	.panel-title {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
	}
}

.emoji-scroll {
	flex: 1;
	height: 0;
	padding: 24rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	box-sizing: border-box;

	// 安卓端优化滚动性能
	/* #ifdef APP-PLUS */
	-webkit-overflow-scrolling: touch;
	/* #endif */
}

.emoji-grid {
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;

	// H5端使用grid布局
	/* #ifdef H5 */
	display: grid;
	grid-template-columns: repeat(8, 1fr);
	gap: 12rpx;
	/* #endif */
}

.emoji-item {
	// 非H5端使用flex布局
	/* #ifndef H5 */
	width: 12.5%;
	/* #endif */

	display: flex;
	align-items: center;
	justify-content: center;
	padding: 12rpx;
	border-radius: 12rpx;
	box-sizing: border-box;

	// 点击态样式
	&:active {
		background: #F5F5F5;
	}
}

.emoji-item-hover {
	background: #F5F5F5;
	transition: background 0.1s;
}

.emoji-text {
	font-size: 44rpx;
	line-height: 1;

	// iOS端优化emoji渲染
	/* #ifdef APP-PLUS-IOS */
	font-family: "Apple Color Emoji", sans-serif;
	/* #endif */

	// 安卓端优化
	/* #ifdef APP-PLUS-ANDROID */
	font-family: "Noto Color Emoji", sans-serif;
	/* #endif */
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
</style>
