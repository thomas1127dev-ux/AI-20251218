<template>
	<z-paging ref="paging" v-model="dataList" @query="queryList">
		<template #top>
			<!-- 导航栏 -->
			<up-navbar bgColor="transparent" color="#fff" placeholder autoBack :fixed="false">
				<template #left>
					<up-icon name="arrow-left" color="#fff" size="18"></up-icon>
				</template>

				<template #center>
					<view>游戏推荐</view>
				</template>

				<!-- <template #right>
					<up-icon name="more-dot-fill" color="#fff" size="18"></up-icon>
				</template> -->
			</up-navbar>
		</template>

		<!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
		<!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
		<view class="content">
			<up-swiper height="166" radius="15" keyName="image_url" :list="bannerList" @click="handleClickSwiper"
				v-if="bannerList.length > 0"></up-swiper>

			<!-- 游戏分类 -->
			<view class="game-category">
				<up-tabs :list="categoryList" lineColor="transparent" :activeStyle="{
						color: '#fff',
						fontSize: '17px',
						fontWeight: 'bold'
					}" :inactiveStyle="{
						color: 'rgba(255,255,255, 0.6)',
						fontSzie: '15px'
					}" itemStyle="padding-top: 20rpx;padding-right:20rpx; padding-left:0;" @click="clicks"></up-tabs>
			</view>

			<!-- 游戏列表 -->
			<view class="game-list">
				<view class="game-item" v-for="item in dataList">
					<view class="game">
						<up-image :src="item.image_url" width="120rpx" height="120rpx" radius="20rpx"></up-image>
						<view class="des">
							<view class="name">{{ item.name }}</view>
							<view class="sub">{{ item.description }}</view>
						</view>
					</view>

					<up-button text="查看详情" shape="circle" class="custom-btn"
						@click="handleToDetail(item.id)"></up-button>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		getAdsList,
		getTags
	} from '@/api/public';

	const bannerList = ref([]);
    const categoryId = ref('')
	const categoryList = ref([{
		name: '全部'
	}]);

	// 点击banner
	const handleClickSwiper = (i) => {
		const url = bannerList.value[i].click_url;

		// #ifdef APP-PLUS
		plus.runtime.openURL(url);
		// #endif

		// #ifdef H5
		window.open(url, '_blank');
		// #endif
	};

	onLoad(() => {
		getBannerList();
		getCatetory()
	});

	// 游戏广告banner
	const getBannerList = async () => {
		const params = {
			type: 'game_ads',
			currentPage: 1,
			pageSize: 5
		};
		const res = await getAdsList(params);
		if (res.code === 200) {
			bannerList.value = res.data.results;
		}
	};

	const paging = ref(null);

	// 游戏列表
	const dataList = ref([]);

	const queryList = (pageNo, pageSize) => {
		
		const params = {
			type: 'game',
			currentPage: pageNo,
			pageSize,
			game_tags:categoryId.value || ''
		};
		if(!categoryId.value){
			 delete  params.game_tags
		}
		getAdsList(params)
			.then((res) => {
				console.log('resres', res);
				// 将请求结果通过complete传给z-paging处理，同时也代表请求结束，这一行必须调用
				paging.value.complete(res.data.results);
			})
			.catch((res) => {
				// 如果请求失败写paging.value.complete(false);
				paging.value.complete(false);
			});
	};

	const handleToDetail = (id) => {
		uni.navigateTo({
			url: '/pages/fresh/recommend/game-detail?id=' + id
		});
	};

	const getCatetory = () => {
		getTags({
			type: 'content_game'
		}).then(res => {
			categoryList.value = [...categoryList.value, ...res.data.results]
		})
	}
	const clicks = (item) => {
		categoryId.value = item.id
		queryList()
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 20rpx;

		.game-item {
			display: flex;
			align-items: center;
			margin-top: 20rpx;

			.game {
				display: flex;
				align-items: center;
				flex: 1;

				.des {
					margin-left: 20rpx;

					.name {
						font-size: 17px;
						font-weight: bold;
					}

					.sub {
						font-size: 11px;
					}
				}
			}

			.custom-btn {
				background: linear-gradient(180deg, #5662e1 0%, #614793 100%);
				width: 180rpx;
				height: 80rpx;
				border-radius: 40rpx;
				border: none;
				font-size: 15px;
				color: #fff;
			}
		}
	}
</style>