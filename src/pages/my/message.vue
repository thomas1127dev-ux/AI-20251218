<template>
	<view class="message-page">
		<!-- 按Figma设计：顶部显示"X EVA"标题 -->
		<up-navbar bgColor="transparent" placeholder :autoBack="false" :fixed="false">
			<template #center>
				<view class="page-title">X EVA</view>
			</template>
		</up-navbar>

		<!-- 主Tab切换 -->
		<view class="main-tabs">
			<view
				class="main-tab-item"
				:class="{ active: mainTab === 0 }"
				@click="switchMainTab(0)"
			>
				<text class="tab-text">对话列表</text>
				<view v-if="mainTab === 0" class="tab-indicator"></view>
			</view>
			<view
				class="main-tab-item"
				:class="{ active: mainTab === 1 }"
				@click="switchMainTab(1)"
			>
				<text class="tab-text">克隆人</text>
				<view v-if="mainTab === 1" class="tab-indicator"></view>
			</view>
		</view>

		<view class="content">
			<!-- Tab 1: 对话列表 -->
			<view v-if="mainTab === 0" class="tab-content">
				<messageList ref="message"/>
			</view>

			<!-- Tab 2: 克隆人 -->
			<view v-if="mainTab === 1" class="tab-content">
				<!-- 克隆人区域 -->
				<view class="clone-section">
					<view class="clone-header">
						<view class="clone-tabs">
							<view
								class="tab-item"
								:class="{ active: cloneTab === 0 }"
								@click="switchCloneTab(0)"
							>
								我拥有的
							</view>
							<view
								class="tab-item"
								:class="{ active: cloneTab === 1 }"
								@click="switchCloneTab(1)"
							>
								我创造的
							</view>
						</view>
						<view class="create-btn" @click="goCreate">
							<text class="plus-icon">+</text>
						</view>
					</view>

					<!-- 克隆人列表 - 网格布局 -->
					<view v-if="cloneList.length" class="clone-grid">
						<view
							v-for="item in cloneList"
							:key="item.id"
							class="clone-card"
							@click="openChat(item)"
						>
							<!-- 右上角更多按钮 -->
							<view class="more-btn" @click.stop="showActionMenu(item)">
								<text class="icon">⋯</text>
							</view>

							<image class="clone-avatar" :src="item.avatar" mode="aspectFill" />
							<view class="clone-name">{{ item.name }}</view>
							<view class="clone-info">
								<text class="clone-tag" v-if="item.prototype">{{ item.prototype }}</text>
							</view>
						</view>
					</view>
					<view v-else class="clone-empty">
						<view class="empty-icon">👤</view>
						<text class="empty-text">{{ cloneTab === 0 ? '暂无拥有的克隆人' : '还没有创造克隆人' }}</text>
						<view class="empty-btn" @click="goCreate">
							<text>立即创建</text>
						</view>
					</view>
				</view>
			</view>

			<!-- TODO: 互动和通知功能暂时隐藏，保留代码以备后用 -->
			<!-- <interact v-if="current == 1" ref="hudong"/>
			<noticeList v-if="current == 2" ref="notice"/> -->
		</view>

		<!-- TODO: z-paging暂时移除，因为使用Mock数据不需要分页加载 -->
		<!-- <z-paging ref="paging">...</z-paging> -->

		<!-- 操作菜单弹窗 -->
		<up-action-sheet
			:show="showActions"
			:actions="actionList"
			title="选择操作"
			@close="showActions = false"
			@select="onActionSelect"
		/>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue';
	import messageList from './components/message-list.vue'
	import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';
	import { getOwnedClones, getCreatedClones } from '@/api/clone.js'
	import { userinfoStore } from '@/store/userinfos.js'
	import { getAvatarUrl } from '@/utils/avatar.js'
	import { CacheManager } from '@/utils/cache-manager.js'

	// TODO: 互动和通知功能暂时隐藏，保留导入以备后用
	// import noticeList from './components/notice-list.vue'
	// import interact from './components/interact.vue'

	const store = userinfoStore()
	const message = ref(null)
	const mainTab = ref(0) // 0: 对话列表, 1: 克隆人
	const cloneTab = ref(0) // 0: 我拥有的, 1: 我创造的
	const cloneList = ref([]) // 克隆人列表

	// 操作菜单相关
	const showActions = ref(false)
	const currentClone = ref(null)
	const actionList = ref([
		{ name: '查看详情', color: '#333333' },
		{ name: '编辑', color: '#333333' },
		{ name: '删除', color: '#FF6B6B' }
	])

	// 切换主Tab
	const switchMainTab = (index) => {
		mainTab.value = index
		if (index === 1) {
			// 切换到克隆人tab时加载数据
			loadCloneList()
		}
	}

	// 切换克隆人tab
	const switchCloneTab = (index) => {
		cloneTab.value = index
		loadCloneList()
	}

	// 加载克隆人列表
	const loadCloneList = (forceRefresh = false) => {
		// 确定缓存类型
		const cacheType = cloneTab.value === 0 ? 'ownedClones' : 'createdClones'

		console.log('=== 克隆人列表加载 ===')
		console.log('当前tab:', cloneTab.value === 0 ? '我拥有的' : '我创造的')
		console.log('是否强制刷新:', forceRefresh)

		// 检查缓存是否有效
		if (CacheManager.isValid(cacheType, forceRefresh)) {
			console.log('使用缓存数据')
			cloneList.value = CacheManager.getCache(cacheType)
			console.log('==================')
			return
		}

		// 缓存无效，从接口获取数据
		console.log('从接口获取数据')
		const apiMethod = cloneTab.value === 0 ? getOwnedClones : getCreatedClones

		apiMethod().then(response => {
			if (response.code === 200) {
				// 处理头像URL，确保相对路径能正确拼接
				const clones = (response.data || []).map(clone => ({
					...clone,
					avatar: getAvatarUrl(clone.avatar)
				}))
				cloneList.value = clones

				// 更新缓存
				CacheManager.setCache(cacheType, clones)
				console.log('数据已缓存')
				console.log('==================')
			}
		}).catch(err => {
			console.error('加载克隆人列表失败:', err)
			console.log('==================')
		})
	}

	// 跳转到创建页面
	const goCreate = () => {
		uni.navigateTo({
			url: '/pages/create/index'
		})
	}

	// 打开克隆人对话
	const openChat = (clone) => {
		// 设置 personInfo 用于对话页
		const personInfoData = {
			id: clone.id,                    // 克隆人ID
			user_nickname: clone.name,       // 克隆人名称
			avatar: getAvatarUrl(clone.avatar), // 克隆人头像（使用工具函数拼接）
			session_id: clone.id,            // 使用克隆人ID作为会话标识
			isClone: true                    // 标记这是克隆人对话
		}

		console.log('打开克隆人对话，personInfo:', personInfoData)

		// 使用 store 保存 personInfo
		if (store.setPersonInfo) {
			store.setPersonInfo(personInfoData)
		} else {
			store.personInfo = personInfoData
		}

		// 跳转到对话详情页
		uni.navigateTo({
			url: '/pages/my/dialogue'
		})
	}

	// 显示操作菜单
	const showActionMenu = (clone) => {
		currentClone.value = clone
		showActions.value = true
	}

	// 处理操作菜单选择
	const onActionSelect = (e) => {
		showActions.value = false
		const action = e.name

		if (!currentClone.value) return

		switch (action) {
			case '查看详情':
				goCloneDetail(currentClone.value.id)
				break
			case '编辑':
				goCloneEdit(currentClone.value.id)
				break
			case '删除':
				confirmDelete(currentClone.value)
				break
		}
	}

	// 跳转到克隆人详情页
	const goCloneDetail = (id) => {
		uni.navigateTo({
			url: `/pages/my/clone-detail?id=${id}&tab=${cloneTab.value}`
		})
	}

	// 跳转到克隆人编辑页
	const goCloneEdit = (id) => {
		uni.navigateTo({
			url: `/pages/my/clone-edit?id=${id}&tab=${cloneTab.value}`
		})
	}

	// 确认删除克隆人
	const confirmDelete = (clone) => {
		uni.showModal({
			title: '删除确认',
			content: `确定要删除克隆人"${clone.name}"吗？删除后无法恢复。`,
			confirmColor: '#FF6B6B',
			success: (res) => {
				if (res.confirm) {
					deleteCloneItem(clone.id)
				}
			}
		})
	}

	// 删除克隆人
	const deleteCloneItem = (id) => {
		uni.showLoading({ title: '删除中...' })

		// 调用删除接口（来自 API）
		import('@/api/clone.js').then(({ deleteClone }) => {
			deleteClone(id).then(response => {
				uni.hideLoading()
				if (response.code === 200) {
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					})

					// 清除缓存并刷新列表
					CacheManager.setRefreshFlag('ownedClones')
					CacheManager.setRefreshFlag('createdClones')
					loadCloneList(true)
				} else {
					uni.showToast({
						title: response.message || '删除失败',
						icon: 'none'
					})
				}
			}).catch(err => {
				uni.hideLoading()
				console.error('删除克隆人失败:', err)
				uni.showToast({
					title: '删除失败，请重试',
					icon: 'none'
				})
			})
		})
	}

	onMounted(() => {
		// 确保隐藏loading（防止其他请求导致的loading状态残留）
		uni.hideLoading()
		loadCloneList()
	})

	onShow(() => {
		console.log('=== 页面onShow触发 ===')
		// 每次页面显示时都强制隐藏loading
		uni.hideLoading()

		// 克隆人列表：只在有刷新标记时才刷新（例如从创建页返回）
		if (mainTab.value === 1) {
			console.log('当前在克隆人tab，检查是否需要刷新')
			// loadCloneList内部会判断缓存是否有效，不会重复请求
			loadCloneList()
		}

		// 对话列表：已有缓存判断，保持不变
		if (message.value && mainTab.value === 0) {
			console.log('当前在对话列表tab，检查是否需要刷新')
			// getMessage内部会判断缓存是否有效
			message.value.getMessage && message.value.getMessage()
		}
		console.log('===================')
	})

	// TODO: Tab功能暂时隐藏，保留代码以备后用
	// const tabs = reactive([{
	// 	name: '消息'
	// }, {
	// 	name: '互动'
	// }, {
	// 	name: '通知'
	// }])
	// const current = ref(0)
	// const hudong = ref(null)
	// const notice = ref(null)
	// const click = (item) => {
	// 	current.value = item.index
	// }

	onPullDownRefresh(() => {
		// 当前只有消息列表，直接刷新
		message.value.page = 1
		message.value.list = []
		// 等待刷新完成后再停止下拉加载动画
		message.value.resetData().finally(() => {
			uni.stopPullDownRefresh()
		})

		// TODO: Tab功能恢复后，取消下面的注释
		// if(current.value == 0){
		// 	message.value.page = 1
		// 	message.value.list = []
		// 	message.value.resetData()
		// }else if(current.value == 1){
		// 	hudong.value.page = 1
		// 	hudong.value.list = []
		// 	hudong.value.resetData()
		// }else if(current.value == 2){
		// 	notice.value.page = 1
		// 	notice.value.list = []
		// 	notice.value.resetData()
		// }
	})
</script>

<style lang="scss" scoped>
	.page-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #FFFFFF;
		text-align: center;
	}

	.main-tabs {
		display: flex;
		padding: 0 48rpx;
		margin-bottom: 24rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);

		.main-tab-item {
			flex: 1;
			text-align: center;
			padding: 24rpx 0;
			position: relative;

			.tab-text {
				color: rgba(255, 255, 255, 0.5);
				font-size: 30rpx;
				transition: color 0.3s;
			}

			&.active {
				.tab-text {
					color: #FFFFFF;
					font-weight: 500;
				}
			}

			.tab-indicator {
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 60rpx;
				height: 6rpx;
				background: linear-gradient(90deg, #00D9C5 0%, #00B3A6 100%);
				border-radius: 3rpx;
			}
		}
	}

	.content {
		padding: 0 24rpx;
	}

	.tab-content {
		min-height: calc(100vh - 300rpx);
	}

	.clone-section {
		.clone-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 32rpx;
			padding: 0 24rpx;

			.clone-tabs {
				display: flex;
				gap: 40rpx;

				.tab-item {
					color: rgba(255, 255, 255, 0.5);
					font-size: 28rpx;
					padding-bottom: 8rpx;
					position: relative;
					transition: color 0.3s;

					&.active {
						color: #FFFFFF;
						font-weight: 500;

						&::after {
							content: '';
							position: absolute;
							bottom: 0;
							left: 0;
							right: 0;
							height: 4rpx;
							background: #00D9C5;
							border-radius: 2rpx;
						}
					}
				}
			}

			.create-btn {
				width: 64rpx;
				height: 64rpx;
				background: linear-gradient(135deg, #00D9C5 0%, #00B3A6 100%);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 4rpx 12rpx rgba(0, 217, 197, 0.3);

				.plus-icon {
					color: #FFFFFF;
					font-size: 44rpx;
					font-weight: 300;
					line-height: 1;
				}
			}
		}

		.clone-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 24rpx;
			padding: 0 24rpx;

			.clone-card {
				background: rgba(255, 255, 255, 0.05);
				border-radius: 16rpx;
				padding: 24rpx;
				text-align: center;
				transition: all 0.3s;
				position: relative;

				&:active {
					background: rgba(255, 255, 255, 0.08);
					transform: scale(0.98);
				}

				.more-btn {
					position: absolute;
					top: 16rpx;
					right: 16rpx;
					width: 48rpx;
					height: 48rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background: rgba(0, 0, 0, 0.4);
					border-radius: 50%;
					backdrop-filter: blur(10rpx);
					z-index: 10;

					.icon {
						color: #FFFFFF;
						font-size: 32rpx;
						font-weight: 600;
						line-height: 1;
						transform: rotate(90deg);
					}
				}

				.clone-avatar {
					width: 100%;
					height: 240rpx;
					border-radius: 12rpx;
					margin-bottom: 16rpx;
					background: rgba(255, 255, 255, 0.02);
				}

				.clone-name {
					color: #FFFFFF;
					font-size: 28rpx;
					font-weight: 500;
					margin-bottom: 8rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.clone-info {
					.clone-tag {
						display: inline-block;
						background: rgba(0, 217, 197, 0.15);
						color: #00D9C5;
						font-size: 22rpx;
						padding: 4rpx 12rpx;
						border-radius: 8rpx;
					}
				}
			}
		}

		.clone-empty {
			text-align: center;
			padding: 120rpx 0;

			.empty-icon {
				font-size: 120rpx;
				margin-bottom: 24rpx;
				opacity: 0.3;
			}

			.empty-text {
				display: block;
				color: rgba(255, 255, 255, 0.4);
				font-size: 28rpx;
				margin-bottom: 32rpx;
			}

			.empty-btn {
				display: inline-block;
				background: linear-gradient(135deg, #00D9C5 0%, #00B3A6 100%);
				color: #FFFFFF;
				font-size: 28rpx;
				padding: 20rpx 48rpx;
				border-radius: 48rpx;

				&:active {
					opacity: 0.8;
				}
			}
		}
	}
</style>