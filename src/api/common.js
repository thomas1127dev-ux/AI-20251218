import {
	getRequest,
	postRequest,
	putRequest
} from '@/utils/http.js'

// 分类列表
export const categoryList= (params) => {
	return getRequest('/categories/',params)
}

// 分类详情
export const categoryDetail= (id) => {
	return getRequest('/categories/' + id)
}

// 内容列表
export const contentList= (params) => {
	return getRequest('/contents/', params)
}

// 关注内容列表
export const contentFollowList= (params) => {
	return getRequest('/contents/content_follow/', params)
}

// 内容详情
export const contentDetail= (id) => {
	return getRequest('/contents/' + id)
}

// 内容评论
export const contentCommentList= (params) => {
	return getRequest('/comments/v1/', params)
}

// 获取评论的回复列表
export const getCommentReplies = (params) => {
	return getRequest('/comments/v1/all-children-by-parent/', params)
}

// 内容评论
export const addContentComment= (params) => {
	return postRequest('/comments/v1/', params)
}

//内容评论点赞 
export const addContentLike= (params) => {
	return postRequest('/likes/v1/comment/toggle/', params)
}

// 猜你喜欢
export const guessLike= (params) => {
	return getRequest('/contents/guesslike/', params)
}

// 内容点赞
export const contentLike= (id) => {
	return postRequest('/likes/v1/content/toggle/', { target_id: id })
}

// 内容收藏
export const contentCollect= (id) => {
	return postRequest('/favourites/v1/toggle/', { target_id: id })
}

// 任务列表
export const taskList = (params) =>{
	return getRequest('/tasks/reward/', params)
}

//领取任务
export const addtask = (id) =>{
	return postRequest(`/tasks/reward/${id}/claim/`)
}

// 推荐博主列表
export const bloggerList = (params) => {
	return getRequest('/tags/recommend-users/', params)
}

// 获取推荐用户标签
export const getRecommendTagUsers = (params) => {
	return getRequest('/contents/content_follow/recommend_tag_users/', params)
}

// 根据用户ID获取作品
export const getContentsByUser = (params) => {
	return getRequest('/contents/', params)
}

// 关注用户
export const followUser = (params) => {
	return postRequest('/follows/v2/toggle/', params)
}