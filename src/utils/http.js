// #ifdef APP-PLUS
import { host } from '@/config/config.js';
// #endif

// #ifndef APP-PLUS
const host = import.meta.env.VITE_API_BASE_URL;
// #endif
import { login } from "@/api/setup.js";
import { userinfoStore } from "@/store/userinfos";
// 验证token是否失效
var expired = false;
let requestRecord = {

}

// 登录状态管理
let isLoginRequesting = false;
let pendingRequests = [];
let currentToken = uni.getStorageSync('token') || '';

// 平台区分处理 - 不同的Content-Type
let httpConfig;

// #ifdef APP-PLUS
// APP端：使用JSON格式（与H5端保持一致）
httpConfig = {
	header: {
		'Content-Type': "application/json",
		'Authorization': 'Token ' + currentToken,
		'is-dev': 'true'
	},
	method: 'POST',
	showLoading: true, // 是否显示请求中的loading
	loadingText: '请求中...',
	loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
	timer: null, // 定时器
	loadingMask: false, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
	stopRepeat: false, // 是否阻止重复请求
	timeout: 15000, // 请求超时时间
	errorOutput: true // 请求失败输出信息
}
// #endif

// #ifdef H5
// H5端：使用JSON格式
httpConfig = {
	header: {
		'Content-Type': "application/json",
		'Authorization': 'Token ' + currentToken,
		'is-dev': 'true'
	},
	method: 'POST',
	showLoading: true, // 是否显示请求中的loading
	loadingText: '请求中...',
	loadingTime: 800, // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
	timer: null, // 定时器
	loadingMask: false, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
	stopRepeat: false, // 是否阻止重复请求
	timeout: 15000, // 请求超时时间
	errorOutput: true // 请求失败输出信息
}
// #endif

// 处理队列中的请求
function processPendingRequests() {
	if (pendingRequests.length > 0 && !isLoginRequesting) {
		pendingRequests.forEach(({ url, params, other, resolve, reject }) => {
			// 更新请求头中的 token
			other.header = {
				...other.header,
				'Authorization': 'Token ' + currentToken,
				'token': currentToken
			};
			executeRequest(url, params, other).then(resolve).catch(reject);
		});
		pendingRequests = [];
	}
}

// 执行实际的请求
function executeRequest(url, params, other) {
	other = {
		...httpConfig,
		...other
	};
	// 防止莫名其妙token有时不刷新问题
	other.header['token'] = currentToken
	return new Promise((resolve, reject) => {
		if (other.stopRepeat) {
			if (requestRecord.url === true) {
				reject();
				return;
			}
			requestRecord.url = true;
		}
		// 是否显示loading
		// 加一个是否已有timer定时器的判断，否则有两个同时请求的时候，后者会清除前者的定时器id
		// 而没有清除前者的定时器，导致前者超时，一直显示loading
		if (other.showLoading && !other.timer) {
			httpConfig.timer = setTimeout(() => {
				uni.showLoading({
					title: other.loadingText,
					mask: other.loadingMask
				})
				other.timer = null;
			}, other.loadingTime);
		}
		// 根据Content-Type决定数据格式
		let requestData = params;

		// 如果Content-Type是form-urlencoded，需要转换数据格式
		if (other.header['Content-Type'] === 'application/x-www-form-urlencoded') {
			requestData = Object.keys(params).map(key =>
				encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
			).join('&');
		}

		uni.request({
				// #ifdef APP-PLUS
			url: host + url,
			// #endif
			// #ifdef H5
			url: host + url,
			// #endif
			data: requestData,
			header: other.header,
			method: other.method,
			sslVerify: false,
			timeout: other.timeout,
			complete: data => {
				uni.hideLoading();
				clearTimeout(httpConfig.timer);
				httpConfig.timer = null;

				if (data.statusCode == 200 || data.statusCode == 201) {
					if (!(data.data.code == 403 && !expired)) {
						expired = false;
						if (data.data.code == 200 || data.data.code == 201) {
							// 检查是否是 auth/users 接口，如果是则更新用户信息
							if (url.includes('auth/users') && data.data.data) {
								try {
									const store = userinfoStore();
									// 合并更新，而不是直接覆盖，保留关键字段
									store.userinfo = { ...store.userinfo, ...data.data.data };
									// 同时更新本地存储
									uni.setStorageSync('userinfos_userinfo', store.userinfo);
								} catch (error) {
									console.error('更新用户信息失败:', error);
								}
							}
							resolve(data.data);
						} else {
							if (httpConfig.errorOutput) {
								uni.showToast({
									title: data.data.msg || data.data.message || '请求失败',
									icon: 'none'
								})
							}
							reject(data.data);
						}
					} else {
						uni.removeStorage({
							key: 'token'
						})
						uni.reLaunch({
							url: ''
						});
						expired = true;
						if (httpConfig.errorOutput) {
							uni.showToast({
								title: '身份已过期',
								icon: 'none'
							})
						}
						reject(data.data)
					}
				} else if (data.statusCode == 401) {
					// 将当前请求加入待处理队列
					pendingRequests.push({ url, params, other, resolve, reject });

					// 如果已经在处理登录，直接返回
					if (isLoginRequesting) {
						return;
					}

					// 开始自动登录
					isLoginRequesting = true;

					// 动态获取登录参数
					const stored_username = uni.getStorageSync("guid_name");
					const stored_password = uni.getStorageSync("guid_password");
					
					// 生成随机用户名和密码作为备用
					const guid_name = "user_" + Math.random().toString(36).substr(2, 9);
					const guid_password = "pass_" + Math.random().toString(36).substr(2, 9);
					
					const loginParams = {
						username: stored_username || guid_name,
						password: stored_password || guid_password
					};
					
					

					login(loginParams).then((res) => {

						// 更新 token
						currentToken = res.data.token;
						httpConfig.header['Authorization'] = 'Token ' + currentToken;

						// 保存用户信息
						uni.setStorageSync("user_info", res.data);
						uni.setStorageSync("token", res.data.token);
						
						// 处理用户信息 - 与H5端保持一致
						
						// 检查登录响应中的用户ID
						const userId = res.data.user_id || res.data.id;
						
						if (userId) {
							// 有用户ID，获取详细用户信息
							
							try {
								const store = userinfoStore();
								store.getUserinfo({ id: userId }).then(() => {
								}).catch((error) => {
									console.error('自动登录：获取用户信息失败:', error);
									// 使用登录响应中的基本信息
									const basicUserinfo = {
										id: userId,
										avatar: res.data.avatar || "",
										username: res.data.username || "用户",
										user_nickname: res.data.user_nickname || res.data.username || "用户",
										phone: res.data.phone || "",
										email: res.data.email || "",
										is_vip: res.data.is_vip || false,
										member_level: res.data.member_level || 0,
										gold_coin: res.data.gold_coin || 0,
										vip_days: res.data.vip_days || 0,
										status: res.data.status || 1,
										followers_count: res.data.followers_count || 0,
										following_count: res.data.following_count || 0,
										likes_count: res.data.likes_count || 0
									};
									store.userinfo = basicUserinfo;
									uni.setStorageSync("userinfos_userinfo", basicUserinfo);
								});
							} catch (error) {
								console.error('自动登录：store初始化失败:', error);
							}
						} else {
							// 使用登录响应中的基本信息
							const basicUserinfo = {
								id: res.data.id || "unknown",
								avatar: res.data.avatar || "",
								username: res.data.username || "用户",
								user_nickname: res.data.user_nickname || res.data.username || "用户",
								phone: res.data.phone || "",
								email: res.data.email || "",
								is_vip: res.data.is_vip || false,
								member_level: res.data.member_level || 0,
								gold_coin: res.data.gold_coin || 0,
								vip_days: res.data.vip_days || 0,
								status: res.data.status || 1,
								followers_count: res.data.followers_count || 0,
								following_count: res.data.following_count || 0,
								likes_count: res.data.likes_count || 0
							};
							
							try {
								const store = userinfoStore();
								store.userinfo = basicUserinfo;
								uni.setStorageSync("userinfos_userinfo", basicUserinfo);
							} catch (error) {
								console.error('自动登录：设置基本信息失败:', error);
							}
						}

						// 标记登录完成
						isLoginRequesting = false;

						// 处理队列中的请求
						processPendingRequests();
					}).catch((error) => {
						isLoginRequesting = false;

						// 自动登录失败时，设置默认用户信息
						// #ifdef APP-PLUS
						const fallbackUserinfo = {
							id: "guest",
							avatar: "",
							username: "guest",
							user_nickname: "游客",
							phone: "",
							email: "",
							is_vip: false,
							member_level: 0,
							gold_coin: 0,
							vip_days: 0,
							status: 1,
							followers_count: 0,
							following_count: 0,
							likes_count: 0
						};
						
						// 保存默认用户信息
						uni.setStorageSync("userinfos_userinfo", fallbackUserinfo);
						uni.setStorageSync("userinfo", fallbackUserinfo);
						uni.setStorageSync("user_info", fallbackUserinfo);
						
						// 更新store实例
						try {
							const store = userinfoStore();
							store.userinfo = fallbackUserinfo;
						} catch (storeError) {
						}
						// #endif

						// 拒绝所有待处理的请求
						pendingRequests.forEach(({ reject }) => {
							reject(error);
						});
						pendingRequests = [];
					});
				} else {
					if (httpConfig.errorOutput) {
						uni.showToast({
							title: '请求失败',
							icon: 'none'
						})
					}
					reject(data)
				}
				if (other.stopRepeat && requestRecord.url === true) {
					requestRecord.url = false;
				}
			}
		});
	})
}

// 主要的请求函数
function request(url, params, other) {
	return new Promise((resolve, reject) => {
		// 检查是否是登录接口
		if (url.includes('auth/login')) {

			isLoginRequesting = true;

			// 登录接口禁用 loading 显示
			const loginConfig = {
				...other,
				showLoading: false
			}

			executeRequest(url, params, loginConfig).then((result) => {

				// 如果登录成功，更新 token
				if (result && result.token) {
					currentToken = result.token;
					httpConfig.header['Authorization'] = 'Token ' + currentToken;
				} else {
				}

				// 标记登录完成
				isLoginRequesting = false;

				// 处理队列中的请求
				processPendingRequests();

				resolve(result);
			}).catch((error) => {
				
				isLoginRequesting = false;

				// 拒绝所有待处理的请求
				pendingRequests.forEach(({ reject }) => {
					reject(error);
				});
				pendingRequests = [];

				reject(error);
			});
		} else {
			// 非登录接口
			if (isLoginRequesting) {
				pendingRequests.push({ url, params, other, resolve, reject });
			} else {
				// 没有登录请求，直接执行
				executeRequest(url, params, other).then(resolve).catch(reject);
			}
		}
	});
}

function getRequest(url, params = {}, other = {}) {
	// 将GET请求的参数转换为查询字符串
	let fullUrl = url;
	if (params && Object.keys(params).length > 0) {
		const queryString = Object.keys(params)
			.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
			.join('&');
		
		// 如果URL已经有查询参数，用&连接；否则用?连接
		const connector = url.includes('?') ? '&' : '?';
		fullUrl = url + connector + queryString;
	}
	
	return request(fullUrl, {}, {
		...other,
		method: 'GET'
	})
}

function postRequest(url, params = {}, other = {}) {
	return request(url, params, {
		...other,
		method: 'POST'
	})
}
function putRequest(url, params = {}, other = {}) {
	return request(url, params, {
		...other,
		method: 'PUT'
	})
}
function patchRequest(url, params = {}, other = {}) {
	return request(url, params, {
		...other,
		method: 'PUT'
	})
}
export {
	request,
	getRequest,
	postRequest,
	putRequest,
	patchRequest
}