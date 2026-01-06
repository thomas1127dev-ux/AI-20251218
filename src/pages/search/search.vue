<template>
	<!-- 参考这个 -->
	<z-paging ref="paging" v-model="dataList" @query="queryList" :auto="false">
		<template #top>
			<!-- 导航栏 -->
			<up-navbar bgColor="transparent" leftIconColor="#fff" placeholder autoBack :fixed="false">
				<template #right>
					<view class="search">
						<up-input
							placeholder="输入搜索内容"
							prefixIcon="search"
							shape="circle"
							border="none"
							style="height: 28px"
							prefixIconStyle="font-size: 22px;color: #fff"
							color="#fff"
							v-model="searchText"
						>
							<template #suffix>
								<text @click="handleClickSearch">搜索</text>
							</template>
						</up-input>
					</view>
				</template>
			</up-navbar>
		</template>

		<!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
		<!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
		<view class="content">
			<!-- 历史搜索 -->
			<view class="history_search" v-if="searchHistroyList.length > 0">
				<view class="title_box">
					<view class="title">历史搜索</view>
					<view class="clear_btn" @click="clearHistoryHandle">清除</view>
				</view>
				<view class="history_list">
					<view class="item" v-for="i in searchHistroyList" :key="i" @click="handleCheckHistory(i)">
						{{ i }}
					</view>
				</view>
			</view>

			<!-- 选择标签 -->
			<view class="select_tag">
				<view class="title">选择标签</view>
				<view class="tags_box">
					<view class="tag_list" v-for="(item, i) in tagsList" :key="i">
						<view class="tag_class">{{ item.name }}：</view>
						<view class="lebel_list">
							<view :class="['item', sub?.checked ? 'active' : '']" v-for="(sub, j) in item.children" :key="j" @click="selectLabelHandle(item, i, sub, j)">
								{{ sub.label }}
							</view>
						</view>
					</view>
				</view>
			</view>

			<!--  -->
			<view class="all_video">
				<view class="title">全部视频列表</view>
				<view class="card-list">
					<card-view v-for="item in dataList" :item="item" @click="handleToLongVideo(item.id)"></card-view>
				</view>
			</view>
		</view>
	</z-paging>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import CardView from './CardView.vue';

import { search } from '@/api/public.js';

// 标签数组
const tagsList = ref([
	// {
	// 	name: '类型',
	// 	children: [
	// 		{
	// 			label: '影片',
	// 			value: 1
	// 		},
	// 		{
	// 			label: '帖子',
	// 			value: 2
	// 		},
	// 		{
	// 			label: '动漫',
	// 			value: 3
	// 		}
	// 	]
	// },
	{
		name: '排序',
		children: [
			{
				label: '热门影视',
				value: 'like_count',
				checked: true
			},
			{
				label: '收藏最多',
				value: 'favorite_count'
			},
			{
				label: '最新上架',
				value: 'create_time'
			}
		]
	},
	// {
	// 	name: '标签',
	// 	children: [
	// 		{
	// 			label: '全部标签',
	// 			value: 1
	// 		},
	// 		{
	// 			label: '标签1',
	// 			value: 2
	// 		},
	// 		{
	// 			label: '标签2',
	// 			value: 3
	// 		},
	// 		{
	// 			label: '标签4',
	// 			value: 4
	// 		},
	// 		{
	// 			label: '标签5',
	// 			value: 5
	// 		},
	// 		{
	// 			label: '标签6',
	// 			value: 6
	// 		}
	// 	]
	// },
	{
		name: '价格',
		children: [
			{
				label: '全类型',
				value: 'all',
				checked: true
			},
			{
				label: 'VIP免费',
				value: 'vip'
			},
			{
				label: '付费解锁',
				value: 'pay'
			}
		]
	},
	{
		name: '时间',
		children: [
			{
				label: '本周',
				value: 'week',
				checked: true
			},
			{
				label: '本月',
				value: 'month'
			},
			{
				label: '半年',
				value: 'half_year'
			},
			{
				label: '更久',
				value: 'longer'
			}
		]
	}
]);

const searchObj = reactive({
	time_range: 'week',
	price_type: 'all',
	ordering: 'like_count'
});

// 搜索内容
const searchText = ref('');
// 搜索历史记录
const searchHistroyList = ref([]);

onLoad(() => {
	const history = uni.getStorageSync('serahHistory');
	if (history) searchHistroyList.value = history;
});

const paging = ref(null);
// v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
const dataList = ref([]);

const queryList = (pageNo, pageSize) => {
	if( searchObj.price_type === 'all' ) {
		searchObj.is_vip = false
		searchObj.paid_only = false
		delete searchObj.price_type
	}
	if( searchObj.price_type === 'vip' ) {
		searchObj.is_vip = true
		searchObj.paid_only = false
		delete searchObj.price_type
	}
	if( searchObj.price_type === 'pay' ) {
		searchObj.paid_only = true
		searchObj.is_vip = false
		delete searchObj.price_type
	}

	const params = {
		search: searchText.value,
		...searchObj,
		currentPage: pageNo,
		pageSize
	};
	search(params).then((res) => {
		console.log('searchRes', res);
		if (res.code === 200) {
			paging.value.complete(res.data.results);
		} else {
			paging.value.complete(false);
		}
	});
};

// 清除历史搜索记录
const clearHistoryHandle = () => {
	searchHistroyList.value = [];
	uni.setStorageSync('search_history', []);
};
//xuanzebiaoqian
const selectLabelHandle = (item, i, sub, j) => {
	item.children.forEach((e) => (e.checked = false));
	item.children[j].checked = !sub?.checked;
	if (item.name == '价格') searchObj.price_type = item.children[j].value;
	if (item.name == '排序') searchObj.ordering = item.children[j].value;
	if (item.name == '时间') searchObj.time_range = item.children[j].value;
};
const handleToLongVideo = (id) => {
	uni.navigateTo({
		url: '/pages/video/video?id=' + id
	});
};

// 搜索
const handleClickSearch = () => {
	if (searchText.value && searchHistroyList.value.indexOf(searchText.value) == -1) searchHistroyList.value.unshift(searchText.value);
	uni.setStorageSync('search_history', searchHistroyList.value);

	paging.value.reload();
};
// 点击历史记录
const handleCheckHistory = (txt) => {
	searchText.value = txt;
};
</script>

<style lang="scss">
.search {
	width: 600rpx;
	display: flex;
	justify-content: space-between;

	.search_left {
		display: flex;
		align-items: center;
	}
}

.content {
	padding: 20rpx;

	.history_search {
		margin-bottom: 6rpx;

		.title_box {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		color: rgba(255, 255, 255, 0.7);
		font-size: 30rpx;

		.history_list {
			display: flex;
			flex-wrap: wrap;
			margin-top: 26rpx;
			max-height: 150rpx;
			overflow: hidden;

			.item {
				background: rgba(255, 255, 255, 0.1);
				padding: 7rpx 23rpx;
				border-radius: 26rpx;
				margin: 0 20rpx 20rpx 0;
			}
		}
	}

	.select_tag {
		margin-bottom: 46rpx;

		.title {
			color: rgba(255, 255, 255, 0.7);
			font-size: 30rpx;
			margin-bottom: 20rpx;
		}

		.tags_box {
			background: rgba(255, 255, 255, 0.1);
			padding: 40rpx;
			border-radius: 10rpx;

			.tag_list {
				margin-bottom: 40rpx;
				display: flex;

				&:last-child {
					margin-bottom: 0;
				}

				.tag_class {
					width: 100rpx;
				}

				.lebel_list {
					display: flex;
					flex-wrap: nowrap;
					overflow-x: auto;
					flex: 1;

					.item {
						margin-right: 40rpx;
						word-break: keep-all;

						&.active {
							color: mediumpurple;
						}
					}
				}
			}
		}
	}
}

.all_video {
	.title {
		color: rgba(255, 255, 255, 0.7);
		font-size: 30rpx;
		margin-bottom: 20rpx;
	}

	.card-list {
		display: flex;
		flex-wrap: wrap;
		margin-top: 20rpx;

		.card-view {
			margin-right: 20rpx;
			margin-bottom: 20rpx;

			&:nth-child(2n) {
				margin-right: 0;
			}
		}
	}
}
</style>
