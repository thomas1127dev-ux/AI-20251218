<template>
	<view class="position-absolute top-0 right-0 bottom-0 left-0">
		<view class="video-title">
			<text class="video-title-text">标题标题标题</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			//视频部分的高度
			vodHeight:{ 
				type:Number,
				default:0
			},
			//下标索引
			index:{
				type:Number,
				default:0
			},
			//当前播放的视频下标
			vodIndex:{
				type:Number,
				default:0
			},
			//当前视频的整个对象
			item:{
				type:Object,
				default:()=>{return {}}
			},
		},
		data(){
			return {
				
			}
		},
		created() {
			
		}
	}
</script>

<style scoped>
	.video-title {
	  position: absolute;
	  top: 10px;
	  left: 10px;
	  background-color: rgba(0,0,0,0.5);
	  padding: 5px 10px;
	  border-radius: 4px;
	  z-index: 999;
	}
	.video-title-text{
		color: #fff;
		font-size: 16px;
	}
	/* 定位 */
	.position-relative { position: relative;}
	.position-absolute { position: absolute;}
	.position-fixed { position: fixed;}
	.top-0 { top: 0; }
	.left-0 { left: 0; }
	.right-0 { right: 0; }
	.right-3 { right: 30rpx; }
	.right-6 { right: 60rpx; }
	.bottom-0 { bottom: 0; }
	.left-3{ left: 30rpx; }
	.left-5{ left: 50rpx; }
	.left-6{ left: 60rpx; }
</style>