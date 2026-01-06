<template>
	<view class="guide-swiper">
		<up-navbar bg-color="transparent" :auto-back="false" placeholder leftIconColor="transparent">
			<template #right>
				<view style="color: rgba(255, 255, 255, 0.3)" @click="handleJumpPage">跳过</view>
			</template>
		</up-navbar>

		<view class="title">兴趣选择</view>
		<view class="sub-title">{{
			currentSwiper === 0 ? "选择你感兴趣的内容" : "这些博主符合您的偏好哦"
		}}</view>

		<swiper class="swiper" :current="currentSwiper" :disable-touch="true">
			<swiper-item>
				<view class="swiper-item">
					<scroll-view scroll-x="true">
						<view class="labels" style="width: 700px">
							<view class="label" :style="{
								background: label.selected ? '#5c4b8a' : '#ffffff80',
								color: label.selected ? '#fff' : '#000',
							}" v-for="label in labels" :key="label.id" @click="handleSelectLabel(label)">{{ label.name }}
							</view>
						</view>
					</scroll-view>

					<up-swiper :list="bannerList" keyName="image_url" previousMargin="80" nextMargin="80" circular
						:autoplay="false" height="320rpx" bgColor="transparent" style="margin-top: 80rpx"></up-swiper>

					<up-button text="保存标签，下一步" shape="circle" class="custom-next" @click="handleClickNext"></up-button>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item">
					<view class="blogger-list">
						<view class="blogger" v-for="item in bloggers">
							<view class="left">
								<up-image :src="item.avatar" radius="50%" width="120rpx" height="120rpx"></up-image>
								<view class="name">{{ item.user_nickname }}</view>
							</view>
							<up-button class="custom-watch" :class="item.watch  ? 'watch' : ''"
								:text="!item.watch  ? '关注' : '已关注'" @click="handleWatchBlogger(item)"></up-button>
						</view>
					</view>
				</view>
				<up-button text="下一步" shape="circle" class="custom-next" @click="handleClickNext"></up-button>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
import {
	ref,
	reactive
} from 'vue';

import {
	onLoad
} from '@dcloudio/uni-app'

import {
	tagList, getAdsList
} from '@/api/public.js'
import {
	updataUserinfo
} from '@/api/setup.js'
import {
	followtoggle
} from '@/api/community.js'


import { bloggerList } from '@/api/common.js';

const userId= uni.getStorageSync('user_info')?.user_id

const labels = ref([])
const tagsId = ref([])

onLoad(() => {
	uni.setStorageSync('isFirst', false)

	tagList().then(res => {
		labels.value = res.data.results
	})
	getAdsList({
		type: 'tag'
	}).then(res => {
		if (res.code === 200) {
			bannerList.value = res.data.results;
		}
	})

})

const currentSwiper = ref(0)


const bannerList = ref([])

const bloggers = ref([])

// 选中标签
const handleSelectLabel = (label) => {
	const index = labels.value.findIndex(item => item.id === label.id)
	if (index !== -1) {
		labels.value[index].selected = !labels.value[index].selected
	}
}

const handleClickNext = () => {
	if (currentSwiper.value == 1) {
		// todo:保存业务逻辑
		uni.switchTab({
			// #ifdef APP-PLUS
			url: '/pages/index/index'
			// #endif
			// #ifndef APP-PLUS
			url: '/pages/index/index-v'
			// #endif
		})
	} else {
		labels.value.forEach(item => {
			if (item.selected && item.selected === true) {
				tagsId.value.push(item.id)
			}
		})
		updataUserinfo(userId, { tags: tagsId.value}).then( res =>{
			console.log("🚀 ~ handleClickNext ~ res:", res)
			bloggerList({tags: tagsId.value }).then( blogs =>{
				
				bloggers.value = blogs.data.results
				currentSwiper.value = 1

			})
		})


	}

}

const handleWatchBlogger = (item) => {
	followtoggle({followee_id: item.id}).then( res =>{
		item.watch = !item.watch 
	})
}

const handleJumpPage = () => {
	uni.switchTab({
		// #ifdef APP-PLUS
		url: '/pages/index/index'
		// #endif
		// #ifndef APP-PLUS
		url: '/pages/index/index-v'
		// #endif
	})
}
</script>

<style lang="scss" scoped>
page {
	background: linear-gradient(347.88deg, #322745 0.94%, #1a1921 100%);
	height: 100vh;
}

.title {
	margin-top: 60rpx;
	font-size: 34px;
	color: #fff;
	font-weight: bold;
	text-align: center;
}

.sub-title {
	margin-top: 30rpx;
	font-size: 17px;
	color: #fff;
	font-weight: bold;
	text-align: center;
	margin-bottom: 100rpx;
}

.swiper {
	height: 75vh;
}

.swiper-item {
	// padding: 0 20rpx;
}

.labels {
	display: flex;
	flex-wrap: wrap;

	.label {
		min-width: 80rpx;
		text-align: center;
		padding: 20rpx 40rpx;
		border-radius: 100rpx;
		margin-left: 20rpx;
		margin-right: 20rpx;
		margin-bottom: 40rpx;
		white-space: nowrap;
		background-color: #ffffff80;
		color: #000;
		box-shadow: 2px 3.5px 0.5px -3px #ffffff inset;

		box-shadow: -2px -3.5px 0.5px -3px #ffffff inset;

		// &:first-child {
		// 	margin-left: 0;
		// }

		// &:first-child {
		// 	margin-right: 0;
		// }
	}
}

.custom-next {
	margin-top: 200rpx;
	color: #000;
	background-color: rgba(255, 255, 255, 0.5);
	width: 576rpx;
	height: 96rpx;
	font-size: 17px;
	border: none;
	box-shadow: 2px 3.5px 0.5px -3px #ffffff inset;

	box-shadow: -2px -3.5px 0.5px -3px #ffffff inset;
}

.blogger-list {
	padding: 0 50rpx;
}

.blogger {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;

	.left {
		display: flex;
		align-items: center;
		flex: 1;

		.name {
			margin-left: 20rpx;
			font-size: 17px;
		}
	}
}

.custom-watch {
	width: 192rpx;
	height: 72rpx;
	border-radius: 70rpx;
	border-width: 2rpx solid rgba(255, 255, 255, 0.38);
	background-color: transparent;
	color: #fff;
	font-size: 17px;
}

.watch {
	opacity: 0.3;
}
</style>
