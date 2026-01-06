<template>
	<view class="">
		<up-navbar bgColor="transparent" placeholder :autoBack="true" :fixed="false">
			<template #left>
				<up-icon name="arrow-left" color="#ffffff" size="20"></up-icon>
			</template>
			<template #center>
				发布动态
			</template>
			<template #right>
				<view @click="pubilsh">发布</view>
			</template>
		</up-navbar>
		<block v-for="(item, index) in form" :key="index">
			<textarea v-if="index == 2" :placeholder="item.name" v-model="params[item.key]"></textarea>
			<view class="images" v-else-if="index == 3 && params.type === '动态'">
				<up-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" multiple :maxCount="10"
					uploadIcon="plus"></up-upload>
			</view>
			<view class="images" v-else-if="index == 3 && params.type === '视频'">
				<view class="upload-section">
					<text class="section-title">上传封面图片</text>
					<up-upload :fileList="coverFileList" @afterRead="afterReadCover" @delete="deleteCoverPic" multiple
						:maxCount="1" uploadIcon="plus"></up-upload>
				</view>
				<view class="upload-section">
					<text class="section-title">上传视频</text>
					<up-upload :fileList="videoFileList" @afterRead="afterReadVideo" @delete="deleteVideoPic"
						accept="video" :maxCount="1" uploadIcon="plus"></up-upload>
				</view>
			</view>
			<view v-else-if="item.key === 'price' && params.is_free !== '是'" class="back"
				@click="choose(index, item.key)">
				<input type="text" :placeholder="item.name" :disabled="index == 0 || index == 4 || index == 6"
					v-model="params[item.key]" />
				<up-icon v-if="index == 0 || index == 4 || index == 6" name="arrow-right" color="#ffffff"
					size="20"></up-icon>
			</view>
			<!-- 其他字段正常显示 -->
			<view v-else-if="item.key !== 'price'" class="back" @click="choose(index, item.key)">
				<input type="text" :placeholder="item.name" :disabled="index == 0 || index == 4 || index == 6"
					v-model="params[item.key]" />
				<up-icon v-if="index == 0 || index == 4 || index == 6" name="arrow-right" color="#ffffff"
					size="20"></up-icon>
			</view>
		</block>
		<up-picker :show="show" :columns="columns" @cancel="show = false" @confirm="confirm"></up-picker>
	</view>
</template>


<script setup>
import {
	ref,
	reactive
} from 'vue'
import {
	createCommunity,
	createVideo
} from '@/api/community.js'
const form = ref([{
	name: '选择发布类型',
	key: 'type'
}, {
	name: '输入发布标题',
	key: 'title'
}, {
	name: '输入发布内容',
	key: 'content'
}, {
	name: '是否免费',
	key: 'is_free'
}, {
	name: '设置价格（元）',
	key: 'price'
}])
const params = reactive({
	type: '',
	title: '',
	content: '',//描述
	images: [],
	is_free: '',
	price: '',
})
const fileList1 = ref([]);
const coverFileList = ref([]); // 封面图片列表
const videoFileList = ref([]); // 视频文件列表
const show = ref(false);
const columns = reactive([
	[]
]);
const keyIndex = ref('')
// 删除图片
const deletePic = (event) => {
	fileList1.value.splice(event.index, 1);
};

// 删除封面图片
const deleteCoverPic = (event) => {
	coverFileList.value.splice(event.index, 1);
};

// 删除视频
const deleteVideoPic = (event) => {
	videoFileList.value.splice(event.index, 1);
};

// 新增图片
const afterRead = async (event) => {
	let lists = [].concat(event.file);
	let fileListLen = fileList1.value.length;
	for (let i = 0; i < lists.length; i++) {
		const result = await uploadFilePromise(lists[i].url, lists[i].name, 'img');
		let item = fileList1.value[fileListLen];
		fileList1.value.splice(fileListLen, 1, {
			...item,
			status: 'success',
			message: '',
			url: result,
		});
		fileListLen++;
	}
};

// 新增封面图片
const afterReadCover = async (event) => {
	let lists = [].concat(event.file);
	let fileListLen = coverFileList.value.length;
	for (let i = 0; i < lists.length; i++) {
		const result = await uploadFilePromise(lists[i].url, lists[i].name, 'img');
		let item = coverFileList.value[fileListLen];
		coverFileList.value.splice(fileListLen, 1, {
			...item,
			status: 'success',
			message: '',
			url: result,
		});
		fileListLen++;
	}
};

// 新增视频
const afterReadVideo = async (event) => {
	let lists = [].concat(event.file);
	let fileListLen = videoFileList.value.length;
	for (let i = 0; i < lists.length; i++) {
		const result = await uploadFilePromise(lists[i].url, lists[i].name, 'video');
		let item = videoFileList.value[fileListLen];
		videoFileList.value.splice(fileListLen, 1, {
			...item,
			status: 'success',
			message: '',
			url: result,
			duration: lists[i].duration
		});
		fileListLen++;
	}
};

const uploadFilePromise = (url, name, fileType = 'img') => {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token') || ''
		let a = uni.uploadFile({
			url: '/api/upload/',
			filePath: url,
			name: 'file',
			formData: {
				type: fileType,
				file: url,
				name: name,
			},
			header: {
				'Authorization': 'Token ' + token,
			},
			success: (res) => {
				let url = JSON.parse(res.data).data.url
				setTimeout(() => {
					resolve(url);
				}, 1000);
			},
		});
	});
};
const choose = (index, key) => {
	keyIndex.value = key
	if (index == 0) {
		columns[0] = ['视频', '动态']
		show.value = true
	} else if (index == 4) {
		columns[0] = ['是', '否']
		show.value = true
	} else if (index == 6) {
		columns[0] = ['长视频', '短视频']
		show.value = true
	}

}
const confirm = (e) => {
	params[keyIndex.value] = e.value[0]
	show.value = false

	// 如果选择免费，将价格设置为0
	if (keyIndex.value === 'is_free' && e.value[0] === '是') {
		params.price = '0'
	}

	const arr = [{
		name: '选择发布类型',
		key: 'type'
	}, {
		name: '输入发布标题',
		key: 'title'
	}, {
		name: '输入发布内容',
		key: 'content'
	}, {
		name: '图片',
		key: 'images',
		images: fileList1.value
	}, {
		name: '是否免费',
		key: 'is_free'
	}, {
		name: '设置价格（元）',
		key: 'price'
	}]

	form.value = params.type === '视频'
		? [...arr, ...[{ name: '视频类型', key: 'videotype' }]]
		: arr
}
const pubilsh = () => {
	params.user_id = uni.getStorageSync('user_info').user_id
	if (!params.type) return toast('请选择发布类型')
	if (!params.title) return toast('请输入发布标题')
	if (params.title.length > 20) return toast('发布标题不能超过20字')
	if (!params.content) return toast('请输入发布内容')
	if (params.is_free == '') return toast('请选择是否免费')
	if (params.is_free === '否' && (!params.price || params.price.trim() === '' || params.price === '0')) {
		return toast('请设置价格')
	}
	if (params.is_free === '否' && params.price && isNaN(parseFloat(params.price))) {
		return toast('价格必须是数字')
	}
	if (params.type == '视频') {
		if (videoFileList.value.length === 0) return toast('请上传视频')
		if (coverFileList.value.length === 0) return toast('请上传封面图片')
	}

	if (params.type == '动态') {
		if (fileList1.value.length === 0) return toast('请上传图片')
	}

	if (params.type !== '视频') {
		delete params.video_url
	}
	params.is_free = params.is_free == '是' ? true : false
	if (params.type == '视频') {
		params.description = params.content
		params.type = params.videotype == '长视频' ? 'long' : 'short'
		params.data = videoFileList.value[0].url
		params.cover_url = coverFileList.value[0].url
		params.duration = Math.ceil(videoFileList.value[0].duration) * 1000
		delete params.content
		delete params.images
		
		
		createVideo(params).then(res => {
			uni.showToast({
				title: "提交成功",
				success: () => {
					uni.navigateBack()
				}
			})

		})
	} else {
		params.type = 'dynamic'
		params.images = fileList1.value.map(item => item.url)
		createCommunity(params)
			.then(res => {
				uni.showToast({
					title: "提交成功",
					success: () => {
						uni.navigateBack()
					}
				})
			})
	}



}
const toast = (title) => {
	uni.showToast({
		title: title,
		icon: 'none'
	})
}
</script>

<style lang="scss" scoped>
.back,
textarea {
	background: #212028;
	margin: 20rpx;
	padding: 20rpx;
	border-radius: 20rpx;
	width: 89%;
	display: flex;

	input {
		width: 95%;
	}
}

.images {
	margin: 0 20rpx;
}

.upload-section {
	margin-bottom: 30rpx;
}

.section-title {
	display: block;
	color: #8f8e8e;
	font-size: 28rpx;
	margin-bottom: 20rpx;
	padding-left: 10rpx;
}
</style>
<style>
:deep(.u-upload__button) {
	background: #212028 !important;
}
</style>