/**
 * 统一缓存管理工具
 * 用于管理应用中的各类数据缓存，减少不必要的网络请求
 */

import { userinfoStore } from '@/store/userinfos.js'

// 缓存策略配置
const CACHE_CONFIG = {
	// 对话列表：30秒缓存
	chatList: {
		ttl: 30 * 1000,
		cacheKey: 'chatListCache',
		timeKey: 'lastChatListRefreshTime',
		flagKey: 'shouldRefreshChatList'
	},
	// 我拥有的克隆人：60秒缓存
	ownedClones: {
		ttl: 60 * 1000,
		cacheKey: 'ownedClonesCache',
		timeKey: 'lastClonesRefreshTime',
		flagKey: 'shouldRefreshClones'
	},
	// 我创造的克隆人：60秒缓存
	createdClones: {
		ttl: 60 * 1000,
		cacheKey: 'createdClonesCache',
		timeKey: 'lastClonesRefreshTime',
		flagKey: 'shouldRefreshClones'
	}
}

export class CacheManager {
	/**
	 * 检查缓存是否有效
	 * @param {string} cacheType - 缓存类型（chatList/ownedClones/createdClones）
	 * @param {boolean} forceRefresh - 是否强制刷新
	 * @returns {boolean} 缓存是否有效
	 */
	static isValid(cacheType, forceRefresh = false) {
		// 强制刷新，缓存无效
		if (forceRefresh) {
			console.log(`[CacheManager] ${cacheType}: 强制刷新`)
			return false
		}

		const config = CACHE_CONFIG[cacheType]
		if (!config) {
			console.warn(`[CacheManager] 未知的缓存类型: ${cacheType}`)
			return false
		}

		const store = userinfoStore()

		// 检查刷新标记
		const refreshFlag = store[config.flagKey]
		if (refreshFlag) {
			console.log(`[CacheManager] ${cacheType}: 存在刷新标记`)
			return false
		}

		// 检查缓存数据是否存在
		const cacheData = store[config.cacheKey]
		if (!cacheData || cacheData.length === 0) {
			console.log(`[CacheManager] ${cacheType}: 缓存为空`)
			return false
		}

		// 检查缓存时间是否过期
		const lastRefreshTime = store[config.timeKey] || 0
		const now = Date.now()
		const timeSinceLastRefresh = now - lastRefreshTime
		const isExpired = timeSinceLastRefresh > config.ttl

		if (isExpired) {
			console.log(`[CacheManager] ${cacheType}: 缓存已过期 (${timeSinceLastRefresh}ms > ${config.ttl}ms)`)
			return false
		}

		console.log(`[CacheManager] ${cacheType}: 缓存有效 (剩余 ${config.ttl - timeSinceLastRefresh}ms)`)
		return true
	}

	/**
	 * 获取缓存数据
	 * @param {string} cacheType - 缓存类型
	 * @returns {Array} 缓存数据
	 */
	static getCache(cacheType) {
		const config = CACHE_CONFIG[cacheType]
		if (!config) {
			console.warn(`[CacheManager] 未知的缓存类型: ${cacheType}`)
			return []
		}

		const store = userinfoStore()
		const cacheData = store[config.cacheKey] || []
		console.log(`[CacheManager] ${cacheType}: 获取缓存，共 ${cacheData.length} 条`)
		return [...cacheData]
	}

	/**
	 * 设置缓存数据
	 * @param {string} cacheType - 缓存类型
	 * @param {Array} data - 要缓存的数据
	 */
	static setCache(cacheType, data) {
		const config = CACHE_CONFIG[cacheType]
		if (!config) {
			console.warn(`[CacheManager] 未知的缓存类型: ${cacheType}`)
			return
		}

		const store = userinfoStore()

		// 更新缓存数据
		if (store[`set${this._capitalize(config.cacheKey)}`]) {
			// 使用store的action方法（如果存在）
			const actionName = this._getCacheActionName(cacheType)
			if (actionName && store[actionName]) {
				store[actionName](data)
			} else {
				store[config.cacheKey] = data
			}
		} else {
			store[config.cacheKey] = data
		}

		// 更新刷新时间
		if (store.updateLastClonesRefreshTime && cacheType.includes('Clones')) {
			store.updateLastClonesRefreshTime()
		} else if (store.updateLastChatListRefreshTime && cacheType === 'chatList') {
			store.updateLastChatListRefreshTime()
		} else {
			store[config.timeKey] = Date.now()
		}

		// 清除刷新标记
		this.clearRefreshFlag(cacheType)

		console.log(`[CacheManager] ${cacheType}: 缓存已更新，共 ${data.length} 条`)
	}

	/**
	 * 获取缓存action方法名
	 * @param {string} cacheType - 缓存类型
	 * @returns {string|null} action方法名
	 */
	static _getCacheActionName(cacheType) {
		const mapping = {
			chatList: 'setChatListCache',
			ownedClones: 'setOwnedClonesCache',
			createdClones: 'setCreatedClonesCache'
		}
		return mapping[cacheType] || null
	}

	/**
	 * 设置刷新标记
	 * @param {string} cacheType - 缓存类型
	 */
	static setRefreshFlag(cacheType) {
		const config = CACHE_CONFIG[cacheType]
		if (!config) {
			console.warn(`[CacheManager] 未知的缓存类型: ${cacheType}`)
			return
		}

		const store = userinfoStore()

		if (cacheType.includes('Clones')) {
			// 克隆人列表共用一个刷新标记
			if (store.setShouldRefreshClones) {
				store.setShouldRefreshClones(true)
			} else {
				store.shouldRefreshClones = true
			}
		} else if (cacheType === 'chatList') {
			if (store.setShouldRefreshChatList) {
				store.setShouldRefreshChatList(true)
			} else {
				store.shouldRefreshChatList = true
			}
		}

		console.log(`[CacheManager] ${cacheType}: 刷新标记已设置`)
	}

	/**
	 * 清除刷新标记
	 * @param {string} cacheType - 缓存类型
	 */
	static clearRefreshFlag(cacheType) {
		const config = CACHE_CONFIG[cacheType]
		if (!config) {
			return
		}

		const store = userinfoStore()

		if (cacheType.includes('Clones')) {
			// 克隆人列表共用一个刷新标记
			if (store.setShouldRefreshClones) {
				store.setShouldRefreshClones(false)
			} else {
				store.shouldRefreshClones = false
			}
		} else if (cacheType === 'chatList') {
			if (store.setShouldRefreshChatList) {
				store.setShouldRefreshChatList(false)
			} else {
				store.shouldRefreshChatList = false
			}
		}

		console.log(`[CacheManager] ${cacheType}: 刷新标记已清除`)
	}

	/**
	 * 清除缓存
	 * @param {string} cacheType - 缓存类型
	 */
	static clearCache(cacheType) {
		const config = CACHE_CONFIG[cacheType]
		if (!config) {
			console.warn(`[CacheManager] 未知的缓存类型: ${cacheType}`)
			return
		}

		const store = userinfoStore()
		store[config.cacheKey] = []
		store[config.timeKey] = 0

		console.log(`[CacheManager] ${cacheType}: 缓存已清除`)
	}

	/**
	 * 首字母大写
	 * @param {string} str
	 * @returns {string}
	 */
	static _capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}
}

export default CacheManager
