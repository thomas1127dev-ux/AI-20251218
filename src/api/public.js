import {
	getRequest,
	postRequest
} from '@/utils/http.js'

// 广告查询
export const getAdsList = (params) => {
	return getRequest('/ad/ads/', params)
}
// 用户信息
export const getUserinfo = (params) => {
	return getRequest(`/auth/users/${params.id}`)
}

// 获取当前用户信息
export const getCurrentUserinfo = () => {
	return getRequest('/auth/users')
}

// 用户兴趣标签
export const tagList = params => {
	return getRequest('/tags/', params)
}

// 获取分类标签
export const getCategories = (params) => {
	return getRequest('/categories/', params)
}

// 广告（游戏）详情
export const adsDetail = (id, params) => {
	return getRequest(`/ad/ads/${id}`, params)
}

// 搜索
export const search = (params) => {
	return getRequest('/contents/', params)
}

//支付
export const pay = (params) => {
	return postRequest('/orders/initiate-payment/', params)
}
//支付结果
export const payResult = (params) => {
	return getRequest('/orders/payment-callback/', params)
}


//账单记录
export const bill = (params) => {
	return getRequest('/orders/', params)
}

//支付模板列表
export const paylist = (params) => {
	return getRequest('/payments/pay/', params)
}

//购买广告
export const purchase = (params) => {
	return postRequest(`/ad/ads/${params.id}/adv_purchase/`, params)
}

//获取游戏分类
export const getTags = (params) => {
	return getRequest(`/tags/`, params)
}






