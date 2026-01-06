<template>
	<view class="chat-page" :style="{ backgroundImage: chatBackground !== 'default' ? `url(${chatBackground})` : '' }">
		<!-- 顶部导航栏 -->
		<up-navbar bgColor="#1a1921" placeholder :autoBack="false" :fixed="true">
			<template #left>
				<view @click="goBack">
					<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
				</view>
			</template>
			<template #center>
				<view class="nav-center">
					<view class="nav-title">{{ personInfo?.user_nickname || '小冰' }}</view>
					<view class="nav-subtitle">内容由AI生成</view>
				</view>
			</template>
			<template #right>
				<view class="" @click.stop="oparea">
					<up-icon name="more-dot-fill" color="#ffffff" size="28"></up-icon>
				</view>
			</template>
		</up-navbar>

		<!-- 系统提示标签 -->
		<view class="system-tip">
			<view class="tip-label">内容由AI生成,不能保证完全真实</view>
		</view>
		<!-- 消息列表 -->
		<view class="message-list">
			<view
				:id="`msg-${item.id}`"
				class="message-item"
				v-for="(item, index) in list"
				:key="index"
				:class="{ 'is-mine': userId == item.sender_id }"
			>
				<!-- 对方头像（左侧） -->
				<view class="avatar-wrapper" v-if="userId !== item.sender_id">
					<image class="avatar" :src="item.sender_avatar" mode="aspectFill" />
				</view>

				<!-- 消息气泡 -->
				<view class="message-content">
					<view :class="['bubble', userId == item.sender_id ? 'bubble-mine' : 'bubble-other']">
						<!-- 文字消息 -->
						<text v-if="item.message_type === 'text'" class="text">{{ item.content }}</text>

						<!-- 图片消息 -->
						<view v-if="item.message_type === 'image'" class="image-message">
							<image :src="item.media_url" mode="aspectFill" class="msg-image" @click="previewImage(item.media_url)" />
							<view class="view-original">查看原图</view>
						</view>

						<!-- 视频消息 -->
						<view v-if="item.message_type === 'video'" class="video-message">
							<image :src="item.video_thumbnail || item.media_url" mode="aspectFill" class="video-thumbnail" />
							<view class="play-btn">▶</view>
						</view>

						<!-- 语音消息 -->
						<view v-if="item.message_type === 'voice'" class="voice-message" @click="playVoice(item)">
							<view class="voice-icon" :class="{ 'playing': playingVoiceId === item.id }">
								<text class="voice-wave" v-if="userId == item.sender_id">
									<text :class="{ 'wave-anim': playingVoiceId === item.id }">{{  playingVoiceId === item.id ? '◀' : '◀' }}</text>
									<text :class="{ 'wave-anim wave-delay-1': playingVoiceId === item.id }">{{  playingVoiceId === item.id ? '◀' : '◀' }}</text>
									<text :class="{ 'wave-anim wave-delay-2': playingVoiceId === item.id }">{{  playingVoiceId === item.id ? '◀' : '◀' }}</text>
								</text>
								<text class="voice-wave" v-else>
									<text :class="{ 'wave-anim': playingVoiceId === item.id }">{{  playingVoiceId === item.id ? '▶' : '▶' }}</text>
									<text :class="{ 'wave-anim wave-delay-1': playingVoiceId === item.id }">{{  playingVoiceId === item.id ? '▶' : '▶' }}</text>
									<text :class="{ 'wave-anim wave-delay-2': playingVoiceId === item.id }">{{  playingVoiceId === item.id ? '▶' : '▶' }}</text>
								</text>
							</view>
							<text class="voice-duration">{{ item.duration }}"</text>
						</view>

						<!-- 语音图标（对方消息） -->
						<view v-if="userId !== item.sender_id && item.message_type === 'text'" class="voice-icon"></view>
					</view>
					<view class="time">{{ item.createTime }}</view>
				</view>

				<!-- 我的头像（右侧） -->
				<view class="avatar-wrapper" v-if="userId == item.sender_id">
					<image class="avatar" :src="item.sender_avatar" mode="aspectFill" />
				</view>
			</view>

			<!-- AI正在输入提示 -->
			<view v-if="isAITyping" class="typing-indicator">
				<view class="avatar-wrapper">
					<image class="avatar" :src="personInfo?.avatar || 'https://picsum.photos/200/200?random=2'" mode="aspectFill" />
				</view>
				<view class="typing-dots">
					<view class="dot"></view>
					<view class="dot"></view>
					<view class="dot"></view>
				</view>
			</view>
		</view>

		<view style="height: 160rpx;"></view>

		<!-- 底部输入区 -->
		<view class="input-area">
			<!-- 模式切换按钮 -->
			<view class="mode-btn" @click="toggleInputMode">
				<text class="mode-icon">{{ inputMode === 'text' ? '🎤' : '⌨️' }}</text>
			</view>

			<!-- 文字输入模式 -->
			<view class="input-wrapper" v-if="inputMode === 'text'">
				<input
					type="text"
					placeholder="请输入消息, AI会生成回复"
					v-model="con"
					class="input"
					@confirm="save"
				/>
			</view>

			<!-- 语音输入模式 -->
			<voice-recorder
				v-else
				@send="handleVoiceSend"
			/>

			<view class="emoji-btn" @click="toggleEmojiPicker" v-if="inputMode === 'text'">
				<text class="emoji-icon">😊</text>
			</view>
			<view class="send-btn" @click="save" v-if="inputMode === 'text' && con.trim()">
				发送
			</view>
		</view>
		<!-- 聊天设置菜单 -->
		<operation
			:show="show"
			@update:show="(val) => (show = val)"
			@changeBackground="showBackgroundSelector = true"
			@block="handleBlock"
			@report="handleReport"
		/>

		<!-- 背景选择器 -->
		<background-selector
			v-model="chatBackground"
			:show="showBackgroundSelector"
			@update:show="(val) => (showBackgroundSelector = val)"
			@change="handleBackgroundChange"
		/>

		<!-- 表情选择器 -->
		<emoji-picker
			:show="showEmojiPicker"
			@update:show="(val) => (showEmojiPicker = val)"
			@select="handleEmojiSelect"
		/>

		<!-- <Dialog :modelValue="modelValue" @update:modelValue="val => modelValue = val" /> -->
		<!-- <up-empty mode="data" v-if="!list.length"></up-empty> -->
		<Coin v-model="dialogVisible" @confirm="handleConfirm" @cancel="dialogVisible = false"
			@close="dialogVisible = false" :confirmText="userinfo.is_vip == false ? '去开通' : userinfo.gold_coin < 5 ? '去充值':''">
			<template #tip>
				
				<view class="" v-if="!userinfo.is_vip">该内容需要VIP解锁</view>
				<view class="" v-if="userinfo.is_vip && userinfo.gold_coin < 5">您的金币不足,请充值金币</view>
			</template>
		</Coin>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import { onShow, onPullDownRefresh as onPullDownRefreshHook } from '@dcloudio/uni-app'
	import Dialog from '@/components/Dialog.vue'
	import Coin from "@/components/Coin.vue"
	import operation from './components/operation.vue'
	import BackgroundSelector from './components/background-selector.vue'
	import EmojiPicker from './components/emoji-picker.vue'
	import VoiceRecorder from './components/voice-recorder.vue'
	import { getAvatarUrl, getCurrentUserAvatar } from '@/utils/avatar.js'

	// AI聊天接口（这是新增的真实接口）
	import { sendAIMessage, getAIChatHistory } from '@/api/chat.js'

	// #ifdef H5
	import { storeToRefs } from 'pinia'
	// #endif
	import {
		userinfoStore
	} from '@/store/userinfos.js'
	const store = userinfoStore()

	// #ifdef H5
	const { personInfo } = storeToRefs(store)
	// #endif

	// #ifdef APP-PLUS
	// APP端直接访问store属性（不使用storeToRefs）
	// 从本地存储读取最新的 personInfo（因为 setPersonInfo 会保存到本地存储）
	const storedPersonInfo = uni.getStorageSync('userinfos_personInfo') || {}
	const personInfo = ref(storedPersonInfo)
	// 监听store变化并同步
	const updatePersonInfo = () => {
		console.log('APP端：updatePersonInfo 被调用')
		// 优先从本地存储读取（最新）
		const latestPersonInfo = uni.getStorageSync('userinfos_personInfo') || {}
		console.log('APP端：从本地存储读取 personInfo =', latestPersonInfo)
		personInfo.value = latestPersonInfo
		console.log('APP端：personInfo.value 已更新为', personInfo.value)
	}
	// #endif
	const dialogVisible = ref(false);
	const show = ref(false)
	const reply_to_id = ref(0)
	const list = ref([])
	const name = ref('')
	const con = ref('')
	const userId = uni.getStorageSync('user_info')?.user_id || 101
	const modelValue = ref(false) //是否显示弹窗
	const userinfo = ref(store.userinfo || {}) // 本地用户信息
	const isAITyping = ref(false) // AI是否正在输入
	const showBackgroundSelector = ref(false) // 是否显示背景选择器
	const chatBackground = ref('default') // 当前聊天背景
	const showEmojiPicker = ref(false) // 是否显示表情选择器
	const inputMode = ref('text') // 输入模式：text-文字，voice-语音
	const playingVoiceId = ref(null) // 当前正在播放的语音消息ID
	const audioContext = ref(null) // 音频播放器实例

	// 下拉加载相关
	const nextCursor = ref(null) // 下一页游标
	const hasMore = ref(false) // 是否还有更多数据
	const isLoadingMore = ref(false) // 是否正在加载更多

	const handleConfirm = () => {
		uni.navigateTo({
			url:'/pages/my/recharge'
		})
	}

	const save = () => {
		// TODO: 付费逻辑暂时注释，开发付费模块时再启用
		// if(!userinfo.value.is_vip || userinfo.value.gold_coin < 5){
		// 	dialogVisible.value = true
		// 	return
		// }

		if (!con.value.trim()) {
			return
		}

		// 安全检查：确保personInfo存在且包含必要字段
		if (!personInfo || !personInfo.value || !personInfo.value.session_id) {
			uni.showToast({
				title: '会话信息异常，请返回重试',
				icon: 'none'
			})
			return
		}

		const userMessage = con.value.trim()
		con.value = ''

		// 添加用户消息到列表（使用Mock）
		const newUserMessage = {
			id: list.value.length + 1,
			session_id: personInfo.value.session_id,
			sender_id: userId,
			sender_avatar: getCurrentUserAvatar(),
			receiver_id: personInfo.value.session_id,
			receiver_avatar: getAvatarUrl(personInfo.value.avatar),
			reply_to_id: personInfo.value.id,
			content: userMessage,
			message_type: 'text',
			media_url: '',
			duration: 0,
			createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
			is_read: false
		}
		list.value.push(newUserMessage)

		// 滚动到底部显示新消息
		setTimeout(() => {
			scrollToBottom()
		}, 100)

		// 调用AI接口获取回复（使用真实接口）
		isAITyping.value = true
		sendAIMessage(personInfo.value.id, {
			type: 'text',
			content: userMessage
		})
			.then(aiRes => {
				console.log('AI回复成功:', aiRes)
				isAITyping.value = false

				// 添加AI回复到列表（使用Mock）
				const aiReply = {
					id: list.value.length + 1,
					session_id: personInfo.value.session_id,
					sender_id: personInfo.value.id,
					sender_avatar: getAvatarUrl(personInfo.value.avatar),
					receiver_id: personInfo.value.session_id,
					receiver_avatar: getCurrentUserAvatar(),
					reply_to_id: personInfo.value.id,
					content: aiRes?.data?.reply || aiRes.message || '收到你的消息了～',
					message_type: 'text',
					media_url: '',
					duration: 0,
					createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
					is_read: false
				}
				list.value.push(aiReply)

				// 滚动到底部显示AI回复
				setTimeout(() => {
					scrollToBottom()
				}, 100)

				// 设置对话列表刷新标记
				if (store.setShouldRefreshChatList) {
					store.setShouldRefreshChatList(true)
				} else {
					store.shouldRefreshChatList = true
				}
				console.log('已设置对话列表刷新标记')
			})
			.catch(err => {
				console.error('AI接口调用失败:', err)
				isAITyping.value = false
				uni.showToast({
					title: 'AI回复失败',
					icon: 'none'
				})
			})
	}

	const oparea = () => {
		show.value = true
	}

	// 返回上一页
	const goBack = () => {
		uni.navigateBack({
			delta: 1,
			fail: () => {
				// 如果返回失败（例如没有上一页），跳转到对话列表
				uni.switchTab({
					url: '/pages/my/message'
				})
			}
		})
	}

	// 预览图片
	const previewImage = (url) => {
		uni.previewImage({
			urls: [url],
			current: url
		})
	}

	// 显示/隐藏表情选择器
	const toggleEmojiPicker = () => {
		showEmojiPicker.value = !showEmojiPicker.value
	}

	// 选择表情
	const handleEmojiSelect = (emoji) => {
		// 将表情添加到输入框
		con.value += emoji
	}

	// 切换输入模式
	const toggleInputMode = () => {
		inputMode.value = inputMode.value === 'text' ? 'voice' : 'text'
	}

	// 发送语音消息
	const handleVoiceSend = (voiceData) => {
		console.log('handleVoiceSend 被调用，voiceData:', voiceData)
		console.log('personInfo:', personInfo)
		console.log('personInfo.value:', personInfo.value)

		// 安全检查：确保personInfo存在且包含必要字段
		if (!personInfo || !personInfo.value || !personInfo.value.session_id) {
			console.log('安全检查失败')
			uni.showToast({
				title: '会话信息异常，请返回重试',
				icon: 'none'
			})
			return
		}

		console.log('安全检查通过，准备创建语音消息')

		// TODO: 上传语音文件到服务器
		// 暂时使用本地路径模拟
		const voiceMessage = {
			id: list.value.length + 1,
			session_id: personInfo.value.session_id,
			sender_id: userId,
			sender_avatar: getCurrentUserAvatar(),
			receiver_id: personInfo.value.session_id,
			receiver_avatar: getAvatarUrl(personInfo.value.avatar),
			reply_to_id: personInfo.value.id,
			content: '',
			message_type: 'voice',
			media_url: voiceData.filePath,
			duration: voiceData.duration,
			createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
			is_read: false
		}
		list.value.push(voiceMessage)

		console.log('语音消息已添加:', voiceMessage)

		// 显示发送成功提示
		uni.showToast({
			title: '语音发送成功',
			icon: 'success',
			duration: 1500
		})

		// 滚动到底部
		setTimeout(() => {
			scrollToBottom()
		}, 100)

		// 调用AI接口发送语音消息
		isAITyping.value = true
		sendAIMessage(personInfo.value.id, {
			type: 'audio',
			audio: voiceData.filePath
		})
			.then(aiRes => {
				console.log('AI语音回复成功:', aiRes)
				isAITyping.value = false

				// 添加AI回复到列表
				const aiReply = {
					id: list.value.length + 1,
					session_id: personInfo.value.session_id,
					sender_id: personInfo.value.id,
					sender_avatar: getAvatarUrl(personInfo.value.avatar),
					receiver_id: personInfo.value.session_id,
					receiver_avatar: getCurrentUserAvatar(),
					reply_to_id: personInfo.value.id,
					content: aiRes?.data?.reply || aiRes.message || '收到你的语音消息了～',
					message_type: 'text',
					media_url: '',
					duration: 0,
					createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
					is_read: false
				}
				list.value.push(aiReply)

				// 滚动到底部显示AI回复
				setTimeout(() => {
					scrollToBottom()
				}, 100)
			})
			.catch(err => {
				console.error('AI语音接口调用失败:', err)
				isAITyping.value = false
				uni.showToast({
					title: 'AI回复失败',
					icon: 'none'
				})
			})

		// 设置对话列表刷新标记
		if (store.setShouldRefreshChatList) {
			store.setShouldRefreshChatList(true)
		} else {
			store.shouldRefreshChatList = true
		}
		console.log('已设置对话列表刷新标记')
	}

	// 播放语音消息
	const playVoice = (voiceItem) => {
		// 如果点击的是正在播放的语音，则停止播放
		if (playingVoiceId.value === voiceItem.id) {
			stopVoice()
			return
		}

		// 停止之前的播放
		stopVoice()

		// 创建新的音频实例
		audioContext.value = uni.createInnerAudioContext()
		audioContext.value.src = voiceItem.media_url

		// 播放开始
		audioContext.value.onPlay(() => {
			console.log('语音开始播放:', voiceItem.id)
			playingVoiceId.value = voiceItem.id
		})

		// 播放结束
		audioContext.value.onEnded(() => {
			console.log('语音播放结束')
			stopVoice()
		})

		// 播放错误
		audioContext.value.onError((err) => {
			console.error('语音播放错误:', err)
			uni.showToast({
				title: '语音播放失败',
				icon: 'none'
			})
			stopVoice()
		})

		// 开始播放
		audioContext.value.play()
	}

	// 停止语音播放
	const stopVoice = () => {
		if (audioContext.value) {
			audioContext.value.stop()
			audioContext.value.destroy()
			audioContext.value = null
		}
		playingVoiceId.value = null
	}

	// 格式化 ISO 时间为本地时间
	const formatCreatedAt = (isoTime) => {
		if (!isoTime) return ''
		try {
			const date = new Date(isoTime)
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			const hours = String(date.getHours()).padStart(2, '0')
			const minutes = String(date.getMinutes()).padStart(2, '0')
			const seconds = String(date.getSeconds()).padStart(2, '0')
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
		} catch (error) {
			console.error('时间格式化失败:', error)
			return isoTime
		}
	}

	// 滚动到底部
	const scrollToBottom = () => {
		uni.pageScrollTo({
			scrollTop: 999999,
			duration: 0  // 0ms，瞬间定位，无过渡动画
		})
	}

	// 滚动到指定消息
	const scrollToMessage = (messageId) => {
		// 需要等待DOM更新后再滚动
		setTimeout(() => {
			const query = uni.createSelectorQuery()
			query.select(`#msg-${messageId}`).boundingClientRect(data => {
				if (data) {
					// 获取当前页面的滚动位置
					uni.createSelectorQuery().selectViewport().scrollOffset(scrollData => {
						// 计算目标位置（元素顶部相对于页面的位置）
						const targetScrollTop = scrollData.scrollTop + data.top
						uni.pageScrollTo({
							scrollTop: targetScrollTop,
							duration: 0  // 瞬间定位
						})
					}).exec()
				}
			}).exec()
		}, 100)
	}

	// 加载聊天记录（支持分页）
	const loadChatHistory = (cursor = null) => {
		// 安全检查：确保personInfo存在且包含必要字段
		if (!personInfo || !personInfo.value || !personInfo.value.session_id) {
			console.warn('personInfo未定义或缺少session_id，跳过加载聊天历史')
			return Promise.reject('personInfo未定义')
		}

		// 如果正在加载，避免重复请求
		if (isLoadingMore.value) {
			console.log('正在加载中，跳过重复请求')
			return Promise.resolve()
		}

		isLoadingMore.value = true

		// 使用真实AI接口获取聊天历史
		return getAIChatHistory(personInfo.value.id, cursor)
			.then(res => {
				console.log('聊天历史获取成功:', res)

				// 解析返回的聊天记录数据结构
				// 返回格式: { messages: [{ id, role, content, created_at }], next_cursor, has_more }
				if (res.data && res.data.messages && Array.isArray(res.data.messages)) {
					const newMessages = res.data.messages.map(msg => {
						// 判断是用户消息还是AI消息
						const isUserMessage = msg.role === 'user'

						return {
							id: msg.id, // 使用接口返回的 id
							session_id: personInfo.value?.session_id || '',
							sender_id: isUserMessage ? userId : (personInfo.value?.id || 0),
							sender_avatar: isUserMessage
								? getCurrentUserAvatar()
								: getAvatarUrl(personInfo.value?.avatar),
							receiver_id: personInfo.value?.session_id || '',
							receiver_avatar: isUserMessage
								? getAvatarUrl(personInfo.value?.avatar)
								: getCurrentUserAvatar(),
							reply_to_id: personInfo.value?.id || 0,
							content: msg.content || '',
							message_type: 'text',
							media_url: '',
							duration: 0,
							createTime: formatCreatedAt(msg.created_at), // 格式化 created_at
							is_read: true
						}
					})

					// 更新分页信息
					nextCursor.value = res.data.next_cursor || null
					hasMore.value = res.data.has_more || false

					console.log('聊天记录解析成功，共', newMessages.length, '条消息')
					console.log('下一页游标:', nextCursor.value)
					console.log('是否还有更多:', hasMore.value)

					// 如果是加载更多（有 cursor），追加到列表前面
					if (cursor) {
						// 记录当前列表的第一条消息ID（加载前的第一条）
						const firstMessageId = list.value.length > 0 ? list.value[0].id : null

						list.value = [...newMessages, ...list.value]
						console.log('加载更多，追加到列表前面')
						console.log('记录的第一条消息ID:', firstMessageId)

						// 滚动到之前的第一条消息，保持视觉连续性
						if (firstMessageId) {
							scrollToMessage(firstMessageId)
						}
					} else {
						// 初次加载，直接赋值
						list.value = newMessages
						console.log('初次加载，直接赋值')

						// 滚动到底部
						setTimeout(() => {
							scrollToBottom()
						}, 300)
					}

					isLoadingMore.value = false
					return Promise.resolve()
				} else if (res.data) {
					// 如果返回的数据格式不符合预期
					console.warn('接口返回的数据格式不符合预期:', res.data)
					isLoadingMore.value = false
					return Promise.reject('数据格式错误')
				} else {
					isLoadingMore.value = false
					return Promise.reject('无数据')
				}
			})
			.catch(err => {
				console.error('获取聊天历史失败:', err)
				isLoadingMore.value = false
				return Promise.reject(err)
			})
	}

	// 初次加载聊天记录
	const getdetails = () => {
		loadChatHistory()
	}

	// 下拉刷新加载更多
	const onPullDownRefresh = () => {
		console.log('=== 下拉刷新触发 ===')

		// 检查是否还有更多数据
		if (!hasMore.value) {
			console.log('没有更多数据了')
			uni.showToast({
				title: '没有更多聊天记录了',
				icon: 'none',
				duration: 2000
			})
			uni.stopPullDownRefresh()
			return
		}

		// 检查是否正在加载
		if (isLoadingMore.value) {
			console.log('正在加载中，跳过')
			uni.stopPullDownRefresh()
			return
		}

		// 加载更多数据
		loadChatHistory(nextCursor.value)
			.then(() => {
				console.log('加载更多成功')
				uni.stopPullDownRefresh()
			})
			.catch(err => {
				console.error('加载更多失败:', err)
				uni.showToast({
					title: '加载失败，请重试',
					icon: 'none'
				})
				uni.stopPullDownRefresh()
			})
	}

	// 背景更换处理
	const handleBackgroundChange = (bg) => {
		console.log('背景已更换:', bg)
		// TODO: 调用接口保存背景设置
		// changeChatBackground({
		// 	session_id: personInfo.value.session_id,
		// 	background_url: bg
		// })
		uni.showToast({
			title: '背景已更换',
			icon: 'success'
		})
	}

	// 拉黑处理
	const handleBlock = () => {
		uni.showModal({
			title: '确认拉黑',
			content: `确定要拉黑 ${personInfo.value?.user_nickname || '该用户'} 吗？`,
			success: (res) => {
				if (res.confirm) {
					// TODO: 调用拉黑接口
					// blockUser(personInfo.value.id).then(() => {
					// 	uni.showToast({
					// 		title: '已拉黑',
					// 		icon: 'success'
					// 	})
					// 	// 返回上一页
					// 	setTimeout(() => {
					// 		goBack()
					// 	}, 1500)
					// })

					// 暂时只显示提示
					uni.showToast({
						title: '已拉黑',
						icon: 'success'
					})
				}
			}
		})
	}

	// 投诉处理
	const handleReport = () => {
		// TODO: 跳转到投诉页面，或显示投诉弹窗
		uni.showToast({
			title: '投诉功能开发中',
			icon: 'none'
		})
	}

	onMounted(() => {
		// #ifdef APP-PLUS
		// APP端：从store同步personInfo
		updatePersonInfo()
		// #endif

		// 加载消息列表
		getdetails()

		// 确保隐藏loading（防止其他请求导致的loading状态残留）
		uni.hideLoading()
	})

	onShow(() => {
		// #ifdef APP-PLUS
		// APP端：每次页面显示时从store同步personInfo
		updatePersonInfo()
		// #endif

		// 每次页面显示时都强制隐藏loading
		uni.hideLoading()
	})

	// 注册下拉刷新钩子
	onPullDownRefreshHook(() => {
		onPullDownRefresh()
	})
</script>

<style lang="scss" scoped>
.chat-page {
	min-height: 100vh;
	background: #1A1921;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}

// 顶部导航中心区域
.nav-center {
	display: flex;
	flex-direction: column;
	align-items: center;

	.nav-title {
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: 600;
		line-height: 1.2;
	}

	.nav-subtitle {
		color: rgba(255, 255, 255, 0.6);
		font-size: 22rpx;
		margin-top: 4rpx;
	}
}

// 系统提示标签
.system-tip {
	display: flex;
	justify-content: center;
	padding: 24rpx 0;

	.tip-label {
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.6);
		font-size: 24rpx;
		padding: 12rpx 32rpx;
		border-radius: 32rpx;
	}
}

// 消息列表
.message-list {
	padding: 0 24rpx;
}

.message-item {
	display: flex;
	margin-bottom: 32rpx;

	&.is-mine {
		justify-content: flex-end;
	}

	.avatar-wrapper {
		flex-shrink: 0;

		.avatar {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
		}
	}

	.message-content {
		max-width: 70%; // 改为百分比，更灵活
		margin: 0;
		display: inline-flex; // 改为 inline-flex，使容器宽度自适应内容
		flex-direction: column;
		align-items: flex-start; // 添加左对齐，避免拉伸

		.bubble {
			padding: 20rpx 24rpx;
			border-radius: 20rpx;
			position: relative;
			word-break: break-word;
			display: inline-block; // 添加 inline-block，使气泡宽度自适应文字
			max-width: 100%; // 最大宽度为父容器的100%
			width: auto; // 改为 auto，真正自适应内容
			box-sizing: border-box; // 添加盒模型，确保 padding 计算正确

			.text {
				color: #FFFFFF;
				font-size: 28rpx;
				line-height: 1.6;
				display: inline; // 文字设为 inline，避免占满整行
			}

			.voice-icon {
				position: absolute;
				right: 12rpx;
				bottom: 12rpx;
				color: rgba(255, 255, 255, 0.6);
				font-size: 20rpx;
			}
		}

		.bubble-other {
			background: #2A2A2A;
		}

		.bubble-mine {
			background: linear-gradient(180deg, #5662E1 0%, #614793 100%);
		}

		.time {
			color: rgba(255, 255, 255, 0.4);
			font-size: 24rpx;
			margin-top: 8rpx;
			align-self: flex-start; // 时间也左对齐
		}

		// 图片消息
		.image-message {
			position: relative;

			.msg-image {
				width: 400rpx;
				height: 500rpx;
				border-radius: 12rpx;
				display: block;
			}

			.view-original {
				position: absolute;
				bottom: 16rpx;
				left: 50%;
				transform: translateX(-50%);
				background: rgba(0, 0, 0, 0.6);
				color: #FFFFFF;
				font-size: 24rpx;
				padding: 8rpx 24rpx;
				border-radius: 32rpx;
			}
		}

		// 视频消息
		.video-message {
			position: relative;

			.video-thumbnail {
				width: 400rpx;
				height: 500rpx;
				border-radius: 12rpx;
				display: block;
			}

			.play-btn {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 80rpx;
				height: 80rpx;
				background: rgba(0, 0, 0, 0.6);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #FFFFFF;
				font-size: 32rpx;
			}
		}

		// 语音消息
		.voice-message {
			min-width: 160rpx;
			max-width: 400rpx;
			display: flex;
			align-items: center;

			// #ifdef H5
			cursor: pointer;
			// #endif

			.voice-icon {
				display: flex;
				align-items: center;
				margin-right: 16rpx;

				.voice-wave {
					display: flex;
					align-items: center;
					gap: 4rpx;

					text {
						color: rgba(255, 255, 255, 0.8);
						font-size: 24rpx;
						line-height: 1;
						opacity: 0.4;
						transition: opacity 0.3s;

						&.wave-anim {
							animation: voice-wave 1.2s ease-in-out infinite;
						}

						&.wave-delay-1 {
							animation-delay: 0.2s;
						}

						&.wave-delay-2 {
							animation-delay: 0.4s;
						}
					}
				}

				&.playing .voice-wave text {
					opacity: 1;
				}
			}

			.voice-duration {
				color: rgba(255, 255, 255, 0.8);
				font-size: 28rpx;
			}
		}
	}

	// 对方消息(左侧头像)：气泡左侧留小间距
	&:not(.is-mine) .message-content {
		margin-left: 12rpx;
	}

	// 我的消息(右侧头像)：气泡右侧留小间距
	&.is-mine .message-content {
		margin-right: 12rpx;
		align-items: flex-end; // 右侧消息右对齐
	}
}

@keyframes voice-wave {
	0%, 100% {
		opacity: 0.4;
		transform: scaleY(1);
	}
	50% {
		opacity: 1;
		transform: scaleY(1.5);
	}
}

// AI正在输入提示
.typing-indicator {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
	margin-left: 24rpx;

	.avatar-wrapper {
		flex-shrink: 0;
		margin-right: 16rpx;

		.avatar {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
		}
	}

	.typing-dots {
		background: #2A2A2A;
		padding: 20rpx 24rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		gap: 8rpx;

		.dot {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.4);
			animation: typing 1.4s infinite;

			&:nth-child(1) {
				animation-delay: 0s;
			}

			&:nth-child(2) {
				animation-delay: 0.2s;
			}

			&:nth-child(3) {
				animation-delay: 0.4s;
			}
		}
	}
}

@keyframes typing {
	0%, 60%, 100% {
		opacity: 0.4;
		transform: scale(1);
	}
	30% {
		opacity: 1;
		transform: scale(1.2);
	}
}

// 底部输入区
.input-area {
	background: linear-gradient(175.26deg, #311F4F 14.46%, #1E1B33 122.11%);
	width: 100%;
	position: fixed;
	left: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	padding: 20rpx 24rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	box-sizing: border-box;

	.mode-btn {
		flex-shrink: 0;
		width: 72rpx;
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 16rpx;

		.mode-icon {
			font-size: 48rpx;
			line-height: 1;
		}
	}

	.input-wrapper {
		flex: 1;
		margin-right: 16rpx;
		min-width: 0; // 防止flex子元素溢出

		.input {
			background: #FFFFFF;
			width: 100%;
			font-size: 28rpx;
			height: 72rpx;
			line-height: 72rpx;
			border-radius: 36rpx;
			padding: 0 24rpx;
			color: #000000;
			box-sizing: border-box; // 确保padding不会导致溢出
		}
	}

	.emoji-btn {
		flex-shrink: 0;
		width: 72rpx;
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 16rpx;
		background: transparent;
		border: none;

		.emoji-icon {
			font-size: 48rpx;
			line-height: 1;
		}
	}

	.send-btn {
		flex-shrink: 0;
		background: linear-gradient(180deg, #5662E1 0%, #614793 100%);
		color: #FFFFFF;
		font-size: 28rpx;
		height: 72rpx;
		line-height: 72rpx;
		padding: 0 32rpx;
		border-radius: 36rpx;
		text-align: center;
	}
}
</style>