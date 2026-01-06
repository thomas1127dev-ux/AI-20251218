<template>
	<scroll-view class="page" scroll-y="true" @scrolltolower="lower">
		<view class="top">
			<view class="">
				全部评论（{{ list.length }}）
			</view>
			<view class="tabs">
				<text :class="current == 0 ? 'current' : ''" @click="tabs(0)">推荐</text>
				<text> / </text>
				<text :class="current == 1 ? 'current' : ''" @click="tabs(1)">最新</text>
			</view>
		</view>
		<view class="center" v-for="(item, index) in list" :key="index">
			<view class="" @click.stop="topath(item.user_id)">
				<up-avatar :src="item.user_avatar" size="40"></up-avatar>
			</view>
			<view class="right">
				<view class="r-top">
					<view class="info">
						<text class="name">{{ item.user_nickname }}</text>
						<text class="time">{{ item.create_time }}</text>
					</view>
					<view class="give" @click.stop="give(index)">

						<up-icon :name="item.is_liked ? 'heart-fill' : 'heart'"
							:color="item.is_liked ? '#ff0000' : '#D9D9D9'" size="22"></up-icon>
						<text>{{ item.like_count }}</text>
					</view>
				</view>
				<view class="content" @click="commentCon(item)">
					{{ item.content }}
				</view>
				
				
				
				<!-- 二级评论 -->
				<view class="children" v-for="(ite,inx) in item.children" :key="inx" v-show="expandedComments[index]">
					<view class="left">
						<up-avatar :src="ite.user_avatar" size="25"></up-avatar>
						<view class="r-top">

							<view class="info">
								<text class="name">{{ite.reply_to_user_id ? ite.reply_to_user_nickname + '回复' + ite.user_nickname: ite.user_nickname }}</text>
								<text class="time">{{ ite.create_time }}</text>
							</view>
							<view class="give" @click.stop="giveChild(index, inx)">

								<up-icon :name="ite.is_liked ? 'heart-fill' : 'heart'"
									:color="ite.is_liked ? '#ff0000' : '#D9D9D9'" size="22"></up-icon>
								<text>{{ ite.like_count }}</text>
							</view>
						</view>
					</view>
					<view class="content" @click="commentCon(ite)">
						{{ ite.content }}
					</view>
					<!-- 三级评论 -->
					<view class="grandchildren" v-for="(grandchild,grandIndex) in ite.children" :key="grandIndex">
						<view class="left">
							<up-avatar :src="grandchild.user_avatar" size="20"></up-avatar>
							<view class="r-top">
								<view class="info">
									<text class="name">{{ grandchild.user_nickname }}</text>
									<text class="time">{{ grandchild.create_time }}</text>
								</view>
								<view class="give" @click.stop="giveGrandchild(index, inx, grandIndex)">
									<up-icon :name="grandchild.is_liked ? 'heart-fill' : 'heart'"
										:color="grandchild.is_liked ? '#ff0000' : '#D9D9D9'" size="18"></up-icon>
									<text>{{ grandchild.like_count }}</text>
								</view>
							</view>
						</view>
						<view class="content" @click="commentCon(grandchild)">
							{{ grandchild.content }}
						</view>
					</view>
				</view>
				
				<!-- 加载更多子评论按钮 -->
				<view class="load-more-btn" v-if="expandedComments[index] && item.children && item.children.length < childrenTotal[index]" @click="loadMoreChildren(index)">
					<text class="load-more-text">加载更多回复</text>
					<up-icon name="arrow-down" color="#999" size="14"></up-icon>
				</view>
				
                <!-- 展开/收起按钮 -->
                <view class="expand-btn" v-if="item.count_comment" @click="toggleExpand(index)">
                	<text class="expand-text">
                		{{ expandedComments[index] ? '收起回复' : `展开${item.count_comment}条回复` }}
                	</text>
                	<up-icon 
                		:name="expandedComments[index] ? 'arrow-up' : 'arrow-down'" 
                		color="#999" 
                		size="16"
                	></up-icon>
                </view>
			</view>
		</view>
		<up-empty mode="data" v-if="!list.length">
		</up-empty>
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		getCommentList,
		commentlike,
		childrenComment
	} from '@/api/community.js'
	import {
		userinfoStore
	} from '@/store/userinfos'
	const {
		userinfo
	} = userinfoStore()
	const src = ref('http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg')
	const current = ref(0)
	const list = ref([])
	const page = ref(1)
	const total = ref(0)
	const expandedComments = ref({}) // 管理每个评论的展开状态
	const childrenPage = ref({}) // 管理每个评论的子评论分页状态
	const childrenTotal = ref({}) // 管理每个评论的子评论总数
	const emits = defineEmits(['commentCon'])
	const props = defineProps({
		detailId: {
			type: Number,
			default: 0, //动态id
		}
	})
	//点赞
	const give = (index) => {
		commentlike({
			target_id: list.value[index].id,
		}).then(res => {
			list.value[index].is_liked = !list.value[index].is_liked
			if (list.value[index].is_liked) {
				list.value[index].like_count += 1
			} else {
				list.value[index].like_count -= 1
			}
		})
	}
	
	//二级评论点赞
	const giveChild = (parentIndex, childIndex) => {
		commentlike({
			target_id: list.value[parentIndex].children[childIndex].id,
		}).then(res => {
			const child = list.value[parentIndex].children[childIndex]
			child.is_liked = !child.is_liked
			if (child.is_liked) {
				child.like_count += 1
			} else {
				child.like_count -= 1
			}
		})
	}
	
	//三级评论点赞
	const giveGrandchild = (parentIndex, childIndex, grandIndex) => {
		commentlike({
			target_id: list.value[parentIndex].children[childIndex].children[grandIndex].id,
		}).then(res => {
			const grandchild = list.value[parentIndex].children[childIndex].children[grandIndex]
			grandchild.is_liked = !grandchild.is_liked
			if (grandchild.is_liked) {
				grandchild.like_count += 1
			} else {
				grandchild.like_count -= 1
			}
		})
	}
	const commentCon = (item) => {
		emits('onfocus', item)
	}
	// 切换评论展开/收起状态
	const toggleExpand = (index) => {
		const isExpanding = !expandedComments.value[index];
		
		if (isExpanding) {
			// 展开时加载子评论
			loadChildrenComments(index, 1);
		} else {
			// 收起时清空子评论数据
			list.value[index].children = [];
			childrenPage.value[index] = 1;
		}
		
		expandedComments.value[index] = isExpanding;
	}
	
	// 加载子评论
	const loadChildrenComments = (index, pageNum) => {
		childrenComment({
			parent_id: list.value[index].id,
			currentPage: pageNum,
			// pageSize: 10
		}).then(res => {
			if (pageNum === 1) {
				// 第一页，直接赋值
				list.value[index].children = res.data.results;
			} else {
				// 后续页，追加数据
				list.value[index].children = [...list.value[index].children, ...res.data.results];
			}
			
			childrenPage.value[index] = pageNum;
			childrenTotal.value[index] = res.data.pagination.total;
		});
	}
	
	// 加载更多子评论
	const loadMoreChildren = (index) => {
		const nextPage = childrenPage.value[index] + 1;
		const total = childrenTotal.value[index];
		const currentCount = list.value[index].children?.length || 0;
		
		if (currentCount < total) {
			loadChildrenComments(index, nextPage);
		}
	}
	const tabs = (num) => {
		current.value = num
		resetData()
	}
	const getlist = () => {
		getCommentList({
				target_id: props.detailId,
				currentPage: page.value,
				pageSize: 20,
				ordering: current.value ? '-create_time' : '-like_count'
			})
			.then(res => {
				list.value = [...list.value, ...res.data.results]
				total.value = res.data.pagination.total
			})
	}
	const lower = () => {
		if (total.value > list.value.length) {
			page.value++;
			getlist()
		}
	}
	const topath = (id) => {
		uni.setStorageSync('otherId', id)
		uni.navigateTo({
			url: '/pages/my/person'
		})
	}
	onMounted(() => {
		expandedComments.value = {}; // 重置展开状态
		getlist()
	})
	const resetData = () => {
		list.value = [];
		page.value = 1;
		total.value = 0;
		expandedComments.value = {}; // 重置展开状态
		childrenPage.value = {}; // 重置子评论分页状态
		childrenTotal.value = {}; // 重置子评论总数
		getlist()
	}
	//暴露
	defineExpose({
		resetData
	})
</script>

<style lang="scss" scoped>
	.page {
		background: #212028;
		width: 95vw;
		max-height: 46vh;
		margin: 20rpx;
		margin-bottom: 0;
		padding: 0 20rpx;
		font-size: 28rpx;
		border-radius: 20rpx;
		box-sizing: border-box;

		.tabs {
			color: rgb(255, 255, 255, .5);

			.current {
				color: #fff;
			}
		}

		.top {
			display: flex;
			justify-content: space-between;
			padding-top: 20rpx;
		}

		.center {
			display: flex;
			padding-top: 20rpx;

			.right {
				width: 600rpx;
				margin-left: 20rpx;
				padding-bottom: 20rpx;
				border-bottom: 1rpx solid rgba(255, 255, 255, .1);
                .content{
					word-wrap: break-word;
					width: 90%;
				}
				
				// 展开/收起按钮样式
				.expand-btn {
					display: flex;
					align-items: center;
					margin-top: 15rpx;
					// margin-left: 60rpx;
					padding: 10rpx 0;
					cursor: pointer;
					
					.expand-text {
						color: #999;
						font-size: 24rpx;
						margin-right: 8rpx;
					}
					
					&:hover {
						.expand-text {
							color: #fff;
						}
					}
				}
				
				// 加载更多按钮样式
				.load-more-btn {
					display: flex;
					align-items: center;
					margin-top: 10rpx;
					margin-left: 60rpx;
					padding: 8rpx 0;
					cursor: pointer;
					
					.load-more-text {
						color: #666;
						font-size: 22rpx;
						margin-right: 6rpx;
					}
					
					&:hover {
						.load-more-text {
							color: #999;
						}
					}
				}
				
				.children {
					margin-top: 20rpx;
					.left {
						display: flex;
						width: 500rpx;
						.r-top {
							margin-left: 10rpx;
							
							width: 510rpx;
							.info{
								.name{
									width: 400rpx;
									font-size: 24rpx;
								}
								.time{
									font-size: 22rpx;
								}
							}
							.give{
								display: flex;
								align-items: center;
								width: 90rpx;
								justify-content: flex-end;
							
							}
							
						}

					}

					.content {
						margin-left: 60rpx;
						word-wrap: break-word;
						width: 80%;
						font-size: 24rpx;
						color: rgb(255, 255, 255, .9);
					}
					
					// 三级评论样式
					.grandchildren {
						margin-top: 15rpx;
						margin-left: 40rpx;
						
						.left {
							display: flex;
							width: 450rpx;
							
							.r-top {
								margin-left: 8rpx;
								width: 460rpx;
								display: flex;
								justify-content: space-between;
								align-items: center;
								
								.info {
									.name {
										color: #fff;
										width: 350rpx;
										font-size: 24rpx;
									}
									
									.time {
										font-size: 20rpx;
										color: rgb(255, 255, 255, .5);
									}
								}
								
								.give {
									display: flex;
									align-items: center;
									width: 80rpx;
									justify-content: flex-end;
									
									text {
										margin-left: 4rpx;
										font-size: 20rpx;
									}
								}
							}
						}
						
						.content {
							margin-left: 50rpx;
							word-wrap: break-word;
							width: 75%;
							font-size: 24rpx;
							color: rgb(255, 255, 255, .8);
						}
					}
				}

				.r-top {
					display: flex;
					width: 100%;
					// justify-content: space-between;
					margin-bottom: 20rpx;
					color: rgb(255, 255, 255, .6);
				
					.info {
						display: flex;
						flex-direction: column;
                        width:480rpx;
						
						.name {
							color: #fff;
							display: block;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}

						.time {
							font-size: 24rpx;
						}
					}

					.give {
						display: flex;
						align-items: center;
						width: 90rpx;
						justify-content: flex-end;
						text {
							margin-left: 5rpx;
						}
					}
				}


			}
		}
	}
</style>