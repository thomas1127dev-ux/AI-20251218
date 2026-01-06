<template>
	<view class="detail-page">
		<!-- 导航栏 -->
		<up-navbar
			title="克隆人详情"
			bgColor="transparent"
			:placeholder="true"
			:autoBack="true"
		/>

		<!-- 加载状态 -->
		<view v-if="loading" class="loading-wrapper">
			<up-loading-icon mode="circle" />
		</view>

		<!-- 详情内容 -->
		<view v-else-if="cloneData" class="detail-content">
			<!-- 头像区域 -->
			<view class="avatar-section">
				<image class="avatar-img" :src="cloneData.avatar" mode="aspectFill" />
			</view>

			<!-- 基本信息 -->
			<view class="info-section">
				<view class="section-title">基本信息</view>

				<view class="info-item">
					<view class="label">名字</view>
					<view class="value">{{ cloneData.name }}</view>
				</view>

				<view class="info-item" v-if="cloneData.birthday">
					<view class="label">生日</view>
					<view class="value">{{ cloneData.birthday }}</view>
				</view>

				<view class="info-item">
					<view class="label">性别</view>
					<view class="value">{{ cloneData.gender === 'male' ? '男' : cloneData.gender === 'female' ? '女' : '未知' }}</view>
				</view>
			</view>

			<!-- 人设描述 -->
			<view class="info-section" v-if="cloneData.persona">
				<view class="section-title">人设描述</view>
				<view class="persona-content">
					{{ cloneData.persona }}
				</view>
			</view>

			<!-- 特征信息 -->
			<view class="info-section">
				<view class="section-title">特征标签</view>

				<view class="info-item" v-if="cloneData.archetype_tags && cloneData.archetype_tags.length">
					<view class="label">原型</view>
					<view class="tags-wrapper">
						<view
							v-for="(tag, index) in cloneData.archetype_tags"
							:key="index"
							class="tag-item"
						>
							{{ tag }}
						</view>
					</view>
				</view>

				<view class="info-item" v-if="cloneData.personality && cloneData.personality.length">
					<view class="label">性格</view>
					<view class="tags-wrapper">
						<view
							v-for="(tag, index) in cloneData.personality"
							:key="index"
							class="tag-item"
						>
							{{ tag }}
						</view>
					</view>
				</view>

				<view class="info-item" v-if="cloneData.interests && cloneData.interests.length">
					<view class="label">兴趣爱好</view>
					<view class="tags-wrapper">
						<view
							v-for="(tag, index) in cloneData.interests"
							:key="index"
							class="tag-item"
						>
							{{ tag }}
						</view>
					</view>
				</view>

				<view class="info-item" v-if="cloneData.catchphrase">
					<view class="label">口头语</view>
					<view class="value">{{ cloneData.catchphrase }}</view>
				</view>
			</view>
		</view>

		<!-- 底部操作按钮 -->
		<view class="bottom-actions">
			<view class="btn-row">
				<view class="btn btn-secondary" @click="handleDelete">
					删除
				</view>
				<view class="btn btn-primary" @click="handleEdit">
					编辑
				</view>
			</view>
			<view class="btn btn-chat" @click="handleChat">
				开始对话
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getCloneDetail, deleteClone } from '@/api/clone.js'
import { getAvatarUrl } from '@/utils/avatar.js'
import { CacheManager } from '@/utils/cache-manager.js'
import { userinfoStore } from '@/store/userinfos.js'

const store = userinfoStore()

const cloneId = ref('')
const tabIndex = ref(0) // 来自哪个tab（0:我拥有的, 1:我创造的）
const loading = ref(true)
const cloneData = ref(null)
const isFirstLoad = ref(true)

// 页面加载时获取参数
onLoad((options) => {
	if (options.id) {
		cloneId.value = options.id
	}
	if (options.tab !== undefined) {
		tabIndex.value = parseInt(options.tab)
	}
	loadCloneDetail()
})

// 页面显示时重新加载数据（编辑返回时刷新）
onShow(() => {
	// 跳过首次加载（onLoad已经加载过）
	if (isFirstLoad.value) {
		isFirstLoad.value = false
		return
	}

	// 重新加载数据以显示最新修改
	if (cloneId.value) {
		loadCloneDetail()
	}
})

// 加载克隆人详情
const loadCloneDetail = () => {
	loading.value = true

	console.log('=== 开始加载克隆人详情 ===')
	console.log('克隆人ID:', cloneId.value)

	getCloneDetail(cloneId.value).then(response => {
		console.log('=== 接口响应 ===')
		console.log('完整响应:', response)
		console.log('响应代码:', response.code)
		console.log('响应数据:', response.data)

		if (response.code === 200) {
			// 处理头像URL和字段映射
			const rawData = response.data
			cloneData.value = {
				...rawData,
				avatar: getAvatarUrl(rawData.avatar),
				// 保留原始字段供模板使用
				archetype_tags: rawData.archetype_tags || [],
				personality_tags: rawData.personality_tags || [],
				interest_tags: rawData.interest_tags || [],
				speech_habits: rawData.speech_habits || '',
				persona: rawData.persona || '',
				// 兼容旧字段名
				prototype: rawData.archetype_tags?.[0] || '',
				personality: rawData.personality_tags || [],
				catchphrase: rawData.speech_habits || '',
				interests: rawData.interest_tags || []
			}
			console.log('=== 克隆人数据处理完成 ===')
			console.log('cloneData:', cloneData.value)
		} else {
			console.error('响应代码不是200:', response.code, response.message)
			uni.showToast({
				title: response.message || '加载失败',
				icon: 'none'
			})
		}
	}).catch(err => {
		console.error('=== 加载克隆人详情失败 ===')
		console.error('错误类型:', typeof err)
		console.error('错误内容:', err)
		console.error('错误堆栈:', err.stack)
		uni.showToast({
			title: '加载失败，请重试',
			icon: 'none'
		})
	}).finally(() => {
		loading.value = false
		console.log('=== 加载完成 ===')
		console.log('loading:', loading.value)
		console.log('cloneData:', cloneData.value)
	})
}

// 编辑
const handleEdit = () => {
	uni.navigateTo({
		url: `/pages/my/clone-edit?id=${cloneId.value}&tab=${tabIndex.value}`
	})
}

// 删除
const handleDelete = () => {
	uni.showModal({
		title: '删除确认',
		content: `确定要删除克隆人"${cloneData.value.name}"吗？删除后无法恢复。`,
		confirmColor: '#FF6B6B',
		success: (res) => {
			if (res.confirm) {
				performDelete()
			}
		}
	})
}

// 执行删除
const performDelete = () => {
	uni.showLoading({ title: '删除中...' })

	deleteClone(cloneId.value).then(response => {
		uni.hideLoading()
		if (response.code === 200) {
			uni.showToast({
				title: '删除成功',
				icon: 'success'
			})

			// 清除缓存
			CacheManager.setRefreshFlag('ownedClones')
			CacheManager.setRefreshFlag('createdClones')

			// 返回上一页
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
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
}

// 开始对话
const handleChat = () => {
	console.log('=== 开始对话按钮被点击 ===')
	console.log('cloneData:', cloneData.value)

	if (!cloneData.value) {
		console.error('克隆人数据为空')
		uni.showToast({
			title: '数据加载中，请稍候',
			icon: 'none'
		})
		return
	}

	const personInfoData = {
		id: cloneData.value.id,
		user_nickname: cloneData.value.name,
		avatar: cloneData.value.avatar,
		session_id: cloneData.value.id,
		isClone: true
	}

	console.log('打开克隆人对话，personInfo:', personInfoData)

	// 保存到 store
	try {
		if (store.setPersonInfo) {
			store.setPersonInfo(personInfoData)
			console.log('通过方法保存 personInfo 成功')
		} else {
			store.personInfo = personInfoData
			console.log('直接赋值 personInfo 成功')
		}
	} catch (error) {
		console.error('保存 personInfo 失败:', error)
	}

	// 跳转到对话页
	console.log('准备跳转到对话页面...')
	uni.redirectTo({
		url: '/pages/my/dialogue',
		success: () => {
			console.log('跳转成功')
		},
		fail: (err) => {
			console.error('跳转失败:', err)
			uni.showToast({
				title: '跳转失败，请重试',
				icon: 'none'
			})
		}
	})
}
</script>

<style lang="scss" scoped>
.detail-page {
	min-height: 100vh;
	background: #000000;
	padding-bottom: 240rpx;
}

.loading-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 200rpx 0;
}

.detail-content {
	padding: 0 48rpx;
}

.avatar-section {
	display: flex;
	justify-content: center;
	padding: 48rpx 0;

	.avatar-img {
		width: 320rpx;
		height: 320rpx;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.05);
	}
}

.info-section {
	margin-bottom: 48rpx;

	.section-title {
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 24rpx;
	}

	.persona-content {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 16rpx;
		padding: 32rpx;
		color: #FFFFFF;
		font-size: 28rpx;
		line-height: 1.8;
		text-align: justify;
	}

	.info-item {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 16rpx;
		padding: 32rpx;
		margin-bottom: 16rpx;

		.label {
			color: rgba(255, 255, 255, 0.5);
			font-size: 24rpx;
			margin-bottom: 12rpx;
		}

		.value {
			color: #FFFFFF;
			font-size: 28rpx;
			line-height: 1.6;
		}

		.tags-wrapper {
			display: flex;
			flex-wrap: wrap;
			gap: 16rpx;
			margin-top: 8rpx;

			.tag-item {
				background: rgba(0, 217, 197, 0.15);
				border: 1rpx solid rgba(0, 217, 197, 0.3);
				color: #00D9C5;
				font-size: 24rpx;
				padding: 8rpx 20rpx;
				border-radius: 24rpx;
			}
		}
	}
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.95);
	padding: 24rpx 48rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	backdrop-filter: blur(20rpx);
	border-top: 1rpx solid rgba(255, 255, 255, 0.1);

	.btn-row {
		display: flex;
		gap: 24rpx;
		margin-bottom: 16rpx;
	}

	.btn {
		flex: 1;
		height: 88rpx;
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		font-weight: 500;
		transition: all 0.3s;

		&.btn-primary {
			background: linear-gradient(135deg, #00D9C5 0%, #00B3A6 100%);
			color: #FFFFFF;

			&:active {
				opacity: 0.8;
			}
		}

		&.btn-secondary {
			background: rgba(255, 255, 255, 0.05);
			border: 2rpx solid rgba(255, 107, 107, 0.5);
			color: #FF6B6B;

			&:active {
				background: rgba(255, 107, 107, 0.1);
			}
		}

		&.btn-chat {
			width: 100%;
			background: rgba(255, 255, 255, 0.08);
			border: 2rpx solid rgba(255, 255, 255, 0.2);
			color: #FFFFFF;

			&:active {
				background: rgba(255, 255, 255, 0.12);
			}
		}
	}
}
</style>
