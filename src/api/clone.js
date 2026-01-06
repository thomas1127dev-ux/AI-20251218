import {
	getRequest,
	postRequest
} from '@/utils/http.js'

// 引入配置
import { aiChatBaseUrl, aiChatTestToken } from '@/config/config.js'

// ===== 克隆人管理 =====

/**
 * 获取我拥有的克隆人列表
 * @returns {Promise}
 *
 * 接口地址: GET /chat/characters/
 * 说明：获取我创建的角色列表
 */
export const getOwnedClones = () => {
	return new Promise((resolve, reject) => {
		const apiUrl = `${aiChatBaseUrl}/chat/characters/`

		uni.request({
			url: apiUrl,
			method: 'GET',
			timeout: 30000,
			header: {
				'ngrok-skip-browser-warning': 'true',
				'Authorization': `Bearer ${aiChatTestToken}`,
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0',
				'Authorization': `Bearer ${aiChatTestToken}`
			},
			success: (res) => {
				if (res.statusCode === 200) {
					const data = res.data.characters || res.data || []

					resolve({
						code: 200,
						data: data
					})
				} else {
					reject({
						code: res.statusCode,
						message: '获取失败'
					})
				}
			},
			fail: (err) => {
				console.error('获取克隆人列表失败:', err)
				reject(err)
			}
		})
	})
}

/**
 * 获取我创造的克隆人列表
 * @returns {Promise}
 *
 * 接口地址: GET /chat/characters/
 * 说明：与 getOwnedClones 使用相同接口
 */
export const getCreatedClones = () => {
	return new Promise((resolve, reject) => {
		const apiUrl = `${aiChatBaseUrl}/chat/characters/`

		uni.request({
			url: apiUrl,
			method: 'GET',
			timeout: 30000,
			header: {
				'ngrok-skip-browser-warning': 'true',
				'Authorization': `Bearer ${aiChatTestToken}`,
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0',
				'Authorization': `Bearer ${aiChatTestToken}`
			},
			success: (res) => {
				if (res.statusCode === 200) {
					const data = res.data.characters || res.data || []

					resolve({
						code: 200,
						data: data
					})
				} else {
					reject({
						code: res.statusCode,
						message: '获取失败'
					})
				}
			},
			fail: (err) => {
				console.error('获取克隆人列表失败:', err)
				reject(err)
			}
		})
	})
}

/**
 * 创建克隆人（使用原生 FormData，暂时只支持 H5）
 * @param {Object} data - 克隆人数据
 * @param {String} data.avatar - 头像本地路径（用于上传）
 * @param {String} data.name - 名字
 * @param {String} data.birthday - 生日
 * @param {String} data.gender - 性别 (male/female)
 * @param {Boolean} data.isOriginal - 是否本人
 * @param {String} data.prototype - 原型标签
 * @param {Array} data.personality - 性格标签数组（最多3个）
 * @param {String} data.catchphrase - 口头语
 * @param {Array} data.interests - 兴趣爱好数组（最多3个）
 * @param {String} data.voiceType - 声音类型 (clone/purchase)
 * @returns {Promise}
 *
 * 接口地址: POST https://rozanne-unbiddable-doria.ngrok-free.dev/chat/create_character/
 * 请求格式: form-data (multipart/form-data)
 * 兼容平台: H5
 */
export const createClone = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			// 使用原生 FormData 支持重复键名
			const formData = new FormData()

			// 添加基础字段（字段名映射）
			formData.append('name', data.name)
			formData.append('gender', data.gender)
			formData.append('birthday', data.birthday || '')
			formData.append('speech_habits', data.catchphrase || '')  // 映射：catchphrase → speech_habits
			formData.append('archetype_tags', data.prototype || '')    // 映射：prototype → archetype_tags

			// 添加数组字段 - 使用重复键名（后端期望格式）
			// 例如：personality_tags=强势&personality_tags=温柔&personality_tags=体贴
			if (data.personality && data.personality.length > 0) {
				data.personality.forEach(item => {
					formData.append('personality_tags', item)
				})
			}

			if (data.interests && data.interests.length > 0) {
				data.interests.forEach(item => {
					formData.append('interest_tags', item)
				})
			}

			// 添加头像文件 - H5 环境处理
			if (data.avatar) {
				// 处理 blob URL、base64、File 对象
				if (data.avatar.startsWith('blob:')) {
					const response = await fetch(data.avatar)
					const blob = await response.blob()
					formData.append('avatar', blob, 'avatar.jpg')
				} else if (data.avatar.startsWith('data:')) {
					const response = await fetch(data.avatar)
					const blob = await response.blob()
					formData.append('avatar', blob, 'avatar.jpg')
				} else if (typeof data.avatar === 'object' && data.avatar instanceof File) {
					formData.append('avatar', data.avatar)
				} else {
					console.warn('未识别的头像格式:', typeof data.avatar, data.avatar)
				}
			}

			console.log('=== 创建克隆人请求 (H5) ===')
			console.log('原始数据:', data)
			console.log('FormData 内容:')
			for (let [key, value] of formData.entries()) {
				console.log(`  ${key}:`, value)
			}
			console.log('==========================')

			// 使用 fetch 发送请求
			const response = await fetch('https://rozanne-unbiddable-doria.ngrok-free.dev/chat/create_character/', {
				method: 'POST',
				body: formData,
				headers: {
					'ngrok-skip-browser-warning': 'true',
				'Authorization': `Bearer ${aiChatTestToken}`
				}
				// 注意：使用 FormData 时不要手动设置 Content-Type，浏览器会自动添加 boundary
			})

			console.log('=== 创建克隆人响应 ===')
			console.log('状态码:', response.status)

			if (response.ok) {
				const result = await response.json()
				console.log('响应数据:', result)
				console.log('====================')

				resolve({
					code: 200,
					data: result,
					message: '创建成功'
				})
			} else {
				const errorText = await response.text()
				console.error('响应数据:', errorText)
				console.error('====================')

				reject({
					code: response.status,
					message: '创建失败: ' + errorText
				})
			}
		} catch (error) {
			console.error('=== 创建克隆人失败 ===')
			console.error('错误信息:', error)
			console.error('====================')
			reject({
				code: -1,
				message: error.message || '网络请求失败'
			})
		}
	})
}

/**
 * 更新克隆人信息
 * @param {Number} id - 克隆人ID
 * @param {Object} data - 更新的数据
 * @returns {Promise}
 *
 * 接口地址: POST /chat/character/{id}/update/
 * 请求格式: form-data (multipart/form-data)
 * 说明：仅创建者可修改
 */
export const updateClone = (id, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			// 使用原生 FormData 支持重复键名
			const formData = new FormData()

			// 添加基础字段（字段名映射）
			formData.append('name', data.name)
			formData.append('gender', data.gender)
			formData.append('birthday', data.birthday || '')
			formData.append('speech_habits', data.catchphrase || '')
			formData.append('archetype_tags', data.prototype || '')

			// 添加数组字段 - 使用重复键名
			if (data.personality && data.personality.length > 0) {
				data.personality.forEach(item => {
					formData.append('personality_tags', item)
				})
			}

			if (data.interests && data.interests.length > 0) {
				data.interests.forEach(item => {
					formData.append('interest_tags', item)
				})
			}

			// 添加头像文件 - 只有当头像是新上传的才添加
			if (data.avatar && !data.avatar.startsWith('http')) {
				// 处理 blob URL、base64、File 对象
				if (data.avatar.startsWith('blob:')) {
					const response = await fetch(data.avatar)
					const blob = await response.blob()
					formData.append('avatar', blob, 'avatar.jpg')
				} else if (data.avatar.startsWith('data:')) {
					const response = await fetch(data.avatar)
					const blob = await response.blob()
					formData.append('avatar', blob, 'avatar.jpg')
				} else if (typeof data.avatar === 'object' && data.avatar instanceof File) {
					formData.append('avatar', data.avatar)
				}
			}

			console.log('=== 更新克隆人请求 ===')
			console.log('克隆人ID:', id)
			console.log('原始数据:', data)
			console.log('FormData 内容:')
			for (let [key, value] of formData.entries()) {
				console.log(`  ${key}:`, value)
			}
			console.log('======================')

			// 使用 fetch 发送请求
			const response = await fetch(`${aiChatBaseUrl}/chat/character/${id}/update/`, {
				method: 'POST',
				body: formData,
				headers: {
					'ngrok-skip-browser-warning': 'true',
					'Authorization': `Bearer ${aiChatTestToken}`
				}
			})

			console.log('=== 更新克隆人响应 ===')
			console.log('状态码:', response.status)

			if (response.ok) {
				const result = await response.json()
				console.log('响应数据:', result)
				console.log('====================')

				resolve({
					code: 200,
					data: result,
					message: '更新成功'
				})
			} else {
				const errorText = await response.text()
				console.error('响应数据:', errorText)
				console.error('====================')

				reject({
					code: response.status,
					message: '更新失败: ' + errorText
				})
			}
		} catch (error) {
			console.error('=== 更新克隆人失败 ===')
			console.error('错误信息:', error)
			console.error('====================')
			reject({
				code: -1,
				message: error.message || '网络请求失败'
			})
		}
	})
}

/**
 * 删除克隆人
 * @param {Number} id - 克隆人ID
 * @returns {Promise}
 *
 * 接口地址: POST /chat/character/{id}/delete/
 */
export const deleteClone = (id) => {
	return new Promise((resolve, reject) => {
		const apiUrl = `${aiChatBaseUrl}/chat/character/${id}/delete/`

		uni.request({
			url: apiUrl,
			method: 'POST',
			timeout: 30000,
			header: {
				'ngrok-skip-browser-warning': 'true',
				'Authorization': `Bearer ${aiChatTestToken}`,
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0',
				'Authorization': `Bearer ${aiChatTestToken}`
			},
			success: (res) => {
				if (res.statusCode === 200 || res.statusCode === 204) {
					resolve({
						code: 200,
						message: '删除成功'
					})
				} else {
					reject({
						code: res.statusCode,
						message: '删除失败'
					})
				}
			},
			fail: (err) => {
				console.error('删除克隆人失败:', err)
				reject(err)
			}
		})
	})
}

/**
 * 获取克隆人详情
 * @param {Number} id - 克隆人ID
 * @returns {Promise}
 *
 * 接口地址: GET /chat/character/{id}/detail/
 */
export const getCloneDetail = (id) => {
	return new Promise((resolve, reject) => {
		const apiUrl = `${aiChatBaseUrl}/chat/character/${id}/detail/`

		uni.request({
			url: apiUrl,
			method: 'GET',
			timeout: 30000,
			header: {
				'ngrok-skip-browser-warning': 'true',
				'Authorization': `Bearer ${aiChatTestToken}`,
				'Content-Type': 'application/json',
				'User-Agent': 'Mozilla/5.0',
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
						message: '获取失败'
					})
				}
			},
			fail: (err) => {
				console.error('获取克隆人详情失败:', err)
				reject(err)
			}
		})
	})
}

/**
 * 上传头像
 * @param {String} filePath - 本地文件路径
 * @returns {Promise}
 *
 * TODO: 对接后端接口
 * 接口地址: POST /upload/avatar/
 */
export const uploadAvatar = (filePath) => {
	return new Promise((resolve, reject) => {
		// TODO: 替换为真实上传接口
		uni.uploadFile({
			url: `${aiChatBaseUrl}/upload/avatar/`,
			filePath: filePath,
			name: 'file',
			success: (res) => {
				const data = JSON.parse(res.data)
				resolve(data)
			},
			fail: (err) => {
				reject(err)
			}
		})

		// 暂时返回本地路径
		// setTimeout(() => {
		// 	resolve({
		// 		code: 200,
		// 		data: {
		// 			url: filePath
		// 		}
		// 	})
		// }, 500)
	})
}
