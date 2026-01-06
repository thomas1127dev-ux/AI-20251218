// 平台区分处理
// #ifdef H5
// H5端：使用 Pinia
import { defineStore } from 'pinia';
import {
	getUserinfo,
	getCurrentUserinfo
} from '@/api/public.js'

export const userinfoStore = defineStore('userinfos', {
	state: () => {
		return {
			userinfo: {}, //用户信息
			personInfo: {},
			// 对话列表优化相关
			chatListCache: [], // 对话列表缓存
			shouldRefreshChatList: false, // 是否应该刷新对话列表
			lastChatListRefreshTime: 0, // 上次刷新对话列表的时间戳
			// 克隆人列表优化相关
			ownedClonesCache: [], // 我拥有的克隆人缓存
			createdClonesCache: [], // 我创造的克隆人缓存
			shouldRefreshClones: false, // 是否应该刷新克隆人列表
			lastClonesRefreshTime: 0 // 上次刷新克隆人列表的时间戳
		};
	},
	actions: {
		async getUserinfo(params) {
			const res = await getUserinfo(params)
			this.userinfo = res.data
		},
		async getPersonInfo(params) {
			const res = await getUserinfo(params)
			this.personInfo = res.data
		},
		// 直接设置personInfo（用于从消息列表进入对话）
		setPersonInfo(data) {
			console.log('H5端：设置personInfo', data)
			this.personInfo = data
		},
		// 获取当前用户信息并覆盖
		async updateCurrentUserinfo() {
			try {
				const res = await getCurrentUserinfo()
				if (res && res.data) {
					// 覆盖用户信息
					this.userinfo = res.data
					console.log('用户信息已更新:', res.data)
					return res.data
				}
			} catch (error) {
				console.error('获取用户信息失败:', error)
				throw error
			}
		},
		// 更新对话列表缓存
		setChatListCache(list) {
			this.chatListCache = list
		},
		// 设置刷新标记
		setShouldRefreshChatList(value) {
			this.shouldRefreshChatList = value
		},
		// 更新上次刷新时间
		updateLastChatListRefreshTime() {
			this.lastChatListRefreshTime = Date.now()
		},
		// 克隆人列表缓存管理
		setOwnedClonesCache(list) {
			this.ownedClonesCache = list
		},
		setCreatedClonesCache(list) {
			this.createdClonesCache = list
		},
		setShouldRefreshClones(value) {
			this.shouldRefreshClones = value
		},
		updateLastClonesRefreshTime() {
			this.lastClonesRefreshTime = Date.now()
		}
	},
	persist: {
		storage: {
			getItem: (key) => uni.getStorageSync(key),
			setItem: (key, value) => uni.setStorageSync(key, value),
			removeItem: (key) => uni.removeStorageSync(key),
		},
		paths: [
			'userinfo',
			'personInfo',
			'chatListCache',
			'lastChatListRefreshTime',
			'ownedClonesCache',
			'createdClonesCache',
			'lastClonesRefreshTime'
		]
	}
});
// #endif

// #ifdef APP-PLUS
// APP端：使用原生类实现
import { userinfoStore as appUserinfoStore } from './userinfos-app.js';

// APP端：创建兼容函数，返回类实例
export function userinfoStore() {
	return appUserinfoStore;
}
// #endif