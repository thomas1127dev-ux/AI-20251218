<template>
	<z-paging ref="paging" :loading-more-enabled="false" :refresher-enabled="false">
		<template #top>
			<!-- 导航栏 -->
			<up-navbar bgColor="transparent" color="#fff" placeholder autoBack :fixed="false">
				<template #left>
					<up-icon name="arrow-left" color="#fff" size="18"></up-icon>
				</template>

				<template #center>
					<view>游戏详情</view>
				</template>

				<!-- 	<template #right>
					<view>分享</view>
				</template> -->
			</up-navbar>
		</template>

		<template #bottom>
			<view class="bottom-btn">
				<up-button :text="downConditions" class="custom-down" shape="circle" @click="handleClickDown"></up-button>
			</view>
		</template>

		<view class="content">
			<view class="game-info">
				<up-image :src="dataDetail.image_url" width="200rpx" height="200rpx" radius="30rpx"></up-image>

				<view class="info">
					<view class="name">{{ dataDetail.name }}</view>
					<view class="des">{{ dataDetail.description }}</view>
				</view>
			</view>

			<view class="screen-shoot">
				<view class="tit">游戏截图</view>
				<swiper 
					class="screenshot-swiper" 
					:indicator-dots="true" 
					:autoplay="true" 
					:interval="3000" 
					:duration="500"
					indicator-color="rgba(255, 255, 255, 0.3)"
					indicator-active-color="#fff"
				>
					<swiper-item v-for="(imageUrl, index) in screenshotImages" :key="index">
						<up-image 
							:src="imageUrl" 
							width="710rpx" 
							height="320rpx" 
							radius="30rpx"
							class="screenshot-image"
						></up-image>
					</swiper-item>
				</swiper>
			</view>

			<view class="long-des">
				<view class="tit">游戏文案</view>
				<view class="des">
					{{ dataDetail.description }}
				</view>
			</view>
		</view>
		
		<!-- VIP/金币校验弹窗 -->
		<Coin v-model="dialogVisible" @confirm="handleConfirm" @cancel="dialogVisible = false"
			@close="dialogVisible = false" :confirmText="userinfo.is_vip ? (userinfo.gold_coin < dataDetail.price ? '去充值' : '确认') : '去开通'">
			<template #tip>
				<view v-if="userinfo.is_vip">
					<view v-if="userinfo.gold_coin >= dataDetail.price">
						是否花费{{dataDetail.price}}个金币下载此游戏
					</view>
					<view v-else>
						此游戏需要{{dataDetail.price}}个金币,您的金币不足
					</view>
				</view>
				<view v-if="!userinfo.is_vip">
					<view>
						此游戏需要VIP下载,请开通VIP后下载
					</view>
				</view>
			</template>
		</Coin>
	</z-paging>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';

import { adsDetail,purchase } from '@/api/public.js';
import { userinfoStore } from '@/store/userinfos';
import Coin from "@/components/Coin.vue";
const id = ref(0);
const paging = ref(null);
const dataDetail = ref({});
const dialogVisible = ref(false);
const store = userinfoStore();
const userinfo = ref({})

// 初始化时获取用户信息
const getUserInfo = () => {
	store.getUserinfo({ id: uni.getStorageSync('user_info').user_id }).then(() => {
		userinfo.value = store.userinfo
	})
}

// 组件初始化时获取用户信息
getUserInfo()
onLoad((options) => {
	id.value = options.id;
	queryList();
});

const downConditions = computed(() => {
	if(dataDetail.value.is_purchase){
		return '已购买'
	}
	if( !dataDetail.value.is_vip && !dataDetail.value.price ) {
		return '免费下载'
	}
	if( dataDetail.value.is_vip && !dataDetail.value.price ) {
		return 'VIP免费下载'
	}
	if(  dataDetail.value.price ) {
		return `支付${dataDetail.value.price}金币下载`
	}
});

// 处理游戏截图图片数组
const screenshotImages = computed(() => {
	if (!dataDetail.value.banner_game_url) return [];
	return dataDetail.value.banner_game_url.split(',').filter(url => url.trim());
});

const queryList = (pageNo, pageSize) => {
	adsDetail(id.value).then((res) => {
		console.log('res', res);
		if (res.code === 200) {
			dataDetail.value = res.data;
		}
	});
};

const handleClickDown = () => {
	if(dataDetail.value.is_purchase){
		downloadGame();
		dialogVisible.value = false
		return
	}
	if (!userinfo.is_vip && dataDetail.value.is_vip) {
		dialogVisible.value = true;
		return;
	}
	if (userinfo.is_vip && dataDetail.value.price && userinfo.gold_coin < dataDetail.value.price) {
		dialogVisible.value = true;
		return;
	}
	if (userinfo.is_vip && dataDetail.value.price && userinfo.gold_coin >= dataDetail.value.price) {
		dialogVisible.value = true;
		return;
	}
};

const downloadGame = () => {
	// #ifdef APP-PLUS
	plus.runtime.openURL(dataDetail.value.click_url);
	// #endif

	// #ifdef H5
	window.open(dataDetail.value.clickUrl, '_blank');
	// #endif
};

// 处理弹窗确认
const handleConfirm = () => {
	if (!userinfo.value.is_vip) {
		uni.navigateTo({
			url: '/pages/my/recharge'
		});
	} else if (userinfo.value.gold_coin < dataDetail.value.price) {
		uni.navigateTo({
			url: '/pages/my/recharge'
		});
	} else {
		purchase({id:dataDetail.value.id}).then(res => {
			uni.showToast({
				title:'购买成功',
				icon:'none'
			}).then(res => {
				queryList();
				store.getUserinfo({ id: uni.getStorageSync('user_info').user_id }).then(() => {
					userinfo.value = store.userinfo
				})
				downloadGame();
			})
			
		})
		
	}
};

// 页面显示时刷新用户信息
onShow(() => {
	getUserInfo()
});
</script>

<style lang="scss" scoped>
.content {
	padding: 20rpx;

	display: flex;
	flex-wrap: wrap;

	.game-info {
		display: flex;

		.info {
			margin-left: 20rpx;

			.name {
				margin-top: 20rpx;
				font-size: 21px;
			}

			.des {
				margin-top: 20rpx;
				font-size: 12px;
				color: rgba(255, 255, 255, 0.6);
			}
		}
	}

	.screen-shoot {
		margin-top: 50rpx;

		.tit {
			font-size: 15px;
			margin-bottom: 20rpx;
		}

		.screenshot-swiper {
			height: 320rpx;
			width: 710rpx;
			
			.screenshot-image {
				width: 710rpx;
				height: 320rpx;
			}
		}
	}
}

.long-des {
	margin-top: 50rpx;

	.tit {
		font-size: 15px;
		margin-bottom: 20rpx;
	}

	.des {
		font-size: 17px;
	}
}

.bottom-btn {
	background: linear-gradient(180deg, #1a1921 0%, #312744 100%);
	padding: 40rpx 30rpx;

	.custom-down {
		background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
		color: #fff;
		font-size: 17px;
		font-weight: 400;
		border: none;
		height: 85rpx;
	}
}
</style>
