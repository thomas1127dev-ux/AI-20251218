import {
	getRequest,
	postRequest
} from '@/utils/http.js'


//获取会话列表 
export const getlist = (params) => {
	return getRequest(`/chat/session/`,params)
}
//创建会话房间
export const createRoom = (params) => {
	return postRequest('/chat/session/create-room/', params)
}

//发送消息
export const sendMessage = (params) => {
	return postRequest('/chat/message/send/', params)
}


//获取会话详情
export const details = (params) => {
	return getRequest(`/chat/message/`,params)
}






//获取通知
export const getNotice = (params) => {
	return getRequest('/notifications/', params)
}
