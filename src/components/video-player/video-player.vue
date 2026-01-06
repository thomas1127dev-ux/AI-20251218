<template>
	<view class="video-player">
		<!-- 视频 -->
		<video ref="myVideo" id="myVideo" :src="video" :key="video" object-fit="" @error="videoErrorCallback" style="width: 100%; height: 450rpx"></video>

		<!-- 	<cover-view class="head-bar">
			<up-image src="/static/images/arrow-left.png" width="18px" height="18px"></up-image>
		</cover-view> -->
	</view>
</template>

<script setup>
import { ref, toRef, getCurrentInstance } from 'vue';
import { onLoad, onUnload, onHide, onShow } from '@dcloudio/uni-app';
const props = defineProps(['video']);

const videoSrc = toRef(props.video);
let videoContext = null;

onLoad(() => {
	// 创建视频上下文，Vue3需确保第二个参数为组件实例
	videoContext = uni.createVideoContext('myVideo', getCurrentInstance());
});

onHide(() => {
	// 页面隐藏时暂停视频
	if (videoContext) {
		videoContext.pause();
	}
});

onShow(() => {
	// 页面再次显示时，可根据需要重新播放或保持暂停
	console.log('页面显示');
	videoContext.play();
});

onUnload(() => {
	// 页面卸载时，彻底释放视频资源
	if (videoContext) {
		videoContext.pause();
		// 清空视频源是彻底释放资源的一种方式
		videoSrc.value = '';
	}
	videoContext = null;
});

const videoErrorCallback = () => {};
</script>

<style lang="scss" scoped>
.video-player {
	position: relative;
	background-color: #000;

	.head-bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 99;

		padding: 20rpx 40rpx 30rpx;
		// display: flex;
		// align-items: center;
	}
}
</style>
