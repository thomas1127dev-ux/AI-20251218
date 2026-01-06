<template>
	<view class="voice-recorder">
		<!-- 录音按钮 -->
		<view
			class="record-btn"
			:class="{ 'recording': isRecording, 'cancel': isCancelZone }"
			@touchstart="startRecord"
			@touchmove="onTouchMove"
			@touchend="endRecord"
			@touchcancel="cancelRecord"
		>
			<text class="record-text">{{ recordText }}</text>
		</view>

		<!-- 录音提示遮罩 -->
		<view class="record-mask" v-if="isRecording">
			<view class="record-tips">
				<view class="tips-icon">
					<view class="wave-circle" :class="{ 'cancel': isCancelZone }">
						<view class="wave"></view>
						<view class="wave"></view>
						<view class="wave"></view>
					</view>
					<text class="icon-text">🎤</text>
				</view>
				<text class="tips-text">{{ tipsText }}</text>
				<text class="cancel-text" v-if="!isCancelZone">↑ 上滑取消</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'

const emit = defineEmits(['send'])

const isRecording = ref(false) // 是否正在录音
const isCancelZone = ref(false) // 是否在取消区域
const startY = ref(0) // 触摸起始Y坐标
const duration = ref(0) // 录音时长
const recorderManager = ref(null) // 录音管理器
const tempFilePath = ref('') // 录音临时文件路径
const startTime = ref(0) // 录音开始时间戳
const recordedDuration = ref(0) // 实际录音时长（秒）

// 录音按钮文字
const recordText = computed(() => {
	if (!isRecording.value) return '按住 说话'
	if (isCancelZone.value) return '松开 取消'
	return '松开 发送'
})

// 提示文字
const tipsText = computed(() => {
	if (isCancelZone.value) return '松开手指，取消发送'
	return '正在录音...'
})

// 初始化录音管理器
const initRecorder = () => {
	if (recorderManager.value) return

	// #ifdef H5
	// H5端暂不支持录音功能
	console.warn('H5端暂不支持录音功能，请在小程序或APP端测试')
	// #endif

	// #ifndef H5
	recorderManager.value = uni.getRecorderManager()

	// 录音开始
	recorderManager.value.onStart(() => {
		console.log('录音开始')
		duration.value = 0
	})

	// 录音结束
	recorderManager.value.onStop((res) => {
		console.log('录音结束:', res)
		tempFilePath.value = res.tempFilePath

		// 使用实际录音时长（从开始到现在的时间差）
		// 因为安卓端 res.duration 可能不存在
		const actualDurationMs = Date.now() - startTime.value
		duration.value = Math.floor(actualDurationMs / 1000) // 转换为秒
		recordedDuration.value = duration.value

		console.log('录音时长(秒):', duration.value, '实际时长(ms):', actualDurationMs)
		console.log('isCancelZone:', isCancelZone.value, 'duration:', duration.value)

		// 如果不在取消区域，发送语音
		if (!isCancelZone.value && duration.value > 0) {
			console.log('准备发送语音，filePath:', tempFilePath.value, 'duration:', duration.value)
			emit('send', {
				filePath: tempFilePath.value,
				duration: duration.value
			})
			console.log('已触发send事件')
		} else {
			console.log('语音未发送，原因: isCancelZone=', isCancelZone.value, 'duration=', duration.value)
		}

		// 重置状态
		isRecording.value = false
		isCancelZone.value = false
	})

	// 录音错误
	recorderManager.value.onError((err) => {
		console.error('录音错误:', err)
		uni.showToast({
			title: '录音失败',
			icon: 'none'
		})
		isRecording.value = false
		isCancelZone.value = false
	})
	// #endif
}

// 开始录音
const startRecord = (e) => {
	// #ifdef H5
	uni.showToast({
		title: 'H5端暂不支持录音，请使用小程序或APP',
		icon: 'none',
		duration: 2000
	})
	return
	// #endif

	// #ifndef H5
	initRecorder()

	startY.value = e.touches[0].clientY
	isRecording.value = true
	isCancelZone.value = false
	startTime.value = Date.now() // 记录开始时间

	// 开始录音
	recorderManager.value.start({
		format: 'mp3',
		sampleRate: 16000,
		numberOfChannels: 1,
		encodeBitRate: 48000
	})
	// #endif
}

// 触摸移动
const onTouchMove = (e) => {
	if (!isRecording.value) return

	const currentY = e.touches[0].clientY
	const deltaY = startY.value - currentY

	// 上滑超过100px进入取消区域
	if (deltaY > 100) {
		isCancelZone.value = true
	} else {
		isCancelZone.value = false
	}
}

// 结束录音
const endRecord = () => {
	// #ifdef H5
	return
	// #endif

	// #ifndef H5
	if (!isRecording.value) return

	// 计算实际录音时长（毫秒）
	const actualDuration = Date.now() - startTime.value
	console.log('实际录音时长:', actualDuration, 'ms')

	if (actualDuration < 1000) {
		// 录音时间太短（少于1秒）
		uni.showToast({
			title: '说话时间太短',
			icon: 'none'
		})
		recorderManager.value.stop()
		isRecording.value = false
		isCancelZone.value = false
		return
	}

	// 停止录音
	recorderManager.value.stop()
	// #endif
}

// 取消录音
const cancelRecord = () => {
	// #ifdef H5
	return
	// #endif

	// #ifndef H5
	if (!isRecording.value) return

	recorderManager.value.stop()
	isRecording.value = false
	isCancelZone.value = false
	// #endif
}
</script>

<style lang="scss" scoped>
.voice-recorder {
	flex: 1;
}

.record-btn {
	background: #FFFFFF;
	width: 100%;
	height: 72rpx;
	line-height: 72rpx;
	border-radius: 36rpx;
	text-align: center;
	user-select: none;
	transition: all 0.2s;

	&.recording {
		background: #E8E8E8;
	}

	&.cancel {
		background: #FF6B6B;
		color: #FFFFFF;
	}

	.record-text {
		font-size: 28rpx;
		color: #333333;
	}

	&.cancel .record-text {
		color: #FFFFFF;
	}
}

// 录音遮罩
.record-mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.record-tips {
	background: rgba(0, 0, 0, 0.8);
	border-radius: 24rpx;
	padding: 60rpx 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.tips-icon {
	position: relative;
	width: 120rpx;
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 32rpx;

	.icon-text {
		font-size: 64rpx;
		position: relative;
		z-index: 2;
	}
}

// 波纹动画
.wave-circle {
	position: absolute;
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;

	.wave {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: rgba(86, 98, 225, 0.3);
		animation: wave-animation 1.5s ease-out infinite;

		&:nth-child(1) {
			animation-delay: 0s;
		}

		&:nth-child(2) {
			animation-delay: 0.5s;
		}

		&:nth-child(3) {
			animation-delay: 1s;
		}
	}

	&.cancel .wave {
		background: rgba(255, 107, 107, 0.3);
	}
}

@keyframes wave-animation {
	0% {
		transform: scale(0.8);
		opacity: 1;
	}
	100% {
		transform: scale(2);
		opacity: 0;
	}
}

.tips-text {
	font-size: 28rpx;
	color: #FFFFFF;
	margin-bottom: 16rpx;
}

.cancel-text {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.6);
}
</style>
