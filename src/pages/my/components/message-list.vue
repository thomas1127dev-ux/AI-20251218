<template>
	<view class="chat-list">
		<!-- 对话列表项（支持左滑删除 - 使用原生实现） -->
		<view
			v-for="(item, index) in list"
			:key="item.session_id || index"
			class="swipe-wrapper"
			@touchstart="handleTouchStart($event, index)"
			@touchmove="handleTouchMove($event, index)"
			@touchend="handleTouchEnd(index)"
		>
			<view
				class="chat-item"
				:style="{ transform: `translateX(${item._translateX || 0}px)`, transition: item._isMoving ? 'none' : 'transform 0.3s' }"
				@click="handleItemClick(item, index)"
			>
				<!-- 头像 -->
				<view class="avatar-wrapper">
					<image
						class="avatar"
						:src="getUserAvatar(item)"
						mode="aspectFill"
					/>
				</view>

				<!-- 中间信息区 -->
				<view class="info">
					<view class="nickname">
						{{ getUserNickname(item) }}
						<!-- 克隆人标识 -->
						<text v-if="item.is_clone" class="clone-badge">克隆人</text>
					</view>
					<view class="last-message">{{ item.last_message.content }}</view>
				</view>

				<!-- 右侧时间和红点 -->
				<view class="right-area">
					<view class="time">{{ formatTime(item.update_time) }}</view>
					<!-- 红点提醒 -->
					<view v-if="item.unread_count > 0" class="unread-badge">
						{{ item.unread_count > 99 ? '99+' : item.unread_count }}
					</view>
				</view>
			</view>

			<!-- 删除按钮 -->
			<view class="delete-btn" @click.stop="handleDelete(item, index)">
				删除
			</view>
		</view>

		<!-- 空状态 -->
		<up-empty mode="data" v-if="!list.length"></up-empty>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAIChatHistory } from '@/api/chat.js'
import { getAvatarUrl } from '@/utils/avatar.js'

import { onReachBottom } from '@dcloudio/uni-app';
import {
	userinfoStore
} from '@/store/userinfos.js'
const store = userinfoStore()
const list = ref([])
const total = ref(0)
const page = ref(1)

// 刷新配置：超过30秒才允许自动刷新
const REFRESH_THRESHOLD = 30 * 1000 // 30秒

// 滑动相关状态
const touchStartX = ref(0)
const touchStartY = ref(0)
const deleteButtonWidth = 75 // 删除按钮宽度（px）

// 触摸开始
const handleTouchStart = (e, index) => {
	const touch = e.touches[0]
	touchStartX.value = touch.clientX
	touchStartY.value = touch.clientY

	// 关闭其他已打开的滑块
	list.value.forEach((item, i) => {
		if (i !== index && item._translateX < 0) {
			item._translateX = 0
			item._isMoving = false
		}
	})
}

// 触摸移动
const handleTouchMove = (e, index) => {
	const touch = e.touches[0]
	const deltaX = touch.clientX - touchStartX.value
	const deltaY = touch.clientY - touchStartY.value

	// 判断是否为横向滑动
	if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
		e.preventDefault() // 阻止默认滚动行为

		const item = list.value[index]
		item._isMoving = true

		// 只允许向左滑动
		if (deltaX < 0) {
			const moveX = Math.max(deltaX, -deleteButtonWidth)
			item._translateX = moveX
		} else if (item._translateX < 0) {
			// 如果已经打开，允许向右滑动关闭
			item._translateX = Math.min(0, deltaX + item._translateX)
		}
	}
}

// 触摸结束
const handleTouchEnd = (index) => {
	const item = list.value[index]
	item._isMoving = false

	// 根据滑动距离判断是否打开或关闭
	if (item._translateX < -deleteButtonWidth / 2) {
		item._translateX = -deleteButtonWidth
	} else {
		item._translateX = 0
	}
}

// 点击列表项
const handleItemClick = (item, index) => {
	// 如果已经打开，点击后关闭
	if (item._translateX < 0) {
		item._translateX = 0
		return
	}

	// 否则跳转到详情
	details(item)
}

// 删除操作
const handleDelete = (item, index) => {
	uni.showModal({
		title: '提示',
		content: `确定要删除与 ${getUserNickname(item)} 的对话吗？`,
		success: (res) => {
			if (res.confirm) {
				// TODO: 后端接口就绪后，调用删除接口
				// deleteSession(item.session_id).then(() => {
				// 	list.value.splice(index, 1)
				// 	uni.showToast({
				// 		title: '删除成功',
				// 		icon: 'success'
				// 	})
				// })

				// 暂时使用本地删除
				list.value.splice(index, 1)
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				})
			}
		}
	})
}

const getMessage = (forceRefresh = false) => {
	// 检查是否需要刷新
	const now = Date.now()
	const timeSinceLastRefresh = now - (store.lastChatListRefreshTime || 0)
	const shouldRefresh = store.shouldRefreshChatList || timeSinceLastRefresh > REFRESH_THRESHOLD || forceRefresh

	console.log('=== 对话列表刷新判断 ===')
	console.log('是否强制刷新:', forceRefresh)
	console.log('发送消息标记:', store.shouldRefreshChatList)
	console.log('距离上次刷新:', timeSinceLastRefresh, 'ms')
	console.log('刷新阈值:', REFRESH_THRESHOLD, 'ms')
	console.log('是否需要刷新:', shouldRefresh)
	console.log('====================')

	// 如果不需要刷新且有缓存，直接使用缓存
	if (!shouldRefresh && store.chatListCache && store.chatListCache.length > 0) {
		console.log('使用缓存数据，共', store.chatListCache.length, '条')
		list.value = [...store.chatListCache]
		total.value = store.chatListCache.length
		return Promise.resolve()
	}

	// 需要刷新，从接口获取数据
	console.log('从接口获取对话列表数据')
	return getAIChatHistory().then(res => {
		console.log('=== AI对话列表数据 ===')
		console.log('原始数据:', res.data)

		// 数据映射转换
		const sessions = (res.data || []).map(item => ({
			// 字段映射
			session_id: item.character_id,        // 暂时使用 character_id 作为 session_id
			other_user_id: item.character_id,     // AI 角色 ID
			other_user_nickname: item.character_name, // AI 角色名称
			other_user_avatar: getAvatarUrl(item.avatar), // 使用工具函数拼接头像URL
			is_clone: item.is_clone || false,     // 是否是克隆人（后端返回）
			last_message: {
				content: item.last_message,       // 最后一条消息内容
				message_type: 'text'
			},
			update_time: formatISOTime(item.last_message_time), // 转换时间格式
			unread_count: 0,                      // 未读数暂时为0，后续补充

			// 滑动状态
			_translateX: 0,
			_isMoving: false
		}))

		console.log('转换后数据:', sessions)
		console.log('=====================')

		list.value = sessions
		total.value = sessions.length

		// 更新缓存
		if (store.setChatListCache) {
			store.setChatListCache(sessions)
		} else {
			store.chatListCache = sessions
		}

		// 更新刷新时间
		if (store.updateLastChatListRefreshTime) {
			store.updateLastChatListRefreshTime()
		} else {
			store.lastChatListRefreshTime = Date.now()
		}

		// 重置刷新标记
		if (store.setShouldRefreshChatList) {
			store.setShouldRefreshChatList(false)
		} else {
			store.shouldRefreshChatList = false
		}

		console.log('缓存已更新，共', sessions.length, '条')
	}).catch(err => {
		console.error('获取对话列表失败:', err)
		uni.showToast({
			title: '加载失败，请重试',
			icon: 'none'
		})
	})
}

// 辅助函数：获取对方头像
const getUserAvatar = (item) => {
	// AI 角色对话，返回拼接后的头像URL（已在数据转换时处理）
	return item.other_user_avatar
}

// 辅助函数：获取对方昵称
const getUserNickname = (item) => {
	// AI 角色对话，直接返回 AI 角色名称
	return item.other_user_nickname
}

// 辅助函数：智能格式化时间（相对时间）
const formatTime = (timeStr) => {
	if (!timeStr) return ''

	try {
		// 解析时间字符串 "2025-12-18 09:30:00"
		const messageDate = new Date(timeStr)
		const now = new Date()

		// 将时间归零到当天0点，用于计算自然日差异
		const messageDayStart = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate())
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

		// 计算自然日差异
		const diffMs = todayStart - messageDayStart
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

		// 今天：显示时分（09:30）
		if (diffDays === 0) {
			const hours = String(messageDate.getHours()).padStart(2, '0')
			const minutes = String(messageDate.getMinutes()).padStart(2, '0')
			return `${hours}:${minutes}`
		}

		// 1天前（昨天）
		if (diffDays === 1) {
			return '1天前'
		}

		// 2天前（前天）
		if (diffDays === 2) {
			return '2天前'
		}

		// 3天前（大前天）
		if (diffDays === 3) {
			return '3天前'
		}

		// 超过3天：显示月-日（12-18）
		const month = String(messageDate.getMonth() + 1).padStart(2, '0')
		const day = String(messageDate.getDate()).padStart(2, '0')
		return `${month}-${day}`
	} catch (error) {
		console.error('时间格式化失败:', error)
		// 降级处理：尝试提取时分
		const parts = timeStr.split(' ')
		if (parts.length === 2) {
			const timePart = parts[1].split(':')
			return `${timePart[0]}:${timePart[1]}`
		}
		return timeStr
	}
}

// 辅助函数：将 ISO 时间格式转换为本地时间 "YYYY-MM-DD HH:mm:ss"
const formatISOTime = (isoStr) => {
	if (!isoStr) return ''
	try {
		const date = new Date(isoStr)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		const seconds = String(date.getSeconds()).padStart(2, '0')
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
	} catch (error) {
		console.error('时间格式转换失败:', error)
		return ''
	}
}

const details = (item) => {
	// AI 角色对话：直接设置 personInfo 并跳转
	const personInfoData = {
		id: item.other_user_id,              // AI 角色 ID (character_id)
		user_nickname: item.other_user_nickname, // AI 角色名称
		avatar: item.other_user_avatar,      // AI 角色头像（已拼接完整URL）
		session_id: item.session_id          // 会话 ID (暂时使用 character_id)
	}

	console.log('跳转到对话页，personInfo:', personInfoData)

	// 使用 setPersonInfo 方法，确保在APP端也能正确保存
	if (store.setPersonInfo) {
		store.setPersonInfo(personInfoData)
	} else {
		// 兼容旧代码
		store.personInfo = personInfoData
	}

	uni.navigateTo({ url: '/pages/my/dialogue'})
}

onMounted(() => {
	getMessage()
})

onReachBottom(() => {
	if (total.value > list.value.length) {
		page.value++
		getMessage()
	}
})

const resetData = () => {
	list.value = [];
	page.value = 1;
	total.value = 0;
	return getMessage(true) // 强制刷新，返回Promise
}

//暴露
defineExpose({
	resetData,
	getMessage,
	page,
	list
})

</script>

<style lang="scss" scoped>
.chat-list {
	padding: 0 24rpx;
}

// 滑动容器
.swipe-wrapper {
	position: relative;
	height: auto;
	margin-bottom: 20rpx;
	overflow: hidden; // 关键：隐藏超出部分
	border-radius: 16rpx;
}

.chat-item {
	background: #2A2A2A;
	border-radius: 16rpx;
	padding: 24rpx;
	display: flex;
	align-items: center;
	position: relative;
	width: 100%;
	box-sizing: border-box;
	z-index: 2; // 在删除按钮上层

	.avatar-wrapper {
		flex-shrink: 0;
		margin-right: 24rpx;

		.avatar {
			width: 100rpx;
			height: 120rpx;
			border-radius: 12rpx;
		}
	}

	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;

		.nickname {
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: 500;
			margin-bottom: 8rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			display: flex;
			align-items: center;
			gap: 8rpx;

			.clone-badge {
				background: linear-gradient(135deg, #00D9C5 0%, #00B3A6 100%);
				color: #FFFFFF;
				font-size: 20rpx;
				padding: 4rpx 12rpx;
				border-radius: 8rpx;
				font-weight: 500;
				flex-shrink: 0;
			}
		}

		.last-message {
			color: rgba(255, 255, 255, 0.4);
			font-size: 26rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.right-area {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		margin-left: 16rpx;

		.time {
			color: rgba(255, 255, 255, 0.4);
			font-size: 24rpx;
			margin-bottom: 8rpx;
		}

		.unread-badge {
			background: #FF6B6B;
			color: #FFFFFF;
			border-radius: 18rpx;
			height: 36rpx;
			min-width: 36rpx;
			padding: 0 6rpx; // 减少左右padding，让单个数字更接近正圆
			display: inline-flex; // 改用inline-flex，让宽度自适应
			align-items: center;
			justify-content: center;
			font-size: 20rpx;
			font-weight: 500;
			line-height: 1; // 确保垂直居中
		}
	}
}

// 删除按钮
.delete-btn {
	position: absolute;
	right: 0;
	top: 0;
	height: 100%;
	width: 75px;
	background: #FF6B6B;
	color: #FFFFFF;
	font-size: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1; // 在 chat-item 下层
}
</style>