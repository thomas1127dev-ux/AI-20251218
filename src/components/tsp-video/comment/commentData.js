const commentData = [
	{
		avatar: '/static/tsp-icon/touxiang.jpg',
		username: '卧槽无情',
		content: '善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666',
		time: '3-14',
		likes: 10,
		ipAddres: '福建',
		author: 1, //是否是作者
	},
	{
		avatar: '/static/tsp-icon/tsp-bq1.jpg',
		username: '这个胖子有点帅',
		content: '果然艺术源于生活',
		time: '3-14',
		likes: 8,
		ipAddres: '福建',
	},
	{
		avatar: '/static/tsp-icon/touxiang.jpg',
		username: '元气满满',
		content: '没想到这样子都能火',
		time: '3-14',
		likes: 0,
		ipAddres: '福建',
	},
	{
		avatar: '/static/tsp-icon/tsp-bq1.jpg',
		username: '臭宝宝不乖',
		content: '喜欢唱、跳、rap、篮球',
		time: '3-14',
		likes: 2,
		ipAddres: '福建',
	},
	{
		avatar: '/static/tsp-icon/touxiang.jpg',
		username: '小哥哥',
		content: '喜欢唱、跳、rap、篮球',
		time: '3-14',
		likes: 0,
		ipAddres: '福建',
	},
	{
		avatar: '/static/tsp-icon/touxiang.jpg',
		username: '卧槽无情',
		content: '善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666',
		time: '3-14',
		likes: 10,
		ipAddres: '福建',
		author: 1, //是否是作者
	},
	{
		avatar: '/static/tsp-icon/tsp-bq1.jpg',
		username: '这个胖子有点帅',
		content: '果然艺术源于生活',
		time: '3-14',
		likes: 8,
		ipAddres: '福建',
	},
	{
		avatar: '/static/tsp-icon/touxiang.jpg',
		username: '元气满满',
		content: '没想到这样子都能火',
		time: '3-14',
		likes: 0,
		ipAddres: '福建',
	},
	{
		avatar: '/static/tsp-icon/tsp-bq1.jpg',
		username: '臭宝宝不乖',
		content: '喜欢唱、跳、rap、篮球',
		time: '3-14',
		likes: 2,
		ipAddres: '福建',
	},
	{
		avatar: '/static/tsp-icon/touxiang.jpg',
		username: '小哥哥',
		content: '喜欢唱、跳、rap、篮球',
		time: '3-14',
		likes: 0,
		ipAddres: '福建',
	},
]

/* 回复列表模拟数据 */
const replyData = [
	{
		avatar: '/static/image/draft_cover16.jpg',
		username: '鸡你太美',
		content: '善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666',
		time: '3-14',
		likes: 10,
		ipAddres: '福建',
		replyUser: '卧槽无情'
	},
	{
		avatar: '/static/tsp-icon/tsp-bq1.jpg',
		username: '篮球',
		content: '非官方大哥飒飒的',
		time: '3-14',
		likes: 10,
		ipAddres: '福建',
	},
	{
		avatar: '/static/tsp-icon/touxiang.jpg',
		username: '动次打次',
		content: '善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666善语结善缘，老铁666',
		time: '3-14',
		likes: 10,
		ipAddres: '福建',
	},
	{
		avatar: '/static/tsp-icon/tsp-bq1.jpg',
		username: 'rap哥哥',
		content: '广东富豪股份分割',
		time: '3-14',
		likes: 10,
		ipAddres: '福建',
		replyUser: '动次打次'
	},
	{
		avatar: '/static/tsp-icon/tsp-bq1.jpg',
		username: '小黑子',
		content: '房管局湖广会馆反对反对',
		time: '3-14',
		likes: 10,
		ipAddres: '福建',
		replyUser: 'rap哥哥'
	},
]

export const getCommentData = () =>{
	return commentData
}

export const getReplyData = () =>{
	return replyData
}
// export default vodData