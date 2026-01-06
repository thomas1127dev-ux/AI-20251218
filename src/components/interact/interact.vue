<template>
	<scroll-view scroll-y="true" @scrolltolower="lower" style="max-height: 90vh">
		<view v-for="(item, index) in list" :key="index" class="con"
			@click="uni.navigateTo({ url: '/pages/community/details?id=' + item.dynamic.id })">
			<view class="desc" v-if="item.type == 'like'">{{ item.user.nickname }}点赞了你的动态</view>
			<view class="desc" v-if="item.type == 'comment'">@{{ item.user.nickname }}了你：{{ item.target.content }}</view>
			<view class="bg">
				<view class="top">
					<view class="left">
						<view @click.stop="topath(item.user.id)"><up-avatar :src="item.user.avatar"
								size="40"></up-avatar></view>
						<view class="message">
							<text>{{ item.user.nickname }}</text>
						</view>
					</view>
					<view class="follow">
						<!-- <text v-if="!item.is_follower && item.targetId !== item.userId"
							@click.stop="follow(index)">关注</text> -->
						<view class="" @click.stop="oparea">
							<up-icon name="more-dot-fill" color="#ffffff" size="28"></up-icon>
						</view>
					</view>
				</view>
				<view class="title">{{ item.dynamic.title }}</view>
				<view class="images">
					<image mode="" v-for="(images, indexs) in item.dynamic.images" :key="indexs" :src="images"></image>
				</view>
			</view>
			<view class="bottom">
				<view class="">
					{{ item.create_time }}
				</view>
				<view class="right">
					<view class="" @click.stop="give(index)" v-if="item.type == 'comment'">
						<up-icon :name="item.is_liked ? 'thumb-up-fill' : 'thumb-up'"
							:color="item.is_liked ? '#ff0000' : '#ffffff'" size="26"></up-icon>
						<text>{{ item.dynamic.like_count || 0 }}</text>
					</view>
				</view>
			</view>
		</view>
		<operation :show="show" @update:show="val => show = val" />
		<up-empty mode="data" v-if="!list.length"></up-empty>
	</scroll-view>
</template>

<script setup>
import {
	ref,
	reactive,
	onMounted
} from 'vue'
import {
	commentlike,
	followtoggle
} from '@/api/community.js'
import {
	allList
} from '@/api/setup.js'
const src = ref('http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg')
const show = ref(false)
const total = ref(0)
const list = ref([])
const page = ref(1)
const give = (index) => {
	let params = {
		target_id: list.value[index].dynamic.id
	}
	if (list.value[index].is_liked) {
		list.value[index].dynamic.like_count -= 1;
	} else {
		list.value[index].dynamic.like_count += 1;
	}
	commentlike(params).then(res => {
		list.value[index].is_liked = !list.value[index].is_liked
	})
}
const follow = (index) => {
	let params = {
		followeeId: list.value[index].targetAuthorId
	}
	followtoggle(params).then(res => {
		list.value[index].is_follower = !list.value[index].is_follower
	})
}
const oparea = () => {
	show.value = true
}
const getlist = () => {
	allList({
		currentPage: page.value,
		pageSize: 20
	}).then(res => {
		list.value = [...list.value,...res.data.results]
		total.value = res.data.pagination.total
	})
}
const topath = (id) => {
	uni.setStorageSync('otherId', id)
	uni.navigateTo({
		url: '/pages/my/person'
	});
}
const lower = () => {
	if (total.value > list.value.length) {
		page.value++
		getlist()
	}
}
const resetData = () => {
	list.value = [];
	page.value = 1;
	total.value = 0;
	getlist()
}
onMounted(() => {
	getlist()
})
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
		// padding:20rpx;
		padding: 20rpx 20rpx 0 20rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		border-radius: 20rpx;
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
		width: 46%;
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