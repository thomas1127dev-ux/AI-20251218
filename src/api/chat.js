import {
	getRequest,
	postRequest
} from '@/utils/http.js'

// 引入 Mock 数据（开发阶段使用）
import {
	mockSessions,
	mockMessages,
	mockClones,
	mockEmojis,
	mockChatBackgrounds,
	mockAIReplies
} from '@/mock/chatData.js'

// 引入配置
import { aiChatBaseUrl, aiChatTestToken } from '@/config/config.js'

// ===== 会话管理 =====

/**
 * 获取会话列表
 * @param {Object} params - { currentPage, pageSize }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: GET /chat/session/
 * 返回示例: { data: { results: [], pagination: { total: 10 } } }
 */
export const getChatList = (params) => {
	// 生产环境：使用真实接口
	return getRequest('/chat/session/', params)

	// 开发环境：使用 Mock 数据（如果后端接口未就绪，取消下面注释）
	// return new Promise((resolve) => {
	// 	setTimeout(() => {
	// 		const { currentPage = 1, pageSize = 20 } = params
	// 		const start = (currentPage - 1) * pageSize
	// 		const end = start + pageSize
	// 		resolve({
	// 			data: {
	// 				results: mockSessions.slice(start, end),
	// 				pagination: {
	// 					total: mockSessions.length,
	// 					currentPage,
	// 					pageSize
	// 				}
	// 			}
	// 		})
	// 	}, 500)
	// })
}

/**
 * 创建会话
 * @param {Object} params - { other_user_id, session_id }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /chat/session/create-room/
 */
export const createSession = (params) => {
	return postRequest('/chat/session/create-room/', params)
}

/**
 * 删除会话
 * @param {Number} sessionId - 会话ID
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: DELETE /chat/session/{sessionId}/
 */
export const deleteSession = (sessionId) => {
	return postRequest(`/chat/session/${sessionId}/delete/`)
}

/**
 * 标记会话已读
 * @param {Number} sessionId - 会话ID
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /chat/session/{sessionId}/read/
 */
export const markRead = (sessionId) => {
	return postRequest(`/chat/session/${sessionId}/read/`)
}

// ===== 消息管理 =====

/**
 * 获取消息列表
 * @param {Object} params - { receiver_id, currentPage, pageSize }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: GET /chat/message/
 */
export const getMessageList = (params) => {
	// 生产环境：使用真实接口
	return getRequest('/chat/message/', params)

	// 开发环境：使用 Mock 数据（如果后端接口未就绪，取消下面注释）
	// return new Promise((resolve) => {
	// 	setTimeout(() => {
	// 		const { receiver_id, currentPage = 1, pageSize = 100 } = params
	// 		const messages = mockMessages[receiver_id] || []
	// 		resolve({
	// 			data: {
	// 				results: messages
	// 			}
	// 		})
	// 	}, 500)
	// })
}

/**
 * 发送文字消息
 * @param {Object} params - { receiver_id, reply_to_id, content }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /chat/message/send/
 */
export const sendTextMessage = (params) => {
	return postRequest('/chat/message/send/', params)
}

/**
 * 发送图片消息
 * @param {Object} params - { receiver_id, reply_to_id, image_file }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /chat/message/send-image/
 * 注意：需要先上传图片，获取 URL
 */
export const sendImageMessage = (params) => {
	return postRequest('/chat/message/send-image/', params)
}

/**
 * 发送语音消息
 * @param {Object} params - { receiver_id, reply_to_id, voice_file, duration }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /chat/message/send-voice/
 * 注意：需要先上传语音，获取 URL
 */
export const sendVoiceMessage = (params) => {
	return postRequest('/chat/message/send-voice/', params)
}

/**
 * 发送视频消息
 * @param {Object} params - { receiver_id, reply_to_id, video_file }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /chat/message/send-video/
 * 注意：需要先上传视频，获取 URL
 */
export const sendVideoMessage = (params) => {
	return postRequest('/chat/message/send-video/', params)
}

// ===== 克隆人管理 =====

/**
 * 获取我的克隆人列表
 * @param {Object} params - { type: 'owned' | 'created' }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: GET /clone/my-list/
 */
export const getMyClones = (params) => {
	// 生产环境：使用真实接口
	return getRequest('/clone/my-list/', params)

	// 开发环境：使用 Mock 数据（如果后端接口未就绪，取消下面注释）
	// return new Promise((resolve) => {
	// 	setTimeout(() => {
	// 		const { type = 'owned' } = params
	// 		resolve({
	// 			data: {
	// 				results: mockClones[type] || []
	// 			}
	// 		})
	// 	}, 500)
	// })
}

/**
 * 添加克隆人（通过ID或名字搜索）
 * @param {Object} params - { keyword }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /clone/add/
 */
export const addClone = (params) => {
	return postRequest('/clone/add/', params)
}

/**
 * 搜索克隆人
 * @param {Object} params - { keyword }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: GET /clone/search/
 */
export const searchClone = (params) => {
	return getRequest('/clone/search/', params)
}

// ===== 聊天设置 =====

/**
 * 拉黑用户
 * @param {Number} userId - 用户ID
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /user/{userId}/block/
 */
export const blockUser = (userId) => {
	return postRequest(`/user/${userId}/block/`)
}

/**
 * 取消拉黑
 * @param {Number} userId - 用户ID
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /user/{userId}/unblock/
 */
export const unblockUser = (userId) => {
	return postRequest(`/user/${userId}/unblock/`)
}

/**
 * 投诉用户
 * @param {Object} params - { user_id, reason, description, images }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /report/submit/
 */
export const reportUser = (params) => {
	return postRequest('/report/submit/', params)
}

/**
 * 更换聊天背景
 * @param {Object} params - { session_id, background_url }
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /chat/background/change/
 */
export const changeChatBackground = (params) => {
	return postRequest('/chat/background/change/', params)
}

/**
 * 获取聊天背景列表
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: GET /chat/background/list/
 */
export const getChatBackgrounds = () => {
	// 生产环境：使用真实接口
	return getRequest('/chat/background/list/')

	// 开发环境：使用 Mock 数据（如果后端接口未就绪，取消下面注释）
	// return new Promise((resolve) => {
	// 	setTimeout(() => {
	// 		resolve({
	// 			data: {
	// 				results: mockChatBackgrounds
	// 			}
	// 		})
	// 	}, 500)
	// })
}

/**
 * 获取表情列表
 * @returns {Promise}
 *
 * TODO: 对接后端接口（如果表情包存储在服务器）
 * 接口地址: GET /emoji/list/
 *
 * 注意：目前表情包数据存储在本地，如果后端有表情包管理功能，再对接
 */
export const getEmojiList = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				data: {
					results: mockEmojis
				}
			})
		}, 100)
	})
}

// ===== 文件上传 =====

/**
 * 上传图片
 * @param {File} file - 图片文件
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /upload/image/
 * 返回: { url: 'https://...' }
 */
export const uploadImage = (file) => {
	return postRequest('/upload/image/', {
		file
	})
}

/**
 * 上传语音
 * @param {File} file - 语音文件
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /upload/voice/
 * 返回: { url: 'https://...', duration: 5 }
 */
export const uploadVoice = (file) => {
	return postRequest('/upload/voice/', {
		file
	})
}

/**
 * 上传视频
 * @param {File} file - 视频文件
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /upload/video/
 * 返回: { url: 'https://...', thumbnail: 'https://...' }
 */
export const uploadVideo = (file) => {
	return postRequest('/upload/video/', {
		file
	})
}

// ===== AI聊天接口 =====

/**
 * 发送消息获取AI回复（支持H5、Android、iOS三端）
 * @param {Number|String} characterId - AI角色ID
 * @param {Object} messageData - 消息数据对象
 *   - type: 'text' 时，需要 content 字段（文字内容）
 *   - type: 'audio' 时，需要 audio 字段（语音文件路径）
 * @returns {Promise}
 *
 * 接口地址: POST https://rozanne-unbiddable-doria.ngrok-free.dev/chat/{characterId}/
 * 请求格式:
 *   - 文字消息: application/x-www-form-urlencoded, form_data[type]=text&form_data[message]=xxx
 *   - 语音消息: multipart/form-data, type=audio&audio=file
 * 返回: AI回复的消息
 */
export const sendAIMessage = (characterId, messageData) => {
	return new Promise((resolve, reject) => {
		const apiUrl = `${aiChatBaseUrl}/chat/${characterId}/`

		// 文字消息：使用 uni.request
		if (messageData.type === 'text') {
			uni.request({
				url: apiUrl,
				method: 'POST',
				header: {
					'ngrok-skip-browser-warning': 'true',
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': 'Mozilla/5.0',
					'Authorization': `Bearer ${aiChatTestToken}`
				},
				data: `type=text&message=${encodeURIComponent(messageData.content)}`,
				timeout: 30000,
				success: (res) => {
					if (res.statusCode === 200 || res.statusCode === 201) {
						resolve({
							code: 200,
							data: res.data
						})
					} else {
						reject({
							code: res.statusCode,
							message: '请求失败'
						})
					}
				},
				fail: (err) => {
					reject(err)
				}
			})
		}
		// 语音消息：使用 uni.uploadFile（支持三端）
		else if (messageData.type === 'audio') {
			// 使用 uni.uploadFile 上传语音文件
			// 兼容 H5、Android、iOS 三端
			uni.uploadFile({
				url: apiUrl,
				filePath: messageData.audio,
				name: 'audio',
				formData: {
					type: 'audio'
				},
				header: {
					'ngrok-skip-browser-warning': 'true',
					'User-Agent': 'Mozilla/5.0',
					'Authorization': `Bearer ${aiChatTestToken}`
				},
				timeout: 30000,
				success: (res) => {
					if (res.statusCode === 200 || res.statusCode === 201) {
						// 解析返回的JSON数据
						let responseData = res.data
						if (typeof responseData === 'string') {
							try {
								responseData = JSON.parse(responseData)
							} catch (e) {
								console.error('JSON解析失败:', e)
							}
						}

						resolve({
							code: 200,
							data: responseData
						})
					} else {
						reject({
							code: res.statusCode,
							message: '请求失败'
						})
					}
				},
				fail: (err) => {
					reject(err)
				}
			})
		}
	})
}

/**
 * 获取指定角色的聊天记录
 * @param {Number|String} characterId - AI角色ID
 * @param {Number} cursor - 游标，用于分页加载（可选）
 * @returns {Promise}
 *
 * 接口地址: GET https://rozanne-unbiddable-doria.ngrok-free.dev/chat/{characterId}/
 * 参数: cursor（可选）
 * 返回: { messages: [], next_cursor: 165, has_more: true }
 */
export const getAIChatHistory = (characterId, cursor) => {
	return new Promise((resolve, reject) => {
		// 如果没有传入 characterId，使用不带ID的URL（获取所有对话列表）
		let apiUrl = characterId
			? `${aiChatBaseUrl}/chat/${characterId}/`
			: `${aiChatBaseUrl}/chat/`

		// 如果有 cursor，拼接到 URL
		if (cursor) {
			apiUrl += `?cursor=${cursor}`
		}

		uni.request({
			url: apiUrl,
			method: 'GET',
			timeout: 15000,
			header: {
				'ngrok-skip-browser-warning': 'true',
				'Authorization': `Bearer ${aiChatTestToken}`
			},
			success: (res) => {
				if (res.statusCode === 200) {
					resolve({
						code: 200,
						data: res.data
					})
				} else {
					reject({
						code: res.statusCode,
						message: '请求失败'
					})
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// ===== 模拟AI回复（降级方案）=====

/**
 * 模拟AI自动回复（降级方案）
 * @param {String} userMessage - 用户消息内容
 * @returns {Promise<String>} AI回复内容
 */
export const getMockAIReply = (userMessage) => {
	return new Promise((resolve) => {
		// 模拟延迟1-3秒
		const delay = Math.random() * 2000 + 1000
		setTimeout(() => {
			// 随机返回一条Mock回复
			const randomIndex = Math.floor(Math.random() * mockAIReplies.length)
			resolve({
				data: {
					reply: mockAIReplies[randomIndex]
				}
			})
		}, delay)
	})
}
