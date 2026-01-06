<template>
	 <view v-if="selectedVipData.length">会员权益</view>
	 <view class="con">
		 <view class="list" v-for="(item,index) in selectedVipData" :key="index">
			 <up-image :src="item.benefits_icon" shape="circle" width="42" height="42"></up-image>
			 <text>{{ item.name }}</text>
		 </view>
	 </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
	selectedVipData: {
		type: Array,
		default: () => []
	}
})

</script>

<style lang="scss" scoped> 
.vip-interests {
	.title {
		font-size: 28rpx;
		color: #fff;
		margin-bottom: 20rpx;
	}
	
	.selected-info {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		
		.selected-title {
			font-size: 26rpx;
			color: #F3D4AB;
			font-weight: bold;
		}
	}
}

.con{
	display: flex;
	flex-wrap: wrap;
	max-height: 500rpx;
	overflow-y: scroll;
}
.list{
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20rpx;
	width: 25%;
	text{
		margin-top: 20rpx;
		font-size: 20rpx;
		color: #fff;
	}
}
</style>