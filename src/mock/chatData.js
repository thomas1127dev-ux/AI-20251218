/**
 * 对话模块 Mock 数据
 * 用于开发阶段模拟后端接口数据
 * TODO: 后续切换为真实后端接口
 */

// ===== 1. 会话列表数据 =====
export const mockSessions = [
	{
		session_id: 1,
		user_id: 101, // 当前用户ID
		user_nickname: "我",
		user_avatar: "https://picsum.photos/200/200?random=1",
		other_user_id: 202, // 克隆人ID
		other_user_nickname: "林佩瑜",
		other_user_avatar: "https://picsum.photos/200/200?random=2",
		last_message: {
			content: "When we will meet?",
			type: "text", // text/image/video/voice
			created_at: "2025-12-18 09:30:00"
		},
		unread_count: 1, // 未读消息数
		is_pinned: false, // 是否置顶
		update_time: "2025-12-18 09:30:00"
	},
	{
		session_id: 2,
		user_id: 101,
		user_nickname: "我",
		user_avatar: "https://picsum.photos/200/200?random=1",
		other_user_id: 203,
		other_user_nickname: "林佩瑜",
		other_user_avatar: "https://picsum.photos/200/200?random=3",
		last_message: {
			content: "saepe distinctio quas",
			type: "text",
			created_at: "2025-12-18 09:30:00"
		},
		unread_count: 0,
		is_pinned: false,
		update_time: "2025-12-18 09:30:00"
	},
	{
		session_id: 3,
		user_id: 101,
		user_nickname: "我",
		user_avatar: "https://picsum.photos/200/200?random=1",
		other_user_id: 204,
		other_user_nickname: "林沐姬",
		other_user_avatar: "https://picsum.photos/200/200?random=4",
		last_message: {
			content: "[图片]",
			type: "image",
			created_at: "2025-12-18 08:15:00"
		},
		unread_count: 3,
		is_pinned: true,
		update_time: "2025-12-18 08:15:00"
	},
	{
		session_id: 4,
		user_id: 101,
		user_nickname: "我",
		user_avatar: "https://picsum.photos/200/200?random=1",
		other_user_id: 205,
		other_user_nickname: "小冰",
		other_user_avatar: "https://picsum.photos/200/200?random=5",
		last_message: {
			content: "[语音]",
			type: "voice",
			created_at: "2025-12-17 22:45:00"
		},
		unread_count: 0,
		is_pinned: false,
		update_time: "2025-12-17 22:45:00"
	}
]

// ===== 2. 消息详情数据（按session_id分组）=====
// 注意：字段名与现有代码保持一致
export const mockMessages = {
	// session_id = 1 的消息列表
	1: [
		{
			id: 1,
			session_id: 1,
			sender_id: 202, // 克隆人ID
			sender_avatar: "https://picsum.photos/200/200?random=2",
			receiver_id: 1, // session_id
			receiver_avatar: "https://picsum.photos/200/200?random=1",
			reply_to_id: 202,
			content: "简介:林沐姬,24岁,前世她是女总裁,你是她的闺蜜,她被你陷害破产,你把她资金都转移到自己名下,她",
			message_type: "text",
			media_url: "",
			duration: 0,
			createTime: "2025-12-18 09:28:00",
			is_read: true
		},
		{
			id: 2,
			session_id: 1,
			sender_id: 202,
			sender_avatar: "https://picsum.photos/200/200?random=2",
			receiver_id: 1,
			receiver_avatar: "https://picsum.photos/200/200?random=1",
			reply_to_id: 202,
			content: "(看了眼合同)这么明显的漏洞,就敢让我签字?(心想:上一世相信你,根本没看合同)",
			message_type: "text",
			media_url: "",
			duration: 0,
			createTime: "2025-12-18 09:29:00",
			is_read: true
		},
		{
			id: 3,
			session_id: 1,
			sender_id: 202,
			sender_avatar: "https://picsum.photos/200/200?random=2",
			receiver_id: 1,
			receiver_avatar: "https://picsum.photos/200/200?random=1",
			reply_to_id: 202,
			content: "",
			message_type: "image",
			media_url: "https://picsum.photos/400/600?random=101",
			duration: 0,
			createTime: "2025-12-18 09:29:30",
			is_read: true
		},
		{
			id: 4,
			session_id: 1,
			sender_id: 202,
			sender_avatar: "https://picsum.photos/200/200?random=2",
			receiver_id: 1,
			receiver_avatar: "https://picsum.photos/200/200?random=1",
			reply_to_id: 202,
			content: "",
			message_type: "video",
			media_url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
			video_thumbnail: "https://picsum.photos/400/600?random=102",
			duration: 0,
			createTime: "2025-12-18 09:29:45",
			is_read: true
		},
		{
			id: 5,
			session_id: 1,
			sender_id: 101, // 用户ID
			sender_avatar: "https://picsum.photos/200/200?random=1",
			receiver_id: 1,
			receiver_avatar: "https://picsum.photos/200/200?random=2",
			reply_to_id: 202,
			content: "你好文字",
			message_type: "text",
			media_url: "",
			duration: 0,
			createTime: "2025-12-18 09:30:00",
			is_read: false
		}
	],
	// session_id = 2 的消息列表
	2: [
		{
			id: 6,
			session_id: 2,
			sender_id: 203,
			sender_avatar: "https://picsum.photos/200/200?random=3",
			receiver_id: 2,
			receiver_avatar: "https://picsum.photos/200/200?random=1",
			reply_to_id: 203,
			content: "When we will meet?",
			message_type: "text",
			media_url: "",
			duration: 0,
			createTime: "2025-12-18 09:30:00",
			is_read: false
		},
		{
			id: 7,
			session_id: 2,
			sender_id: 101,
			sender_avatar: "https://picsum.photos/200/200?random=1",
			receiver_id: 2,
			receiver_avatar: "https://picsum.photos/200/200?random=3",
			reply_to_id: 203,
			content: "明天下午3点怎么样？",
			message_type: "text",
			media_url: "",
			duration: 0,
			createTime: "2025-12-18 09:25:00",
			is_read: true
		}
	],
	// session_id = 3 的消息列表
	3: [
		{
			id: 8,
			session_id: 3,
			sender_id: 204,
			sender_avatar: "https://picsum.photos/200/200?random=4",
			receiver_id: 3,
			receiver_avatar: "https://picsum.photos/200/200?random=1",
			reply_to_id: 204,
			content: "简介:林沐姬,24岁,前世她是女总裁,你是她的闺蜜...",
			message_type: "text",
			media_url: "",
			duration: 0,
			createTime: "2025-12-18 08:10:00",
			is_read: true
		},
		{
			id: 9,
			session_id: 3,
			sender_id: 204,
			sender_avatar: "https://picsum.photos/200/200?random=4",
			receiver_id: 3,
			receiver_avatar: "https://picsum.photos/200/200?random=1",
			reply_to_id: 204,
			content: "",
			message_type: "image",
			media_url: "https://picsum.photos/400/600?random=103",
			duration: 0,
			createTime: "2025-12-18 08:15:00",
			is_read: false
		}
	],
	// session_id = 4 的消息列表
	4: [
		{
			id: 10,
			session_id: 4,
			sender_id: 205,
			sender_avatar: "https://picsum.photos/200/200?random=5",
			receiver_id: 4,
			receiver_avatar: "https://picsum.photos/200/200?random=1",
			reply_to_id: 205,
			content: "你好，有什么可以帮助你的吗？",
			message_type: "text",
			media_url: "",
			duration: 0,
			createTime: "2025-12-17 22:40:00",
			is_read: true
		},
		{
			id: 11,
			session_id: 4,
			sender_id: 205,
			sender_avatar: "https://picsum.photos/200/200?random=5",
			receiver_id: 4,
			receiver_avatar: "https://picsum.photos/200/200?random=1",
			reply_to_id: 205,
			content: "",
			message_type: "voice",
			media_url: "https://sample-voice.com/voice.mp3",
			duration: 5, // 语音时长（秒）
			createTime: "2025-12-17 22:45:00",
			is_read: false
		}
	]
}

// ===== 3. 我的克隆人数据 =====
export const mockClones = {
	owned: [ // 我拥有的克隆人
		{
			id: 1,
			clone_id: "CLONE_001",
			name: "小冰",
			avatar: "https://picsum.photos/200/200?random=10",
			prototype: "二次元",
			personality: ["温柔", "可爱", "善解人意"],
			description: "一个温柔可爱的二次元女孩，总是能给你带来温暖",
			created_at: "2025-12-01",
			is_favorite: true
		},
		{
			id: 2,
			clone_id: "CLONE_002",
			name: "林佩瑜",
			avatar: "https://picsum.photos/200/200?random=11",
			prototype: "高颜值大V",
			personality: ["御姐", "知性", "独立"],
			description: "知性御姐范，独立自主的现代女性",
			created_at: "2025-12-05",
			is_favorite: false
		},
		{
			id: 3,
			clone_id: "CLONE_003",
			name: "林沐姬",
			avatar: "https://picsum.photos/200/200?random=12",
			prototype: "霸道总裁",
			personality: ["霸道", "聪明", "复仇"],
			description: "前世被闺蜜陷害的女总裁，重生归来复仇",
			created_at: "2025-12-08",
			is_favorite: true
		}
	],
	created: [ // 我创造的克隆人
		{
			id: 4,
			clone_id: "CLONE_CUSTOM_001",
			name: "我的AI助手",
			avatar: "https://picsum.photos/200/200?random=13",
			prototype: "自定义",
			personality: ["聪明", "幽默", "贴心", "专业"],
			description: "专属定制的智能助手，懂你的一切",
			created_at: "2025-12-10",
			is_favorite: true,
			chat_count: 156 // 对话次数
		}
	]
}

// ===== 4. 表情包数据 =====
export const mockEmojis = [
	// 常用 Emoji
	{ id: 1, url: "😀", code: "smile", category: "emoji" },
	{ id: 2, url: "😂", code: "joy", category: "emoji" },
	{ id: 3, url: "😍", code: "heart_eyes", category: "emoji" },
	{ id: 4, url: "🥰", code: "smiling_face_with_hearts", category: "emoji" },
	{ id: 5, url: "😘", code: "kissing_heart", category: "emoji" },
	{ id: 6, url: "😎", code: "sunglasses", category: "emoji" },
	{ id: 7, url: "🤔", code: "thinking", category: "emoji" },
	{ id: 8, url: "😭", code: "sob", category: "emoji" },
	{ id: 9, url: "😅", code: "sweat_smile", category: "emoji" },
	{ id: 10, url: "😊", code: "blush", category: "emoji" },
	{ id: 11, url: "😉", code: "wink", category: "emoji" },
	{ id: 12, url: "🤗", code: "hugging", category: "emoji" },
	{ id: 13, url: "🤭", code: "hand_over_mouth", category: "emoji" },
	{ id: 14, url: "😏", code: "smirk", category: "emoji" },
	{ id: 15, url: "😳", code: "flushed", category: "emoji" },
	{ id: 16, url: "🥺", code: "pleading", category: "emoji" },
	{ id: 17, url: "😤", code: "triumph", category: "emoji" },
	{ id: 18, url: "😱", code: "scream", category: "emoji" },
	{ id: 19, url: "🤯", code: "exploding_head", category: "emoji" },
	{ id: 20, url: "😴", code: "sleeping", category: "emoji" },

	// 手势 Emoji
	{ id: 21, url: "👍", code: "thumbs_up", category: "emoji" },
	{ id: 22, url: "👎", code: "thumbs_down", category: "emoji" },
	{ id: 23, url: "👏", code: "clap", category: "emoji" },
	{ id: 24, url: "🙏", code: "pray", category: "emoji" },
	{ id: 25, url: "💪", code: "muscle", category: "emoji" },
	{ id: 26, url: "❤️", code: "heart", category: "emoji" },
	{ id: 27, url: "💔", code: "broken_heart", category: "emoji" },
	{ id: 28, url: "🌹", code: "rose", category: "emoji" },
	{ id: 29, url: "🎁", code: "gift", category: "emoji" },
	{ id: 30, url: "🎉", code: "party", category: "emoji" }
]

// ===== 5. 聊天背景数据 =====
export const mockChatBackgrounds = [
	{
		id: 1,
		name: "默认背景",
		url: "",
		thumbnail: "",
		is_default: true
	},
	{
		id: 2,
		name: "星空",
		url: "https://picsum.photos/800/1200?random=bg1",
		thumbnail: "https://picsum.photos/200/300?random=bg1",
		is_default: false
	},
	{
		id: 3,
		name: "渐变紫",
		url: "https://picsum.photos/800/1200?random=bg2",
		thumbnail: "https://picsum.photos/200/300?random=bg2",
		is_default: false
	},
	{
		id: 4,
		name: "粉色浪漫",
		url: "https://picsum.photos/800/1200?random=bg3",
		thumbnail: "https://picsum.photos/200/300?random=bg3",
		is_default: false
	}
]

// ===== 6. 模拟AI自动回复数据 =====
// TODO: 后续接入真实大模型接口
export const mockAIReplies = [
	"我明白你的感受，让我想想...",
	"这个问题很有趣呢～",
	"嗯嗯，我在认真听哦",
	"你说得对，我也这么觉得",
	"哈哈，你真有意思",
	"让我考虑一下怎么回答你",
	"我会一直陪着你的",
	"今天天气真好，想和你一起出去走走",
	"你吃饭了吗？要记得按时吃饭哦",
	"晚安，做个好梦～"
]

// 默认导出所有数据
export default {
	mockSessions,
	mockMessages,
	mockClones,
	mockEmojis,
	mockChatBackgrounds,
	mockAIReplies
}
