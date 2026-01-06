<template>
	<z-paging-swiper>
		<template #top>
			<!-- 导航栏 -->
			<up-navbar bgColor="transparent" placeholder :autoBack="false" :fixed="false">
				<template #left>
					<!-- 移除tabs，只显示"关注"标题 -->
					<view class="page-title">朋友圈</view>
				</template>

			<!-- 	<template #right>
					<view class="search" @click="uni.navigateTo({ url: '/pages/search/search' })">
						<up-icon name="search" color="#fff" size="22"></up-icon>
						<text>搜索</text>
					</view>
				</template> -->
			</up-navbar>
		</template>

		<!-- 只显示关注内容，移除swiper -->
		<view class="content">
			<active :more="true" :tabs="1" :isfollow="false" ref="activeRef" />
		</view>

		<!-- 刷新状态指示器 -->
		<view v-if="refreshing" class="refresh-indicator">
			<up-loading-icon mode="circle" color="#ffffff" size="20"></up-loading-icon>
			<text class="refresh-text">正在刷新...</text>
		</view>

		<dragball>
			<template #content>
				<view class="dragball" @click="clicks">
					<image src="/static/images/icon_add_community.png" mode=""></image>
				</view>
			</template>
		</dragball>
		<Coin v-model="dialogVisible" @confirm="handleConfirm" @cancel="dialogVisibl = false"
			@close="dialogVisibl = false" :confirmText="'去开通'">
			<template #tip>
				请开通VIP后发布内容
			</template>
		</Coin>
	</z-paging-swiper>
</template>

<script setup>
	import {
		ref,
		onMounted,
		nextTick
	} from 'vue';
	// import tabs from '@/components/tabs/tabs.vue'; // 移除tabs组件
	import SocialPost from './components/SocialPost.vue';
import {
	onPullDownRefresh,
	onShow
} from '@dcloudio/uni-app';
	import {
		communityList
	} from '@/api/community.js';
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
	// 移除 current 和 list，只保留必要的变量
	const page = ref(1);
	const total = ref(0);
	const loading = ref(false);
	const refreshing = ref(false);
	const activeRef = ref(null); // 单个active组件引用
	const dialogVisible = ref(false);
	const lastRefreshTime = ref(0);

	// 移除 list 和 setActiveRef

	const refreshData = async () => {
		if (refreshing.value) return;
		const now = Date.now();
		if (now - lastRefreshTime.value < 2000) {
			uni.stopPullDownRefresh();
			return;
		}
		refreshing.value = true;
		lastRefreshTime.value = now;
		page.value = 1;
		const timeoutId = setTimeout(() => {
			if (refreshing.value) {
				refreshing.value = false;
				uni.stopPullDownRefresh();
				uni.showToast({
					title: '刷新超时，请重试',
					icon: 'none',
					duration: 2000
				});
			}
		}, 10000);

		try {
			// 直接调用activeRef的刷新方法
			if (activeRef.value && activeRef.value.refreshData) {
				await activeRef.value.refreshData();
			} else if (activeRef.value && activeRef.value.getlist) {
				await activeRef.value.resetData();
				await activeRef.value.getlist(1); // tabs=1 (关注)
			}
			clearTimeout(timeoutId);
			uni.vibrateShort({
				type: 'light'
			});
			refreshing.value = false;
			uni.stopPullDownRefresh();

		} catch (error) {
			clearTimeout(timeoutId);
			refreshing.value = false;
			uni.stopPullDownRefresh();
		}
	};

	// 移除 onTabChange 方法

	const clicks = () => {
		if(userinfo.value.is_vip){
			uni.navigateTo({
				url: '/pages/community/publish'
			});
		}else{
			dialogVisible.value = true
		}
	};
    const handleConfirm = () => {
		 uni.navigateTo({
		 	url:'/pages/my/recharge'
		 })
	}
	// 下拉刷新
	onPullDownRefresh(() => {
		refreshData();

	});
	onShow(() => {
	     getUserInfo()
	});
</script>
<style lang="scss" scoped>
	// 页面标题样式
	.page-title {
		color: #fff;
		font-size: 20px;
		font-weight: 600;
	}

	.content {
		margin: 20rpx;
		height: 100%;
	}

	.dragball {
		background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		text-align: center;
		line-height: 80rpx;
		font-size: 90rpx;
		font-weight: bold;

		image {
			width: 100%;
			height: 100%;
		}
	}

	// 刷新状态样式
	.refreshing {
		opacity: 0.7;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	// 刷新指示器样式
	.refresh-indicator {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: rgba(0, 0, 0, 0.8);
		padding: 20rpx 40rpx;
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		backdrop-filter: blur(10rpx);

		.refresh-text {
			color: #ffffff;
			font-size: 28rpx;
			margin-left: 20rpx;
		}
	}

	// 内容区域刷新时的动画效果
	.content {
		transition: all 0.3s ease;

		&.refreshing {
			transform: translateY(10rpx);
			filter: blur(1rpx);
		}
	}
</style>