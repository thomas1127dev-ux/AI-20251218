<template>
	<view class="">
		<up-navbar bgColor="transparent" placeholder :autoBack="true" :fixed="false">
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
			</template>
			<template #center>
				资料编辑
			</template>
			<template #right>
				<view @click="save">保存</view>
			</template>
		</up-navbar>
		<view class="avatar" @click="uploadImage">
			<up-image :show-loading="true" :src="userinfo.avatar" width="80px" height="80px" shape="circle"></up-image>
		</view>
		<view class="form" v-for="(item, index) in form" :key="index">
			<text>{{ item.name }}</text>
			<up-textarea v-if="index == 2" v-model="item.key" placeholder="请输入内容" count maxlength="20"
				border="none"></up-textarea>
			<input type="text" v-else :placeholder="'请输入' + item.name" v-model="item.key" :disabled="index == 1" />

		</view>
	</view>
</template>

<script setup>
import {
	ref,
	reactive
} from 'vue'
import {
	userinfoStore
} from '@/store/userinfos'
const {
	userinfo
} = userinfoStore()
const store = userinfoStore()
import {
	updataUserinfo
} from '@/api/setup.js'

const form = reactive([{
	name: '昵称',
	type: 'input',
	key: userinfo.user_nickname
}, {
	name: 'ID',
	type: 'input',
	key: userinfo.id
}, {
	name: '签名',
	type: 'textera',
	key: userinfo.user_bio || ''
}])
const uploadImage = () => {
	let url = '/api/upload/'
	const token = uni.getStorageSync('token') || ''
	uni.chooseImage({
		count: 1,
		type: 'file',
		success: (res) => {
			uni.uploadFile({
				url: url,
				filePath: res.tempFiles[0].path,
				name: 'file',
				formData: {
					file: res.tempFiles[0].path,
					name: res.tempFiles[0].name,
					type: 'img'
				},
				header: {
					'Authorization': 'Token ' + token,
				},
				success: uploadFileRes => {
					userinfo.avatar = JSON.parse(uploadFileRes.data).data.url
				},
				complete() {
					uni.hideLoading(); //关闭弹窗
				}
			});
		}
	})
};
const save = () => {
	const params = form.reduce((acc, item, idx) => {
		const map = ['user_nickname', 'id', 'user_bio']
		acc[map[idx]] = item.key
		return acc
	}, {})
	updataUserinfo(params.id, {
		...params,
		avatar: userinfo.avatar,
		username: userinfo.username
	}).then(res => {
		store.getUserinfo({ id: userinfo.id })
		uni.showToast({
			title: '提交成功',
			duration: 2000,
			success: () => {
				uni.navigateBack()
			}
		})
	})
		.catch(err => {


		})


}
</script>

<style lang="scss" scoped>
.avatar {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 50rpx 0 30rpx 0;
}

.form {
	display: flex;
	margin: 20rpx;

	input {
		background: #212028;
		margin-left: 20rpx;
		padding: 15rpx 20rpx;
		width: 80%;
		border-radius: 10rpx;
	}

	text {
		display: block;
		width: 80rpx;
	}
}

.u-textarea {
	margin-left: 20rpx;
	background-color: #212028;
}
</style>

<style>
.u-textarea__count {
	background: transparent !important;

}
</style>