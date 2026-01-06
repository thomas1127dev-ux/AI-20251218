import { host, aiChatBaseUrl } from '@/config/config.js'

/**
 * 获取完整的头像URL
 * @param {String} avatarPath - 头像路径（可能是相对路径或完整URL）
 * @param {String} fallback - 后备默认头像路径（可选）
 * @returns {String} 完整的头像URL
 *
 * 使用示例：
 * getAvatarUrl('/media/avatars/xxx.png') => 'https://rozanne-unbiddable-doria.ngrok-free.dev/media/avatars/xxx.png'
 * getAvatarUrl('https://example.com/avatar.png') => 'https://example.com/avatar.png'
 * getAvatarUrl('') => '/static/logo.png' (后备图片)
 */
export function getAvatarUrl(avatarPath, fallback = '/static/logo.png') {
	// 如果没有传入头像路径，返回后备图片
	if (!avatarPath) {
		return fallback
	}

	// 如果已经是完整的 http/https URL，直接返回
	if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
		return avatarPath
	}

	// 如果是本地静态资源路径（/static/...），直接返回
	if (avatarPath.startsWith('/static/')) {
		return avatarPath
	}

	// 图片使用 AI 接口的域名（ngrok）
	// 因为图片资源存储在 AI 服务器上
	const path = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`
	return `${aiChatBaseUrl}${path}`
}

/**
 * 获取用户头像URL（从 uni.getStorageSync 获取用户信息）
 * @returns {String} 用户头像URL
 */
export function getCurrentUserAvatar() {
	const userInfo = uni.getStorageSync('user_info')
	return getAvatarUrl(userInfo?.avatar)
}
