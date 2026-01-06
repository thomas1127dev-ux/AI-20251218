<template>
	<image
		:src="blobUrl || fallback"
		:mode="mode"
		:class="imgClass"
		:style="imgStyle"
		@error="handleError"
	/>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
	src: {
		type: String,
		required: true
	},
	mode: {
		type: String,
		default: 'aspectFill'
	},
	fallback: {
		type: String,
		default: '/static/logo.png'
	},
	imgClass: String,
	imgStyle: [String, Object]
})

const blobUrl = ref('')

// 加载图片（带 ngrok 请求头）
const loadImage = async () => {
	if (!props.src || props.src.startsWith('/static/')) {
		blobUrl.value = props.src
		return
	}

	try {
		// 使用 uni.request 下载图片（可以添加请求头）
		uni.request({
			url: props.src,
			method: 'GET',
			responseType: 'arraybuffer',
			header: {
				'ngrok-skip-browser-warning': 'true'
			},
			success: (res) => {
				if (res.statusCode === 200) {
					// 将 ArrayBuffer 转换为 Blob
					const blob = new Blob([res.data], { type: 'image/jpeg' })
					// 创建 Blob URL
					blobUrl.value = URL.createObjectURL(blob)
				} else {
					console.error('图片加载失败:', res.statusCode)
					blobUrl.value = props.fallback
				}
			},
			fail: (err) => {
				console.error('图片请求失败:', err)
				blobUrl.value = props.fallback
			}
		})
	} catch (error) {
		console.error('图片加载异常:', error)
		blobUrl.value = props.fallback
	}
}

const handleError = () => {
	blobUrl.value = props.fallback
}

// 监听 src 变化
watch(() => props.src, () => {
	loadImage()
}, { immediate: true })

// 清理 Blob URL
onUnmounted(() => {
	if (blobUrl.value && blobUrl.value.startsWith('blob:')) {
		URL.revokeObjectURL(blobUrl.value)
	}
})
</script>
