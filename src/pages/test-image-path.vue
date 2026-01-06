<template>
	<view class="test-page">
		<view class="test-title">图片路径测试</view>

		<!-- 测试1: 相对路径 -->
		<view class="test-item">
			<text class="label">相对路径（/media/...）</text>
			<image
				class="test-img"
				src="/media/avatars/test.jpg"
				mode="aspectFill"
				@error="handleError('/media/avatars/test.jpg', $event)"
				@load="handleLoad('/media/avatars/test.jpg')"
			/>
			<text class="result">{{ results['/media/avatars/test.jpg'] }}</text>
		</view>

		<!-- 测试2: 完整 HTTP URL -->
		<view class="test-item">
			<text class="label">完整URL（http://...）</text>
			<image
				class="test-img"
				src="http://localhost:8062/media/avatars/test.jpg"
				mode="aspectFill"
				@error="handleError('http://localhost:8062/media/avatars/test.jpg', $event)"
				@load="handleLoad('http://localhost:8062/media/avatars/test.jpg')"
			/>
			<text class="result">{{ results['http://localhost:8062/media/avatars/test.jpg'] }}</text>
		</view>

		<!-- 测试3: 本地静态资源 -->
		<view class="test-item">
			<text class="label">本地静态资源（/static/...）</text>
			<image
				class="test-img"
				src="/static/logo.png"
				mode="aspectFill"
				@error="handleError('/static/logo.png', $event)"
				@load="handleLoad('/static/logo.png')"
			/>
			<text class="result">{{ results['/static/logo.png'] }}</text>
		</view>

		<!-- 环境信息 -->
		<view class="env-info">
			<text class="info-title">环境信息：</text>
			<text class="info-item">平台: {{ platform }}</text>
			<text class="info-item">页面协议: {{ pageProtocol }}</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const results = ref({})
const platform = ref('')
const pageProtocol = ref('')

// 图片加载成功
const handleLoad = (src) => {
	results.value[src] = '✅ 加载成功'
	console.log('图片加载成功:', src)
}

// 图片加载失败
const handleError = (src, event) => {
	results.value[src] = '❌ 加载失败'
	console.log('图片加载失败:', src, event)
}

onMounted(() => {
	// 获取平台信息
	// #ifdef H5
	platform.value = 'H5'
	pageProtocol.value = window.location.protocol + '//' + window.location.host
	// #endif

	// #ifdef APP-PLUS
	platform.value = 'APP'
	// APP端获取页面路径
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	pageProtocol.value = currentPage?.$page?.fullPath || 'file://'
	// #endif

	console.log('=== 图片路径测试 ===')
	console.log('平台:', platform.value)
	console.log('页面协议:', pageProtocol.value)
	console.log('==================')
})
</script>

<style scoped>
.test-page {
	padding: 40rpx;
	background: #1A1921;
	min-height: 100vh;
}

.test-title {
	color: #FFFFFF;
	font-size: 40rpx;
	font-weight: bold;
	margin-bottom: 40rpx;
	text-align: center;
}

.test-item {
	background: #2A2A2A;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.label {
	color: #00D9C5;
	font-size: 28rpx;
	display: block;
	margin-bottom: 20rpx;
}

.test-img {
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	background: rgba(255, 255, 255, 0.05);
	display: block;
	margin-bottom: 20rpx;
}

.result {
	color: #FFFFFF;
	font-size: 26rpx;
	display: block;
}

.env-info {
	background: #2A2A2A;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-top: 40rpx;
}

.info-title {
	color: #00D9C5;
	font-size: 28rpx;
	font-weight: bold;
	display: block;
	margin-bottom: 20rpx;
}

.info-item {
	color: rgba(255, 255, 255, 0.7);
	font-size: 24rpx;
	display: block;
	margin-bottom: 10rpx;
}
</style>
