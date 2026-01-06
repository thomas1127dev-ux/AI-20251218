import {
	getRequest,
	postRequest
} from '@/utils/http.js'

//创建社区内容
export const createCommunity = (params) => {
	return postRequest('/social/dynamic/', params)
}

//获取推荐社区列表
export const communityList = (params) => {
	return getRequest('/social/dynamic/', params)
}

//分享动态
export const addShare = (params) => {
	return postRequest('/social/dynamic/share/', params)
}


//关注列表
export const followList = (params) => {
	return getRequest('/social/dynamic_follow/', params)
}

//详情
export const getDetails = (params) => {
	return getRequest(`/social/dynamic/${params.dynamic_id}/`)
}

//点赞切换
export const liketoggle = (params) => {
	return postRequest('/likes/v2/dynamic/toggle/', params)
}



//创建评论
export const addComment = (params) => {
	return postRequest('/comments/v2/', params)
}

//获取评论
export const getCommentList = (params) => {
	return getRequest('/comments/v2/', params)
}

//获取评论
export const getCommentListV1 = (params) => {
	return getRequest('/comments/v1/', params)
}

//评论点赞
export const commentlike = (params) => {
	return postRequest('/likes/v1/comment/toggle/', params)
}

//关注切换
export const followtoggle = (params) => {
	return postRequest('/follows/v2/toggle/', params)
}



//创建评论内容
export const addCommentContent = (params) => {
	return postRequest('/comments/v1/', params)
}


//创建视频
export const createVideo = (params) => {
	return postRequest('/contents/', params)
}

//购买动态(金币)
export const purchase = (params) => {
	return postRequest(`/comments/v2/${params.id}/purchase/`, params)
}

//购买视频(金币) - 首页和发现页专用
export const purchaseVideo = (params) => {
    // 平台区分：APP与H5提交方式区分处理
    // #ifdef APP-PLUS
    // APP：仅通过路径参数提交，body置空，兼容服务端实现
    return postRequest(`/comments/v1/${params.id}/purchase/`, {})
    // #endif
    // #ifndef APP-PLUS
    // H5：与后端约定使用JSON参数
    return postRequest(`/comments/v1/${params.id}/purchase/`, params)
    // #endif
}

//获取子评论
export const childrenComment = (params) => {
	return getRequest('/comments/v1/all-children-by-parent/', params)
}













