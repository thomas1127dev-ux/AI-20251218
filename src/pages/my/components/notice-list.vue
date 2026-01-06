<template>
	<view class="">
		<view v-for="(item, index) in list" :key="index" class="con">
			<view class="top">
				<view class="left">
					<up-avatar :src="item.user.avatar" size="40"></up-avatar>
					<view class="message">
						<text>{{ item.user.user_nickname }}</text>
					</view>
				</view>

			</view>
			<view class="bg">
				<view class="title">{{ item.content }}</view>
			</view>
			<view class="bottom">
				<view class="">
					{{ item.create_time }}
				</view>
			</view>
		</view>
		<up-empty mode="data" v-if="!list.length"></up-empty>
	</view>
</template>

<script setup>
import {
	ref, onMounted
} from 'vue'
import { getNotice } from '@/api/message.js'
const src = ref('http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg')
import { onReachBottom } from '@dcloudio/uni-app';
const list = ref([])
const page = ref(1)
const total = ref(0)
onMounted(() => {
	getlist()
})
const getlist = () => {
	getNotice({
		currentPage: page.value,
		pageSize: 20
	}).then(res => {
		list.value = [...list.value,...res.data.results]
		total.value = res.data.pagination.total

	})
}
onReachBottom(() => {
	if (total.value > list.value.length) {
		page.value++
		getlist()
	}
})
const resetData = () => {
	list.value = [];
	page.value = 1;
	total.value = 0;
	getlist()
}
defineExpose({
	resetData
})
</script>

<style lang="scss" scoped>
.con {
	background: #212028;
	margin-bottom: 20rpx;
	padding: 20rpx;
	border-radius: 15rpx;

	.bg {
		background: #28272e;
		padding: 10rpx 20rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.desc {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}

.top {
	display: flex;
	align-items: center;
	justify-content: space-between;


	.follow {
		display: flex;

		text {
			margin-right: 20rpx;
			border: 1rpx solid #ffffff;
			padding: 10rpx 40rpx;
			border-radius: 60rpx;
			font-size: 28rpx;
		}
	}

	.left {
		display: flex;
		align-items: center;

		.message {
			display: flex;
			flex-direction: column;
			margin-left: 20rpx;

			.time {
				font-size: 18rpx;
				color: rgba(255, 255, 255, .6);
			}
		}
	}
}

.title {
	margin: 20rpx 0;
}

.images {
	display: flex;
	flex-wrap: wrap;

	image {
		width: 48%;
		height: 300rpx;
		margin: 0 13rpx 30rpx 0;
		border-radius: 15rpx;
	}
}

.bottom {
	display: flex;
	justify-content: space-between;
	color: rgba(255, 255, 255, .6);
	font-size: 28rpx;

	view {
		display: flex;
		align-items: center;

	}

	.right {
		display: flex;

		view {
			margin-right: 7rpx;
		}

	}

}
</style>