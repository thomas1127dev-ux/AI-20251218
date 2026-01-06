<template>
	<view v-if="moveX">
		<view class="movable-area">
			<view class="movable-view" :x="moveX" :y="moveY" direction="all" inertia out-of-bounds @click="click">
				<slot name="content"></slot>
			</view>
		</view>
	</view>
</template>

<!-- dragball.vue -->
<script setup>
import { ref,onMounted} from 'vue'

const emit = defineEmits(['click'])

const moveX = ref('')
const moveY = ref('')

onMounted(() => {
  setTimeout(() => {
    moveX.value = uni.getSystemInfoSync().screenWidth - 50
    moveY.value = uni.getSystemInfoSync().screenHeight - 300
  }, 100)
})


function click() {
  emit('clicks', true)
}
</script>
<style lang="scss">
	.movable-area {
		height: 100vh;
		width: 750rpx;
		position: fixed;
		top: 30vh;
	    left:75vw;
		pointer-events: none; //此处要加，鼠标事件可以渗透
		z-index: 9999999;


		.movable-view {
			width: 180rpx;
			height: 200rpx;
			padding: 20rpx;
			pointer-events: auto; //恢复鼠标事件
			border-radius: 50%;
			overflow: hidden;
			color: #fff;
			// box-shadow: 0px 2rpx 16rpx 0px rgba(0, 0, 0, 0.16);
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;

			image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
			}

			.shop-car {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}
		}
	}
</style>