<template>
	<view class="banner-view">
		<up-swiper :list="list1" height="320rpx" radius="20rpx" imageMode="aspectFit" bgColor="transparent">
			<template v-slot:default="{item}">
				<view @click="handleClickBanner">
					<up-image width="100%" :src="item.url" mode="aspectFill" />
					<view class="swiper-des">
						<view class="nums">播放：{{ item.plays}}</view>
						<view class="time">{{ item.time}}</view>
					</view>
				</view>
			</template>
		</up-swiper>

		<view class="desc">
			<view class="title">男生组队打游戏时男生组队打游戏时男生组队打游戏时</view>
			<view class="auther">
				<view class="" @click.stop=" uni.navigateTo({url:'/pages/my/person'})">
					<up-avatar src="/static/images/1.png" size="25"></up-avatar>
				</view>
				<view class="name">zovod</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive
	} from 'vue';

	// 使用 reactive 创建响应式数组  
	const list1 = reactive([{
		url: '/static/images/1.png',
		title: '轮播图1111',
		plays: '2020',
		time: '1: 28: 49'
	}]);

	const handleClickBanner = () => {
		uni.navigateTo({
			url: '/pages/video/video'
		})
	}
</script>

<style lang="scss">
	.banner-view {
		background-color: rgba(255, 255, 255, .03);
		border-radius: 20rpx;
		padding-bottom: 10rpx;
	}

	.desc {
		padding: 10rpx 15rpx;
		font-size: 15px;
	}

	.swiper-des {
		color: #fff;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 15rpx 20rpx;
		font-size: 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.title {
		max-height: 80rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box; //作为弹性伸缩盒子模型显示。
		-webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
		-webkit-line-clamp: 2;
	}

	.auther {
		margin-top: 20rpx;
		font-size: 11px;

		display: flex;
		align-items: center;

		.name {
			margin-left: 20rpx;
		}
	}
</style>