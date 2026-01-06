import {
	getRequest,
	postRequest
} from "@/utils/http";

// 推荐列表
export const getContentList = params => {
	return getRequest('/content/core/list', params);
}

// 发现列表
export const discoverList = params => {
	return getRequest('/content/core/listForFX', params)
}

/* 长视频详情 */
export const contentDetail = id => {
	return getRequest('/content/core/' + id)
}

/* 长视频 推荐列表 */
export const contentRandom = () => {
	return getRequest('/content/core/random')
}

/** 收藏 */
export const favoriteAdd = (pararms) => {
	return postRequest('/favorite/add', pararms)
}

/** 取消收藏 */
export const favoriteRemove = (pararms) => {
	return postRequest('/favorite/remove', pararms)
}

//分享
export const shareContent = (pararms) => {
	return postRequest('/contents/share/', pararms)
}



/** 点赞/取消点赞 */
export const contentToggle = (pararms) => {
	return postRequest('/likes/v1/content/toggle/', pararms)
}


/** 点踩/取消点踩 */
export const downvoteToggle = (pararms) => {
	return postRequest('/favourites/v1/downvote/toggle/', pararms)
}

/** 点赞/取消收藏 */
export const favouritesV1Toggle = (pararms) => {
	return postRequest('/favourites/v1/toggle/', pararms)
}

/** 点赞/取消评论 */
export const likesCommentToggle = (pararms) => {
	return postRequest('/likes/v1/comment/toggle/', pararms)
}

/** 评分 */
export const ratingRate = (pararms) => {
	return postRequest('/ratings/rate/', pararms)
}

/** 获取评分 */
export const ratingGet = (pararms) => {
	return postRequest('/ratings/get-rating/', pararms)
}