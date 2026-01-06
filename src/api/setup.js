import {
	getRequest,
	postRequest,
	putRequest,
	patchRequest
} from '@/utils/http.js'

export const updataUserinfo = (id,params) => {
	return patchRequest('/auth/users/'+id + '/', params)
}

// 登录
export const login = (data) => {
	return postRequest('/auth/login/', data, {
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}

//检查关注状态
export const followCheck= (params) => {
	return getRequest('/follow/check',params)
}

//动态列表
export const dynamicsList = (params) => {
	return getRequest('/social/dynamic/',params)
}

//互动列表
export const allList = (params) => {
	return getRequest('/social/interaction_message/',params)
}

//获取视频
export const getVideo = (params) => {
	return getRequest('/contents/', params)
}

//购买视频
export const purchase = (params) => {
	return postRequest(`/comments/v1/${params.id}/purchase/`, params)
}







