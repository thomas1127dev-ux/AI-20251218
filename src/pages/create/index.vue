<template>
	<view class="create-page">
		<!-- 导航栏 -->
		<up-navbar
			title="创建克隆人"
			bgColor="transparent"
			:placeholder="true"
			:autoBack="true"
			@clickLeft="handleBack"
		/>

		<!-- 步骤指示器 -->
		<view class="progress-bar">
			<view class="progress-bg">
				<view class="progress-fill" :style="{ width: progressWidth }"></view>
			</view>
			<view class="progress-text">步骤 {{ currentStep }}/8</view>
		</view>

		<!-- 步骤内容区 -->
		<view class="step-container">
			<!-- 步骤1: 基本信息 -->
			<view v-if="currentStep === 1" class="step-content">
				<view class="step-title">基本信息</view>
				<view class="step-subtitle">填写克隆人的基础资料</view>

				<view class="form-section">
					<!-- 头像 -->
					<view class="form-item avatar-item">
						<view class="label">头像</view>
						<view class="avatar-upload" @click="chooseAvatar">
							<image v-if="formData.avatar" class="avatar-img" :src="formData.avatar" mode="aspectFill" />
							<view v-else class="avatar-placeholder">
								<text class="plus">+</text>
								<text class="tip">点击上传</text>
							</view>
						</view>
					</view>

					<!-- 名字 -->
					<view class="form-item">
						<view class="label">名字 <text class="required">*</text></view>
						<input
							class="input"
							v-model="formData.name"
							placeholder="请输入克隆人名字"
							maxlength="20"
						/>
					</view>

					<!-- 生日 -->
					<view class="form-item">
						<view class="label">生日</view>
						<up-datetime-picker
							:show="showDatePicker"
							v-model="formData.birthday"
							mode="date"
						:minDate="minDate"
						:maxDate="maxDate"
							@confirm="confirmDate"
							@cancel="showDatePicker = false"
						/>
						<view class="input" @click="showDatePicker = true">
							<text :class="{ placeholder: !formData.birthday }">
								{{ formData.birthday || '请选择生日' }}
							</text>
						</view>
					</view>

					<!-- 性别 -->
					<view class="form-item">
						<view class="label">性别 <text class="required">*</text></view>
						<view class="gender-options">
							<view
								class="gender-btn"
								:class="{ active: formData.gender === 'male' }"
								@click="formData.gender = 'male'"
							>
								男
							</view>
							<view
								class="gender-btn"
								:class="{ active: formData.gender === 'female' }"
								@click="formData.gender = 'female'"
							>
								女
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 步骤2: 是否本人 -->
			<view v-if="currentStep === 2" class="step-content">
				<view class="step-title">是否本人</view>
				<view class="step-subtitle">请确认这个克隆人是否基于你本人</view>

				<view class="option-cards">
					<view
						class="option-card"
						:class="{ active: formData.isOriginal === true }"
						@click="formData.isOriginal = true"
					>
						<view class="option-title">是本人</view>
						<view class="option-desc">基于我的真实信息创建</view>
					</view>
					<view
						class="option-card"
						:class="{ active: formData.isOriginal === false }"
						@click="formData.isOriginal = false"
					>
						<view class="option-title">不是本人</view>
						<view class="option-desc">创建虚拟角色</view>
					</view>
				</view>
			</view>

			<!-- 步骤3: 原型标签 -->
			<view v-if="currentStep === 3" class="step-content">
				<view class="step-title">原型标签</view>
				<view class="step-subtitle">为克隆人添加原型标签</view>

				<view class="tags-section">
					<view
						v-for="tag in prototypeOptions"
						:key="tag"
						class="tag-item"
						:class="{ active: formData.prototype === tag }"
						@click="formData.prototype = tag"
					>
						{{ tag }}
					</view>
				</view>
			</view>

			<!-- 步骤4: 性格标签 -->
			<view v-if="currentStep === 4" class="step-content">
				<view class="step-title">性格标签</view>
				<view class="step-subtitle">最多选择3个性格标签</view>

				<view class="tags-section">
					<view
						v-for="tag in personalityOptions"
						:key="tag"
						class="tag-item"
						:class="{ active: formData.personality.includes(tag), disabled: !formData.personality.includes(tag) && formData.personality.length >= 3 }"
						@click="toggleTag('personality', tag, 3)"
					>
						{{ tag }}
					</view>
				</view>
			</view>

			<!-- 步骤5: 口头语 -->
			<view v-if="currentStep === 5" class="step-content">
				<view class="step-title">口头语</view>
				<view class="step-subtitle">设置克隆人的专属口头语（可跳过）</view>

				<view class="form-section">
					<textarea
						class="textarea"
						v-model="formData.catchphrase"
						placeholder="例如：哈哈、嗯嗯、好的呀"
						maxlength="50"
						:show-confirm-bar="false"
					/>
					<view class="char-count">{{ formData.catchphrase.length }}/50</view>
				</view>
			</view>

			<!-- 步骤6: 兴趣爱好 -->
			<view v-if="currentStep === 6" class="step-content">
				<view class="step-title">兴趣爱好</view>
				<view class="step-subtitle">最多选择3个兴趣标签</view>

				<view class="tags-section">
					<view
						v-for="tag in interestOptions"
						:key="tag"
						class="tag-item"
						:class="{ active: formData.interests.includes(tag), disabled: !formData.interests.includes(tag) && formData.interests.length >= 3 }"
						@click="toggleTag('interests', tag, 3)"
					>
						{{ tag }}
					</view>
				</view>
			</view>

			<!-- 步骤7: 信息检查 -->
			<view v-if="currentStep === 7" class="step-content">
				<view class="step-title">信息检查</view>
				<view class="step-subtitle">请确认以下信息是否正确</view>

				<view class="review-section">
					<view class="review-item">
						<view class="review-avatar">
							<image v-if="formData.avatar" class="avatar-img" :src="formData.avatar" mode="aspectFill" />
							<view v-else class="no-avatar">无头像</view>
						</view>
					</view>
					<view class="review-item">
						<view class="review-label">名字</view>
						<view class="review-value">{{ formData.name || '未填写' }}</view>
					</view>
					<view class="review-item">
						<view class="review-label">生日</view>
						<view class="review-value">{{ formData.birthday || '未填写' }}</view>
					</view>
					<view class="review-item">
						<view class="review-label">性别</view>
						<view class="review-value">{{ formData.gender === 'male' ? '男' : formData.gender === 'female' ? '女' : '未选择' }}</view>
					</view>
					<view class="review-item">
						<view class="review-label">是否本人</view>
						<view class="review-value">{{ formData.isOriginal === true ? '是' : formData.isOriginal === false ? '否' : '未选择' }}</view>
					</view>
					<view class="review-item">
						<view class="review-label">原型</view>
						<view class="review-value">{{ formData.prototype || '未选择' }}</view>
					</view>
					<view class="review-item">
						<view class="review-label">性格</view>
						<view class="review-value">{{ formData.personality.join('、') || '未选择' }}</view>
					</view>
					<view class="review-item">
						<view class="review-label">口头语</view>
						<view class="review-value">{{ formData.catchphrase || '未填写' }}</view>
					</view>
					<view class="review-item">
						<view class="review-label">兴趣爱好</view>
						<view class="review-value">{{ formData.interests.join('、') || '未选择' }}</view>
					</view>
				</view>
			</view>

			<!-- 步骤8: 声音选择 -->
			<view v-if="currentStep === 8" class="step-content">
				<view class="step-title">声音选择</view>
				<view class="step-subtitle">为克隆人选择声音</view>

				<view class="voice-options">
					<view
						class="voice-card"
						:class="{ active: formData.voiceType === 'clone' }"
						@click="formData.voiceType = 'clone'"
					>
						<view class="voice-icon">🎤</view>
						<view class="voice-title">克隆自己声音</view>
						<view class="voice-desc">录制你的声音创建专属音色</view>
					</view>
					<view
						class="voice-card"
						:class="{ active: formData.voiceType === 'purchase' }"
						@click="formData.voiceType = 'purchase'"
					>
						<view class="voice-icon">🛒</view>
						<view class="voice-title">购买他人声音</view>
						<view class="voice-desc">从声音库中选择喜欢的音色</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-actions">
			<view class="btn-row">
				<view v-if="currentStep > 1" class="btn btn-secondary" @click="prevStep">
					上一步
				</view>
				<view class="btn btn-primary" :class="{ 'full-width': currentStep === 1 }" @click="nextStep">
					{{ currentStep === 8 ? '完成创建' : '下一步' }}
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createClone, uploadAvatar } from '@/api/clone.js'
import { userinfoStore } from '@/store/userinfos.js'
import { getAvatarUrl } from '@/utils/avatar.js'
import { CacheManager } from '@/utils/cache-manager.js'

const store = userinfoStore()

// 当前步骤
const currentStep = ref(1)

// 日期选择器
const showDatePicker = ref(false)

// 日期范围设置
const minDate = ref(new Date('1950-01-01').getTime())
const maxDate = ref(new Date().getTime())

// 表单数据
const formData = ref({
	avatar: '',
	name: '',
	birthday: '2000-01-01', // 默认生日
	gender: '',
	isOriginal: null,
	prototype: '',
	personality: [],
	catchphrase: '',
	interests: [],
	voiceType: ''
})

// 原型标签选项
const prototypeOptions = ['高颜值大V', '二次元', '御姐', '萝莉', '邻家女孩', '运动健将', '文艺青年', '霸道总裁']

// 性格标签选项
const personalityOptions = ['外向', '内向', '开朗', '沉稳', '温柔', '活泼', '理性', '感性', '幽默', '严肃', '乐观', '悲观']

// 兴趣爱好选项
const interestOptions = ['音乐', '电影', '运动', '阅读', '游戏', '旅行', '美食', '摄影', '绘画', '舞蹈', '编程', '时尚']

// 进度条宽度
const progressWidth = computed(() => {
	return `${(currentStep.value / 8) * 100}%`
})

// 选择头像
const chooseAvatar = () => {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			formData.value.avatar = res.tempFilePaths[0]
			// TODO: 可以在这里直接上传头像
			// uploadAvatar(res.tempFilePaths[0]).then(response => {
			// 	formData.value.avatar = response.data.url
			// })
		}
	})
}

// 确认日期
const confirmDate = (e) => {
	const timestamp = e.value
	const date = new Date(timestamp)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	formData.value.birthday = `${year}-${month}-${day}`
	showDatePicker.value = false
}

// 切换标签选择
const toggleTag = (field, tag, maxCount) => {
	const index = formData.value[field].indexOf(tag)
	if (index > -1) {
		// 已选中，取消选择
		formData.value[field].splice(index, 1)
	} else {
		// 未选中，添加选择
		if (formData.value[field].length < maxCount) {
			formData.value[field].push(tag)
		}
	}
}

// 验证当前步骤
const validateStep = () => {
	switch (currentStep.value) {
		case 1:
			if (!formData.value.name) {
				uni.showToast({ title: '请输入名字', icon: 'none' })
				return false
			}
			if (!formData.value.gender) {
				uni.showToast({ title: '请选择性别', icon: 'none' })
				return false
			}
			break
		case 2:
			if (formData.value.isOriginal === null) {
				uni.showToast({ title: '请选择是否本人', icon: 'none' })
				return false
			}
			break
		case 3:
			if (!formData.value.prototype) {
				uni.showToast({ title: '请选择原型标签', icon: 'none' })
				return false
			}
			break
		case 4:
			if (formData.value.personality.length === 0) {
				uni.showToast({ title: '请至少选择1个性格标签', icon: 'none' })
				return false
			}
			break
		case 5:
			// 口头语可跳过
			break
		case 6:
			if (formData.value.interests.length === 0) {
				uni.showToast({ title: '请至少选择1个兴趣标签', icon: 'none' })
				return false
			}
			break
		case 7:
			// 信息检查无需验证
			break
		case 8:
			if (!formData.value.voiceType) {
				uni.showToast({ title: '请选择声音类型', icon: 'none' })
				return false
			}
			break
	}
	return true
}

// 下一步
const nextStep = () => {
	if (!validateStep()) return

	if (currentStep.value === 8) {
		// 完成创建
		submitCreate()
	} else {
		currentStep.value++
	}
}

// 上一步
const prevStep = () => {
	if (currentStep.value > 1) {
		currentStep.value--
	}
}

// 返回处理
const handleBack = () => {
	if (currentStep.value > 1) {
		prevStep()
	} else {
		uni.navigateBack()
	}
}

// 提交创建
const submitCreate = () => {
	uni.showLoading({ title: '创建中...' })

	// 调用创建接口
	createClone(formData.value)
		.then((response) => {
			uni.hideLoading()
			if (response.code === 200) {
				console.log('克隆人创建成功，设置刷新标记')

				// 设置克隆人列表刷新标记（无论选择哪个选项，都需要刷新列表）
				CacheManager.setRefreshFlag('ownedClones')
				CacheManager.setRefreshFlag('createdClones')

				// 创建成功，询问是否立即开始对话
				uni.showModal({
					title: '创建成功',
					content: '是否立即与TA开始对话？',
					confirmText: '立即聊天',
					cancelText: '稍后再说',
					success: (res) => {
						if (res.confirm) {
							// 立即开始对话
							const cloneData = response.data
							const personInfoData = {
								id: cloneData.id,
								user_nickname: cloneData.name,
								avatar: getAvatarUrl(cloneData.avatar),
								session_id: cloneData.id,
								isClone: true
							}

							// 保存到 store
							if (store.setPersonInfo) {
								store.setPersonInfo(personInfoData)
							} else {
								store.personInfo = personInfoData
							}

							// 跳转到对话页
							uni.redirectTo({
								url: '/pages/my/dialogue'
							})
						} else {
							// 返回对话列表
							uni.navigateBack()
						}
					}
				})
			} else {
				uni.showToast({
					title: response.message || '创建失败',
					icon: 'none'
				})
			}
		})
		.catch((error) => {
			uni.hideLoading()
			console.error('创建失败:', error)
			uni.showToast({
				title: '创建失败，请重试',
				icon: 'none'
			})
		})
}
</script>

<style lang="scss" scoped>
.create-page {
	min-height: 100vh;
	background: #000000;
	padding-bottom: 200rpx;
}

.progress-bar {
	padding: 32rpx 48rpx;

	.progress-bg {
		height: 8rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 4rpx;
		overflow: hidden;
		margin-bottom: 16rpx;

		.progress-fill {
			height: 100%;
			background: linear-gradient(90deg, #00D9C5 0%, #00B3A6 100%);
			border-radius: 4rpx;
			transition: width 0.3s;
		}
	}

	.progress-text {
		text-align: center;
		color: rgba(255, 255, 255, 0.6);
		font-size: 24rpx;
	}
}

.step-container {
	padding: 0 48rpx;
}

.step-content {
	.step-title {
		color: #FFFFFF;
		font-size: 48rpx;
		font-weight: 600;
		margin-bottom: 16rpx;
	}

	.step-subtitle {
		color: rgba(255, 255, 255, 0.5);
		font-size: 28rpx;
		margin-bottom: 48rpx;
	}
}

.form-section {
	.form-item {
		margin-bottom: 40rpx;

		.label {
			color: #FFFFFF;
			font-size: 28rpx;
			margin-bottom: 16rpx;

			.required {
				color: #FF6B6B;
			}
		}

		.input {
			background: rgba(255, 255, 255, 0.05);
			border: 2rpx solid rgba(255, 255, 255, 0.1);
			border-radius: 12rpx;
			padding: 24rpx;
			color: #FFFFFF;
			font-size: 28rpx;

			.placeholder {
				color: rgba(255, 255, 255, 0.3);
			}
		}

		&.avatar-item {
			display: flex;
			align-items: center;

			.avatar-upload {
				width: 160rpx;
				height: 160rpx;
				border-radius: 16rpx;
				overflow: hidden;
				margin-left: 24rpx;

				.avatar-img {
					width: 100%;
					height: 100%;
				}

				.avatar-placeholder {
					width: 100%;
					height: 100%;
					background: rgba(255, 255, 255, 0.05);
					border: 2rpx dashed rgba(255, 255, 255, 0.2);
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.plus {
						color: rgba(255, 255, 255, 0.4);
						font-size: 48rpx;
						line-height: 1;
					}

					.tip {
						color: rgba(255, 255, 255, 0.3);
						font-size: 20rpx;
						margin-top: 8rpx;
					}
				}
			}
		}

		.gender-options {
			display: flex;
			gap: 24rpx;

			.gender-btn {
				flex: 1;
				background: rgba(255, 255, 255, 0.05);
				border: 2rpx solid rgba(255, 255, 255, 0.1);
				border-radius: 12rpx;
				padding: 24rpx;
				text-align: center;
				color: rgba(255, 255, 255, 0.6);
				font-size: 28rpx;
				transition: all 0.3s;

				&.active {
					background: rgba(0, 217, 197, 0.1);
					border-color: #00D9C5;
					color: #00D9C5;
				}
			}
		}
	}
}

.option-cards {
	.option-card {
		background: rgba(255, 255, 255, 0.05);
		border: 2rpx solid rgba(255, 255, 255, 0.1);
		border-radius: 16rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;
		transition: all 0.3s;

		.option-title {
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: 500;
			margin-bottom: 8rpx;
		}

		.option-desc {
			color: rgba(255, 255, 255, 0.5);
			font-size: 24rpx;
		}

		&.active {
			background: rgba(0, 217, 197, 0.1);
			border-color: #00D9C5;

			.option-title {
				color: #00D9C5;
			}
		}
	}
}

.tags-section {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;

	.tag-item {
		background: rgba(255, 255, 255, 0.05);
		border: 2rpx solid rgba(255, 255, 255, 0.1);
		border-radius: 40rpx;
		padding: 16rpx 32rpx;
		color: rgba(255, 255, 255, 0.6);
		font-size: 26rpx;
		transition: all 0.3s;

		&.active {
			background: rgba(0, 217, 197, 0.1);
			border-color: #00D9C5;
			color: #00D9C5;
		}

		&.disabled {
			opacity: 0.4;
		}
	}
}

.textarea {
	width: 100%;
	min-height: 300rpx;
	background: rgba(255, 255, 255, 0.05);
	border: 2rpx solid rgba(255, 255, 255, 0.1);
	border-radius: 12rpx;
	padding: 24rpx;
	color: #FFFFFF;
	font-size: 28rpx;
	box-sizing: border-box;
}

.char-count {
	text-align: right;
	color: rgba(255, 255, 255, 0.3);
	font-size: 24rpx;
	margin-top: 8rpx;
}

.review-section {
	.review-item {
		padding: 24rpx 0;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);

		&:last-child {
			border-bottom: none;
		}

		.review-avatar {
			display: flex;
			justify-content: center;
			margin-bottom: 24rpx;

			.avatar-img {
				width: 200rpx;
				height: 200rpx;
				border-radius: 16rpx;
			}

			.no-avatar {
				width: 200rpx;
				height: 200rpx;
				background: rgba(255, 255, 255, 0.05);
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: rgba(255, 255, 255, 0.3);
				font-size: 24rpx;
			}
		}

		.review-label {
			color: rgba(255, 255, 255, 0.5);
			font-size: 24rpx;
			margin-bottom: 8rpx;
		}

		.review-value {
			color: #FFFFFF;
			font-size: 28rpx;
		}
	}
}

.voice-options {
	.voice-card {
		background: rgba(255, 255, 255, 0.05);
		border: 2rpx solid rgba(255, 255, 255, 0.1);
		border-radius: 16rpx;
		padding: 40rpx;
		margin-bottom: 24rpx;
		text-align: center;
		transition: all 0.3s;

		.voice-icon {
			font-size: 80rpx;
			margin-bottom: 16rpx;
		}

		.voice-title {
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: 500;
			margin-bottom: 8rpx;
		}

		.voice-desc {
			color: rgba(255, 255, 255, 0.5);
			font-size: 24rpx;
		}

		&.active {
			background: rgba(0, 217, 197, 0.1);
			border-color: #00D9C5;

			.voice-title {
				color: #00D9C5;
			}
		}
	}
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.95);
	padding: 24rpx 48rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	backdrop-filter: blur(20rpx);
	border-top: 1rpx solid rgba(255, 255, 255, 0.1);

	.btn-row {
		display: flex;
		gap: 24rpx;
	}

	.btn {
		flex: 1;
		height: 96rpx;
		border-radius: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		font-weight: 500;
		transition: all 0.3s;

		&.full-width {
			flex: 1;
		}

		&.btn-primary {
			background: linear-gradient(135deg, #00D9C5 0%, #00B3A6 100%);
			color: #FFFFFF;

			&:active {
				opacity: 0.8;
			}
		}

		&.btn-secondary {
			background: rgba(255, 255, 255, 0.05);
			border: 2rpx solid rgba(255, 255, 255, 0.2);
			color: rgba(255, 255, 255, 0.8);

			&:active {
				background: rgba(255, 255, 255, 0.1);
			}
		}
	}
}
</style>
