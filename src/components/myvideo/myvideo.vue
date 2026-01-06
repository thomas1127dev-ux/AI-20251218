<template>
	<scroll-view scroll-y="true" @scrolltolower="lower" style="max-height: 90vh">
		<view class="tabs">
			<view v-for="(item, index) in tabs" :class="current == index ? 'current' : ''" @click="clicks(index)">
				{{ item }}
			</view>
		</view>
		<view class="con">
			<view class="list" v-for="(item, index) in list" :key="index" @click="topath(item,index)">
				<view class="memgceng" v-if="!userinfo.is_vip && item.is_vip && item.author.id !== uni.getStorageSync('user_info').user_id">
					<view class="">VIP视频</view>
				</view>
				<view class="memgceng" v-if="userinfo.is_vip && !item.is_free && !item.is_purchase &&  item.author.id !== uni.getStorageSync('user_info').user_id">
					<view class="">金币视频</view>
				</view>
				<image :src="item.cover_url" mode="widthFix"></image>
				<view class="play">
					<text>播放：{{ item.view_count }}</text>
					<text>{{ formatDuration(item.duration) }}</text>
				</view>
				<view class="title">{{ item.title }}</view>
				<view class="time">{{ item.create_time }}</view>
			</view>
		</view>
		<up-empty mode="data" v-if="!list.length"></up-empty>
		<Coin v-model="dialogVisible" @confirm="handleConfirm" @cancel="dialogVisible = false"
			@close="dialogVisible = false"
			:confirmText="userinfo.is_vip ? userinfo.gold_coin < obj.price ?'去充值':'确认' : '去开通'">
			<template #tip>
				<view class="" v-if="userinfo.is_vip">
					<view v-if="userinfo.gold_coin == obj.price || userinfo.gold_coin > obj.price">
						是否花费{{obj.price}}个金币查看此动态</view>
					<view v-else>此动态需要{{obj.price}}个金币,您的金币不足</view>
				</view>
				<view class="" v-if="!userinfo.is_vip">
					<view class="">

						此动态需要VIP查看,请开通vip后观看
					</view>
				</view>
			</template>
		</Coin>
	</scroll-view>
</template>
<script setup>
import {
	ref,
	reactive,
	watch
} from 'vue'
import { onShow } from '@dcloudio/uni-app';
	import {
		getVideo,purchase
	} from '@/api/setup.js'
	import {
		userinfoStore
	} from '@/store/userinfos'
	import Coin from "@/components/Coin.vue";
	const store = userinfoStore()
	const userinfo = ref({})
	
	// 初始化时获取用户信息
	const getUserInfo = () => {
		store.getUserinfo({ id: uni.getStorageSync('user_info').user_id }).then(() => {
			userinfo.value = store.userinfo
		})
	}
	
	// 组件初始化时获取用户信息
	getUserInfo()
	const current = ref(0)
	const page = ref(1)
	const list = ref([])
	const obj = ref({})
	const videoindex = ref('')
	const total = ref(0)
	const dialogVisible = ref(false)
	const tabs = reactive(['短视频', '长视频'])
	const props = defineProps({
		// 是否有关注
		isfollow: {
			type: Boolean,
			default: true
		}
	});
	const handleConfirm = () => {
		if (!userinfo.value.is_vip) {
			uni.navigateTo({
				url: '/pages/my/recharge'
			})
			return
		}
		if (userinfo.value.gold_coin < obj.value.price) {
			uni.navigateTo({
				url: '/pages/my/recharge'
			})
		} else {
			purchase({
				id: obj.value.id
			}).then(res => {
				uni.showToast({
					title: '购买成功',
					icon: 'none'
				})
				
				list.value[videoindex.value].is_purchase = true
				store.getUserinfo({ id: uni.getStorageSync('user_info').user_id }).then(() => {
					userinfo.value = store.userinfo
				})
			}).catch(err => {
				uni.showToast({
					title: err.message,
					icon: 'none'
				})
			})
		}
	}
	const topath = (item,index) => {
		obj.value = item
		videoindex.value = index
		if (item.author.id == uni.getStorageSync('user_info').user_id) {
			uni.navigateTo({
				url: '/pages/video/video?id=' + item.id
			})
			return
		}
		if(item.is_vip || item.is_purchase){
			uni.navigateTo({
				url: '/pages/video/video?id=' + item.id
			})
			return
		}
		dialogVisible.value = true
		if (!userinfo.value.is_vip && item.is_vip) return
		if (userinfo.value.is_vip && !item.is_free && !item.is_purchase) return
		uni.navigateTo({
			url: '/pages/video/video?id=' + item.id
		})

	}
	const clicks = (index) => {
		current.value = index
		list.value = []
		getlist()
	}
	const getlist = () => {
		let params = {
			currentPage: page.value,
			pageSize: 20,
			author: props.isfollow ? uni.getStorageSync('otherId') : uni.getStorageSync('user_info').user_id,
			type: current.value ? 'long' : 'short',
		}
		getVideo(params).then(res => {
			list.value = [...list.value, ...res.data.results]
			total.value = res.data.total
		})
	}
	const lower = () => {
		if (total.value > list.value.length) {
			page.value++
			getlist()
		}
	}
	watch(() => current, (newVal) => {
		list.value = []
		getlist()
	}, {
		immediate: true
	});
	const resetData = () => {
		list.value = [];
		page.value = 1;
		total.value = 0;
		getlist()
	}

	// 格式化时长：将毫秒转换为 HH:MM:SS 格式
	const formatDuration = (milliseconds) => {
		if (!milliseconds || milliseconds === 0) return '00:00:00'

		const totalSeconds = Math.round(milliseconds / 1000)
		const hours = Math.floor(totalSeconds / 3600)
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const seconds = totalSeconds % 60
		const formatNumber = (num) => num.toString().padStart(2, '0')
		return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`
	}

	// 页面显示时刷新用户信息
	onShow(() => {
		getUserInfo()
	});

	defineExpose({
		resetData
	})
</script>

<style lang="scss" scoped>
	.tabs {
		display: flex;

		view {
			margin-right: 15rpx;
			color: rgb(255, 255, 255, .8);
		}

		.current {
			color: #ffffff;
			font-size: 32rpx;
		}
	}

	.con {
		column-count: 2; //一行几个
		column-gap: 30rpx; //行间距
		margin-top: 30rpx;
	}

	.memgceng {
		position: absolute;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.7);
		width: 100%;
		height: 100%;
		z-index: 1;
		border-radius: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 26rpx;
		pointer-events: auto; // 确保蒙层可以接收点击事件

		.btn {
			background: #3b4392;
			padding: 13rpx 40rpx;
			margin-top: 25rpx;
			border-radius: 40rpx;
		}
	}

	.list {
		break-inside: avoid;
		background: #212028;
		margin-bottom: 20rpx;
		width: 100%;
		border-radius: 15rpx;
		overflow: hidden;
		position: relative;

		image {
			width: 100%;
		}

		.play {
			position: relative;
			font-size: 20rpx;
			margin: -50rpx 10rpx 20rpx 10rpx;
			display: flex;
			justify-content: space-between;
		}

		.time {
			color: rgb(255, 255, 255, .8);
			font-size: 20rpx;
			margin: 15rpx 25rpx;
		}

		.title {
			overflow: hidden;
			/* 超出隐藏   */
			white-space: nowrap;
			/* 不换行     */
			text-overflow: ellipsis;
			/* 省略号     */
			margin: 35rpx 25rpx 0 15rpx;
			font-size: 27rpx;
		}

	}
</style>